import { auth } from "@/auth/auth";
import { db } from "@bubba/db";
import { tool } from "ai";
import { z } from "zod";
import { headers } from "next/headers";

export function getOrganizationTools() {
	return {
		findOrganization,
	};
}

export const findOrganization = tool({
	description: "Find the users organization and it's details",
	parameters: z.object({}),
	execute: async () => {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user.organizationId) {
			return { error: "Unauthorized" };
		}

		const org = await db.organization.findUnique({
			where: { id: session.user.organizationId },
			select: {
				name: true,
				website: true,
			},
		});

		if (!org) {
			return {
				organization: null,
				message: "Organization not found",
			};
		}

		return {
			organization: org,
		};
	},
});
