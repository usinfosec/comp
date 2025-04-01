"use server";

import { db } from "@bubba/db";
import { logger } from "@trigger.dev/sdk/v3";
import { authActionClient } from "../safe-action";

export const getPoliciesByFrameworkAction = authActionClient
	.metadata({
		name: "get-policies-by-framework",
		track: {
			event: "get-policies-by-framework",
			channel: "server",
		},
	})
	.action(async ({ parsedInput, ctx }) => {
		const { user } = ctx;

		if (!user) {
			return {
				success: false,
				error: "Not authorized",
			};
		}

		try {
			const policies = await db.po.findMany();

			if (!policies) {
				return {
					success: false,
					error: "Policies not found",
				};
			}

			return {
				success: true,
				data: policies,
			};
		} catch (error) {
			logger.error("Error getting policies by framework:", {
				error,
				errorMessage: error instanceof Error ? error.message : "Unknown error",
				errorStack: error instanceof Error ? error.stack : undefined,
			});
			return {
				success: false,
				error:
					error instanceof Error
						? error.message
						: "Failed to get policies by framework",
			};
		}
	});
