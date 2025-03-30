import { auth } from "@/auth";
import { db } from "@bubba/db";
import { tool } from "ai";
import { z } from "zod";

export function getPolicyTools() {
	return {
		getPolicies,
		getPolicyContent,
	};
}

export const getPolicies = tool({
	description: "Get all policies for the organization",
	parameters: z.object({
		status: z.enum(["draft", "published"]).optional(),
	}),
	execute: async ({ status }) => {
		const session = await auth();

		if (!session?.user.organizationId) {
			return { error: "Unauthorized" };
		}

		const policies = await db.organizationPolicy.findMany({
			where: { organizationId: session.user.organizationId, status },
			select: {
				id: true,
				policy: {
					select: {
						name: true,
						description: true,
						department: true,
						usedBy: true,
					},
				},
			},
		});

		return policies;
	},
});

export const getPolicyContent = tool({
	description:
		"Get the content of a specific policy by id. We can only acquire the policy id by running the getPolicies tool first.",
	parameters: z.object({
		id: z.string(),
	}),
	execute: async ({ id }) => {
		const session = await auth();

		if (!session?.user.organizationId) {
			return { error: "Unauthorized" };
		}

		const policy = await db.organizationPolicy.findUnique({
			where: { id, organizationId: session.user.organizationId },
			select: {
				content: true,
			},
		});

		return policy?.content;
	},
});
