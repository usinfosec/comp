"use server";

import { authActionClient } from "../safe-action";
import { organizationSchema } from "../schema";
import { tasks } from "@trigger.dev/sdk/v3";
import { auth } from "@bubba/auth";
import type { createOrganizationTask } from "@/jobs/tasks/organization/create-organization";
import { headers } from "next/headers";

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
		const { name, frameworks } = parsedInput;
		const { id: userId } = ctx.user;

		if (!name) {
			console.log("Invalid input detected:", { name });
			throw new Error("Invalid user input");
		}

		try {
			const session = await auth.api.getSession({
				headers: await headers(),
			});

			if (!session?.session.activeOrganizationId) {
				throw new Error("User is not part of an organization");
			}

			const handle = await tasks.trigger<typeof createOrganizationTask>(
				"create-organization",
				{
					userId,
					name,
					frameworkIds: frameworks,
					organizationId: session.session.activeOrganizationId,
				},
			);

			return {
				success: true,
				runId: handle.id,
				publicAccessToken: handle.publicAccessToken,
				organizationId: session.session.activeOrganizationId,
			};
		} catch (error) {
			console.error("Error during organization update:", error);

			throw new Error("Failed to update organization");
		}
	});
