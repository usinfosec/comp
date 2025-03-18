// update-organization-action.ts

"use server";

import { createOrganizationAndConnectUser } from "@/auth/org";
import { db } from "@bubba/db";
import { authActionClient } from "../safe-action";
import { organizationSchema } from "../schema";
import { tasks } from "@trigger.dev/sdk/v3";
import type { createOrganizationTask } from "@/jobs/tasks/organization/create-organization";

export const createOrganizationAction = authActionClient
	.schema(organizationSchema)
	.metadata({
		name: "create-organization",
		track: {
			event: "create-organization",
			channel: "server",
		},
	})
	.action(async ({ parsedInput, ctx }) => {
		const { name, website, frameworks } = parsedInput;
		const { id: userId, organizationId } = ctx.user;

		if (!name || !website) {
			console.log("Invalid input detected:", { name, website });
			throw new Error("Invalid user input");
		}

		if (!organizationId) {
			await createOrganizationAndConnectUser({
				userId,
				normalizedEmail: ctx.user.email!,
			});
		}

		const organization = await db.organization.findFirst({
			where: {
				users: {
					some: {
						id: userId,
					},
				},
			},
		});

		if (!organization) {
			throw new Error("Organization not found");
		}

		try {
			const handle = await tasks.trigger<typeof createOrganizationTask>(
				"create-organization",
				{
					userId,
					fullName: name,
					website,
					frameworkIds: frameworks,
					organizationId: organization.id,
				},
			);

			return {
				success: true,
				runId: handle.id,
				publicAccessToken: handle.publicAccessToken,
			};
		} catch (error) {
			console.error("Error during organization update:", error);

			throw new Error("Failed to update organization");
		}
	});
