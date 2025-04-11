"use server";

import type { ActionResponse } from "@/app/actions/actions";
import { db } from "@comp/db";
import { z } from "zod";
import { authActionClient } from "../../../../../../actions/safe-action";

const orgStatsSchema = z.object({
	organizationId: z.string().min(1),
});

export const getOrgStatsAction = authActionClient
	.schema(orgStatsSchema)
	.metadata({
		name: "get-org-stats",
		track: {
			event: "get-org-stats",
			channel: "server",
		},
	})
	.action(async ({ parsedInput }): Promise<ActionResponse> => {
		const { organizationId } = parsedInput;

		try {
			// Verify the organization exists
			const organization = await db.organization.findUnique({
				where: { id: organizationId },
			});

			if (!organization) {
				return {
					success: false,
					error: "Organization not found",
				};
			}

			// Get counts of different items
			const [
				controlsCount,
				policiesCount,
				evidenceCount,
				requirementMapsCount,
			] = await Promise.all([
				db.control.count({
					where: { organizationId },
				}),
				db.policy.count({
					where: { organizationId },
				}),
				db.evidence.count({
					where: { organizationId },
				}),
				db.requirementMap.count({
					where: {
						control: {
							organizationId,
						},
					},
				}),
			]);

			return {
				success: true,
				data: {
					controls: controlsCount,
					policies: policiesCount,
					evidence: evidenceCount,
					requirementMaps: requirementMapsCount,
				},
			};
		} catch (error) {
			console.error("Error fetching organization stats:", error);
			return {
				success: false,
				error: "Failed to fetch organization stats",
			};
		}
	});
