"use server";

import { authActionClient } from "../../../../../../actions/safe-action";
import { z } from "zod";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import {
	getRelevantControls,
	createOrganizationPolicies,
	createOrganizationEvidence,
	createControlArtifacts,
} from "../../../../../../actions/organization/lib/utils";
import { db } from "@comp/db";
import type { ActionResponse } from "@/app/actions/actions";
import { FrameworkId } from "@comp/data";
import type { TemplateControl } from "@comp/data";
import type {
	Artifact,
	Control,
	Evidence,
	Policy,
	RequirementMap,
	FrameworkInstance,
} from "@prisma/client";
import type { RequirementId } from "@prisma/client";

const checkMissingItemsSchema = z.object({
	organizationId: z.string(),
});

interface MissingItems {
	controls: TemplateControl[];
	policyIds: Set<string>;
	evidenceIds: Set<string>;
}

interface ExistingControl extends Control {
	artifacts: (Artifact & {
		policy: (Policy & { name: string }) | null;
		evidence: (Evidence & { name: string }) | null;
	})[];
	requirementsMapped: RequirementMap[];
}

function findMissingItems(
	relevantControls: TemplateControl[],
	existingControls: ExistingControl[],
): MissingItems {
	const existingPolicyNames = new Set<string>();
	const existingEvidenceNames = new Set<string>();
	const existingControlNames = new Set<string>();

	// Build sets of existing item names
	for (const control of existingControls) {
		existingControlNames.add(control.name);
		for (const artifact of control.artifacts) {
			if (artifact.policy?.name) {
				existingPolicyNames.add(artifact.policy.name);
			}
			if (artifact.evidence?.name) {
				existingEvidenceNames.add(artifact.evidence.name);
			}
		}
	}

	// Find missing controls
	const missingControls = relevantControls.filter(
		(control) => !existingControlNames.has(control.name),
	);

	// Find missing policies and evidence based on names/template IDs
	const missingPolicyTemplateIds = new Set<string>();
	const missingEvidenceTemplateIds = new Set<string>();

	for (const control of relevantControls) {
		for (const artifact of control.mappedArtifacts) {
			if (
				artifact.type === "policy" &&
				!existingPolicyNames.has(artifact.policyId)
			) {
				missingPolicyTemplateIds.add(artifact.policyId);
			}
			if (
				artifact.type === "evidence" &&
				!existingEvidenceNames.has(artifact.evidenceId)
			) {
				missingEvidenceTemplateIds.add(artifact.evidenceId);
			}
		}
	}

	return {
		controls: missingControls,
		policyIds: missingPolicyTemplateIds,
		evidenceIds: missingEvidenceTemplateIds,
	};
}

async function createMissingRequirementMaps(
	controls: Control[],
	templateControls: TemplateControl[],
	frameworkInstances: FrameworkInstance[],
	tx: any,
) {
	const existingMaps = await tx.requirementMap.findMany({
		where: {
			controlId: {
				in: controls.map((c) => c.id),
			},
		},
	});

	const existingMapKeys = new Set(
		existingMaps.map(
			(map: RequirementMap) =>
				`${map.controlId}-${map.frameworkInstanceId}-${map.requirementId}`,
		),
	);

	const controlMap = new Map(
		controls.map((control) => [control.name, control]),
	);
	const templateControlMap = new Map(
		templateControls.map((control) => [control.name, control]),
	);

	const missingMaps: Array<{
		controlId: string;
		frameworkInstanceId: string;
		requirementId: RequirementId;
	}> = [];

	// For each control
	for (const control of controls) {
		const templateControl = templateControlMap.get(control.name);
		if (!templateControl) continue;

		// For each framework instance
		for (const frameworkInstance of frameworkInstances) {
			// Get requirements for this framework
			const frameworkRequirements = templateControl.mappedRequirements.filter(
				(req) => req.frameworkId === frameworkInstance.frameworkId,
			);

			// Check if requirement maps exist
			for (const requirement of frameworkRequirements) {
				const mapKey = `${control.id}-${frameworkInstance.id}-${
					frameworkInstance.frameworkId
				}_${requirement.requirementId}`;

				if (!existingMapKeys.has(mapKey)) {
					missingMaps.push({
						controlId: control.id,
						frameworkInstanceId: frameworkInstance.id,
						requirementId:
							`${frameworkInstance.frameworkId}_${requirement.requirementId}` as RequirementId,
					});
				}
			}
		}
	}

	if (missingMaps.length > 0) {
		const result = await tx.requirementMap.createMany({
			data: missingMaps,
			skipDuplicates: true,
		});
		return result.count;
	}

	return 0;
}

export const checkMissingItemsAction = authActionClient
	.schema(checkMissingItemsSchema)
	.metadata({
		name: "check-missing-items",
		track: {
			event: "check-missing-items",
			channel: "server",
		},
	})
	.action(async ({ parsedInput, ctx }): Promise<ActionResponse> => {
		const { organizationId } = parsedInput;
		const { id: userId } = ctx.user;

		try {
			// 1. Get organization's frameworks
			const organization = await db.organization.findUnique({
				where: { id: organizationId },
				include: {
					frameworkInstances: true,
				},
			});

			if (!organization) {
				return {
					success: false,
					error: "Organization not found",
				};
			}

			const frameworkIds = organization.frameworkInstances.map(
				(instance) => instance.frameworkId as FrameworkId,
			);

			// 2. Get all controls that should exist based on frameworks
			const relevantControls = getRelevantControls(frameworkIds);

			// 3. Get existing controls, policies, and artifacts
			const existingControls = (await db.control.findMany({
				where: { organizationId },
				include: {
					artifacts: {
						include: {
							policy: { select: { id: true, name: true } },
							evidence: { select: { id: true, name: true } },
						},
					},
					requirementsMapped: true,
				},
			})) as ExistingControl[];

			// 4. Find what's missing
			const missingItems = findMissingItems(relevantControls, existingControls);

			// 5. Create missing items in a transaction only if there are items to create
			if (
				missingItems.controls.length === 0 &&
				missingItems.policyIds.size === 0 &&
				missingItems.evidenceIds.size === 0
			) {
				return {
					success: true,
					data: {
						message: "No missing items found",
						details: {
							policiesCreated: 0,
							evidenceCreated: 0,
							controlsCreated: 0,
							requirementMapsCreated: 0,
						},
					},
				};
			}

			const result = await db.$transaction(async (tx) => {
				// Create missing policies and evidence based on all relevant controls
				const [policiesForFrameworks, evidenceForFrameworks] =
					await Promise.all([
						createOrganizationPolicies(
							organizationId,
							relevantControls,
							userId,
							tx,
						),
						createOrganizationEvidence(
							organizationId,
							relevantControls,
							userId,
							tx,
						),
					]);

				// First create the missing controls
				const controlsToCreate = missingItems.controls.map((control) => ({
					organizationId,
					name: control.name,
					description: control.description || "",
				}));

				await tx.control.createMany({
					data: controlsToCreate,
					skipDuplicates: true,
				});

				// Fetch the created controls to get their IDs
				const newControls = await tx.control.findMany({
					where: {
						organizationId,
						name: { in: missingItems.controls.map((c) => c.name) },
					},
				});

				// Connect controls to framework instances
				await Promise.all(
					organization.frameworkInstances.map((instance) =>
						tx.frameworkInstance.update({
							where: { id: instance.id },
							data: {
								controls: {
									connect: newControls.map((c) => ({ id: c.id })),
								},
							},
						}),
					),
				);

				// Then create artifacts for all relevant controls
				await createControlArtifacts(
					organizationId,
					organization.frameworkInstances.map((instance) => instance.id),
					relevantControls,
					policiesForFrameworks,
					evidenceForFrameworks,
					tx,
				);

				// Get all controls (both new and existing) to create requirement maps
				const allControls = [...existingControls, ...newControls];

				// Create missing requirement maps for all controls
				const requirementMapsCreated = await createMissingRequirementMaps(
					allControls,
					relevantControls,
					organization.frameworkInstances,
					tx,
				);

				return {
					success: true,
					data: {
						policiesCreated: policiesForFrameworks.size,
						evidenceCreated: evidenceForFrameworks.size,
						controlsCreated: missingItems.controls.length,
						requirementMapsCreated,
					},
				};
			});

			return {
				success: true,
				data: {
					message: "Successfully added missing items",
					details: result.data,
				},
			};
		} catch (error) {
			console.error("Error checking missing items:", error);
			return {
				success: false,
				error: "Failed to check and add missing items",
			};
		}
	});
