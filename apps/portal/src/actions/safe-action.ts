import { auth } from "@/app/lib/auth";
import { logger } from "@/utils/logger";
import { client } from "@comp/kv";
import { Ratelimit } from "@upstash/ratelimit";
import {
	DEFAULT_SERVER_ERROR_MESSAGE,
	createSafeActionClient,
} from "next-safe-action";
import { headers } from "next/headers";
import { z } from "zod";

const ratelimit = new Ratelimit({
	limiter: Ratelimit.fixedWindow(10, "10s"),
	redis: client,
});

export const actionClientWithMeta = createSafeActionClient({
	handleServerError(e) {
		if (e instanceof Error) {
			return e.message;
		}

		return DEFAULT_SERVER_ERROR_MESSAGE;
	},
	defineMetadataSchema() {
		return z.object({
			name: z.string(),
			ip: z.string().optional(),
			userAgent: z.string().optional(),
			track: z
				.object({
					event: z.string(),
					channel: z.string(),
				})
				.optional(),
		});
	},
});

export const authActionClient = actionClientWithMeta
	.use(async ({ next, clientInput }) => {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Unauthorized");
		}

		const result = await next({ ctx: {} });

		if (process.env.NODE_ENV === "development") {
			logger("Input ->", clientInput as string);
			logger("Result ->", result.data as string);

			return result;
		}

		return result;
	})
	.use(async ({ next, metadata }) => {
		const headersList = await headers();

		const { success, remaining } = await ratelimit.limit(
			`${headersList.get("x-forwarded-for")}-${metadata.name}`,
		);

		if (!success) {
			throw new Error("Too many requests");
		}

		return next({
			ctx: {
				ip: headersList.get("x-forwarded-for"),
				userAgent: headersList.get("user-agent"),
				ratelimit: {
					remaining,
				},
			},
		});
	})
	.use(async ({ next, metadata, ctx }) => {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Unauthorized");
		}

		return next({
			ctx: {
				user: session.user,
			},
		});
	});
