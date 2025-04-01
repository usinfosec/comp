"use server";

import { authActionClient } from "@/actions/safe-action";
import { controls } from "@bubba/data";
import { db } from "@bubba/db";
import { z } from "zod";

const schema = z.object({
	controlIds: z.array(z.string()),
});

/**
 * Checks if a specific artifact is completed based on its type and data
 */
function isArtifactCompleted(artifact: any): boolean {
	if (!artifact) return false;

	switch (artifact.type) {
		case "policy":
			return artifact.policy?.status === "published";
		case "evidence":
			return artifact.evidence?.published === true;
		case "file":
		case "link":
		case "procedure":
		case "training":
			// For other types, consider them complete if they exist
			return true;
		default:
			return false;
	}
}

/**
 * Determines if a control is fully compliant based on its artifacts
 */
function isControlCompliant(artifacts: any[]): boolean {
	// If there are no artifacts, the control is not compliant
	if (!artifacts || artifacts.length === 0) {
		return false;
	}

	return artifacts.every(isArtifactCompleted);
}

export interface ControlProgress {
	controlId: string;
	total: number;
	completed: number;
	progress: number;
	byType: {
		[key: string]: {
			total: number;
			completed: number;
		};
	};
}

export const getOrganizationControlsProgress = authActionClient
	.schema(schema)
	.metadata({
		name: "getOrganizationControlsProgress",
		track: {
			event: "get-organization-controls-progress",
			channel: "server",
		},
	})
	.action(async ({ ctx, parsedInput }) => {
		const { session } = ctx;
		const { controlIds } = parsedInput;

		if (!session.activeOrganizationId) {
			return {
				error: "Not authorized - no organization found",
			};
		}

		try {
			// Get controls with their artifacts from the database
			const controlsWithArtifacts = await db.control.findMany({
				where: {
					id: {
						in: controlIds,
					},
					organizationId: session.activeOrganizationId,
				},
				include: {
					artifacts: {
						include: {
							policy: true,
							evidence: true,
						},
					},
				},
			});

			const progressByControl = new Map<string, ControlProgress>();

			// Initialize progress for all requested controls
			for (const controlId of controlIds) {
				progressByControl.set(controlId, {
					controlId,
					total: 0,
					completed: 0,
					progress: 0,
					byType: {},
				});
			}

			// Calculate progress for each control based on its artifacts
			for (const control of controlsWithArtifacts) {
				const progress = progressByControl.get(control.id);

				if (!progress) continue; // Skip if this control wasn't requested

				// Check if the control is fully compliant
				if (isControlCompliant(control.artifacts)) {
					// If the control is fully compliant, count it as fully complete
					progress.total = 1;
					progress.completed = 1;
					progress.progress = 100;
					continue;
				}

				// Count artifacts by type and check their completion status
				for (const artifact of control.artifacts) {
					const artifactType = artifact.type;

					// Initialize type counters if not exists
					if (!progress.byType[artifactType]) {
						progress.byType[artifactType] = {
							total: 0,
							completed: 0,
						};
					}

					progress.total++;
					progress.byType[artifactType].total++;

					// Check if the artifact is completed
					if (isArtifactCompleted(artifact)) {
						progress.completed++;
						progress.byType[artifactType].completed++;
					}
				}

				// Calculate progress percentage
				progress.progress =
					progress.total > 0
						? Math.round((progress.completed / progress.total) * 100)
						: 0;
			}

			// For controls that weren't found in the database but were requested,
			// check if they have template artifacts from the static data
			for (const controlId of controlIds) {
				const progress = progressByControl.get(controlId);

				// Skip if progress is undefined or the control already has progress data
				if (!progress || progress.total > 0) continue;

				// Find the control template in the static data
				const controlTemplate = controls.find((c) => c.id === controlId);

				if (!controlTemplate) continue;

				// Count artifacts from the template data
				for (const artifact of controlTemplate.mappedArtifacts) {
					const artifactType = artifact.type;

					// Initialize type counters if not exists
					if (!progress.byType[artifactType]) {
						progress.byType[artifactType] = {
							total: 0,
							completed: 0,
						};
					}

					progress.total++;
					progress.byType[artifactType].total++;

					// Template artifacts are not completed by default
					// They're just templates for what needs to be done
				}

				// Calculate progress percentage (will be 0 for template-only controls)
				progress.progress =
					progress.total > 0
						? Math.round((progress.completed / progress.total) * 100)
						: 0;
			}

			return {
				data: {
					progress: Array.from(progressByControl.values()),
				},
			};
		} catch (error) {
			console.error("Error fetching controls progress:", error);
			return {
				error: "Failed to fetch controls progress",
			};
		}
	});
