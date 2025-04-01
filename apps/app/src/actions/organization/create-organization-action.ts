"use server";

import { authActionClient } from "../safe-action";
import { organizationSchema } from "../schema";
import { tasks } from "@trigger.dev/sdk/v3";
import type { createOrganizationTask } from "@/jobs/tasks/organization/create-organization";
import { db } from "@bubba/db";

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
		const { id: userId } = ctx.user;

		if (!name || !website) {
			console.log("Invalid input detected:", { name, website });
			throw new Error("Invalid user input");
		}

		try {
			const newOrganization = await db.$transaction(async (tx) => {
				const organization = await tx.organization.create({
					data: {
						name,
						tier: "free",
						website,
						members: {
							create: {
								userId,
								role: "owner",
							},
						},
					},
					select: {
						id: true,
						name: true,
					},
				});

				await tx.user.update({
					where: { id: userId },
					data: { organizationId: organization.id },
				});

				return organization;
			});

			const handle = await tasks.trigger<typeof createOrganizationTask>(
				"create-organization",
				{
					userId,
					fullName: name,
					website,
					frameworkIds: frameworks,
					organizationId: newOrganization.id,
				},
			);

			return {
				success: true,
				runId: handle.id,
				publicAccessToken: handle.publicAccessToken,
				newOrganization,
			};
		} catch (error) {
			console.error("Error during organization update:", error);

			throw new Error("Failed to update organization");
		}
	});
