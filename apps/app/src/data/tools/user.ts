import { auth } from "@/auth";
import { tool } from "ai";
import { z } from "zod";

export function getUserTools() {
	return {
		getUser,
	};
}

export const getUser = tool({
	description: "Get the user's id and organization id",
	parameters: z.object({}),
	execute: async () => {
		const session = await auth();

		if (!session?.user.organizationId) {
			return { error: "Unauthorized" };
		}

		return {
			userId: session.user.id,
			organizationId: session.user.organizationId,
		};
	},
});
