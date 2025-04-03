"use server";

import { authActionClient } from "../safe-action";
import { organizationSchema } from "../schema";
import { auth } from "@comp/auth";
import { headers } from "next/headers";
import {
	createFrameworkInstance,
	getRelevantControls,
	createOrganizationPolicies,
	createOrganizationEvidence,
	createControlArtifacts,
} from "./lib/utils";

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

			const organizationId = session.session.activeOrganizationId;

			const organizationFrameworks = await Promise.all(
				frameworks.map((frameworkId) =>
					createFrameworkInstance(organizationId, frameworkId),
				),
			);

			// Get controls relevant to the selected frameworks
			const relevantControls = getRelevantControls(frameworks);

			// Create policies required by the controls
			const policiesForFrameworks = await createOrganizationPolicies(
				organizationId,
				relevantControls,
				userId,
			);

			// Create evidence requirements for the controls
			const evidenceForFrameworks = await createOrganizationEvidence(
				organizationId,
				relevantControls,
				userId,
			);

			// Link controls to their policies and evidence through artifacts
			await createControlArtifacts(
				organizationId,
				organizationFrameworks.map((framework) => framework.id),
				relevantControls,
				policiesForFrameworks,
				evidenceForFrameworks,
			);
			return {
				success: true,
				organizationId: session.session.activeOrganizationId,
			};
		} catch (error) {
			console.error("Error during organization update:", error);

			throw new Error("Failed to update organization");
		}
	});
