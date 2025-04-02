import { auth, authClient } from "@bubba/auth";
import type {
	TemplateControl,
	TemplateEvidence,
	TemplatePolicy,
} from "@bubba/data";
import { controls, evidence, frameworks, policies } from "@bubba/data";
import { db } from "@bubba/db";
import { FrameworkId, type PolicyStatus } from "@prisma/client";
import type { InputJsonValue } from "@prisma/client/runtime/library";
import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";

/**
 * A type-safe wrapper for accessing policy templates by ID
 *
 * @param id - The ID of the policy to retrieve
 * @returns The policy template or undefined if not found
 */
function getPolicyById(id: string): TemplatePolicy | undefined {
	// Use a type-safe approach to check if the key exists in the policies object
	return Object.entries(policies).find(([key]) => key === id)?.[1];
}

/**
 * A type-safe wrapper for accessing evidence templates by ID
 *
 * @param id - The ID of the evidence to retrieve
 * @returns The evidence template or undefined if not found
 */
function getEvidenceById(id: string): TemplateEvidence | undefined {
	// Use a type-safe approach to check if the key exists in the evidence object
	return Object.entries(evidence).find(([key]) => key === id)?.[1];
}

/**
 * Task to create and setup a new organization's compliance framework.
 *
 * This task performs the complete setup of an organization's compliance environment by:
 * 1. Creating framework instances for each selected framework
 * 2. Creating required controls for the frameworks
 * 3. Creating policies based on control requirements
 * 4. Creating evidence collection requirements
 * 5. Linking everything together with artifacts
 *
 * The task handles the entire compliance bootstrapping process in a single operation.
 */
export const createOrganizationTask = schemaTask({
	id: "create-organization",
	maxDuration: 1000 * 60 * 3, // 3 minutes
	schema: z.object({
		organizationId: z.string(),
		userId: z.string(),
		name: z.string(),
		frameworkIds: z.array(z.nativeEnum(FrameworkId)),
	}),
	run: async ({ organizationId, userId, name, frameworkIds }) => {
		logger.info("Creating organization", {
			organizationId,
			userId,
			name,
			frameworkIds,
		});

		try {
			// Create framework instances for each selected framework
			const organizationFrameworks = await Promise.all(
				frameworkIds.map((frameworkId) =>
					createFrameworkInstance(organizationId, frameworkId),
				),
			);

			// Get controls relevant to the selected frameworks
			const relevantControls = getRelevantControls(frameworkIds);

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
			};
		} catch (error) {
			logger.error("Error creating organization", {
				error,
			});

			throw error;
		}
	},
});

/**
 * Identifies which controls are relevant to the selected frameworks.
 *
 * This function filters the control templates from the data package to find
 * only those that map to requirements from the selected frameworks. This ensures
 * we only create controls that are actually needed for the organization's
 * compliance program.
 *
 * @param frameworkIds - Array of framework IDs selected by the organization
 * @returns Array of control templates relevant to the selected frameworks
 */
const getRelevantControls = (
	frameworkIds: FrameworkId[],
): TemplateControl[] => {
	return controls.filter((control) =>
		control.mappedRequirements.some((req) =>
			frameworkIds.includes(req.frameworkId),
		),
	);
};

/**
 * Creates framework instances for the organization.
 *
 * This function:
 * 1. Validates the organization and framework exist
 * 2. Creates a framework instance record linking the organization to the framework
 * 3. Creates control records for all controls required by the framework
 *
 * Framework instances represent which compliance frameworks an organization is
 * implementing, and what their status is with those frameworks.
 *
 * @param organizationId - ID of the organization
 * @param frameworkId - ID of the framework to create an instance for
 * @returns The created framework instance record
 */
const createFrameworkInstance = async (
	organizationId: string,
	frameworkId: FrameworkId,
) => {
	// First verify the organization exists
	const organization = await db.organization.findUnique({
		where: { id: organizationId },
	});

	if (!organization) {
		logger.error("Organization not found when creating framework", {
			organizationId,
			frameworkId,
		});
		throw new Error(`Organization with ID ${organizationId} not found`);
	}

	// Verify the framework exists
	const framework = frameworks[frameworkId as FrameworkId];

	if (!framework) {
		logger.error("Framework not found when creating organization framework", {
			organizationId,
			frameworkId,
		});
		throw new Error(`Framework with ID ${frameworkId} not found`);
	}

	// Use upsert to handle the case where a record may already exist
	const frameworkInstance = await db.frameworkInstance.upsert({
		where: {
			organizationId_frameworkId: {
				organizationId,
				frameworkId: frameworkId as FrameworkId,
			},
		},
		update: {
			organizationId,
			frameworkId: frameworkId as FrameworkId,
		},
		create: {
			organizationId,
			frameworkId: frameworkId as FrameworkId,
		},
		select: {
			id: true,
		},
	});

	logger.info("Created/updated organization framework", {
		organizationId,
		frameworkId,
		frameworkInstanceId: frameworkInstance.id,
	});

	// Find all controls that apply to this specific framework
	const frameworkControls = controls.filter((control) =>
		control.mappedRequirements.some((req) => req.frameworkId === frameworkId),
	);

	// Create database records for each control
	for (const control of frameworkControls) {
		await db.control.create({
			data: {
				organizationId,
				name: control.name,
				description: control.description,
				frameworkInstances: {
					connect: {
						id: frameworkInstance.id,
					},
				},
			},
		});

		logger.info("Created control", {
			controlName: control.name,
			frameworkId,
		});
	}

	return frameworkInstance;
};

/**
 * Creates policy records for the organization based on control requirements.
 *
 * This function:
 * 1. Identifies all policies required by the relevant controls
 * 2. Creates policy records using templates from the data package
 * 3. Records which policies were created for later artifact linking
 *
 * Policies are core documents that define how an organization implements
 * their compliance requirements. They're referenced by controls to demonstrate
 * compliance with specific requirements.
 *
 * @param organizationId - ID of the organization
 * @param relevantControls - Array of controls relevant to the organization
 * @param userId - ID of the user creating the organization (becomes policy owner)
 * @returns Map of template policy IDs to created policy records
 */
const createOrganizationPolicies = async (
	organizationId: string,
	relevantControls: TemplateControl[],
	userId: string,
) => {
	if (!organizationId) {
		throw new Error("Not authorized - no organization found");
	}

	// Extract all policy IDs required by the controls
	const policyIds = new Set<string>();

	for (const control of relevantControls) {
		for (const artifact of control.mappedArtifacts) {
			if (artifact.type === "policy") {
				policyIds.add(artifact.policyId);
			}
		}
	}

	logger.info("Creating organization policies", {
		organizationId,
		policyCount: policyIds.size,
		policyIds: Array.from(policyIds),
	});

	// Create policies for the organization
	const createdPolicies = new Map<string, any>();

	// Process each policy using the type-safe accessor function
	for (const policyId of policyIds) {
		const policyTemplate = getPolicyById(policyId);

		if (!policyTemplate) {
			logger.warn(`Policy template not found: ${policyId}`);
			continue;
		}

		try {
			// Create the policy record using template data - include only fields in the schema
			const policy = await db.policy.create({
				data: {
					organizationId,
					name: policyTemplate.metadata.name,
					description: policyTemplate.metadata.description,
					status: "draft" as PolicyStatus,
					content: policyTemplate.content as InputJsonValue[],
					ownerId: userId,
					frequency: policyTemplate.metadata.frequency,
					department: policyTemplate.metadata.department,
				},
			});

			// Store both the policy record and template ID for later reference
			createdPolicies.set(policyId, {
				...policy,
				templateId: policyId, // Store the template ID for reference
			});

			logger.info(`Created policy: ${policy.name}`, {
				policyName: policy.name,
				templateId: policyId,
			});
		} catch (error) {
			logger.error(`Error creating policy ${policyId}`, { error });
		}
	}

	return createdPolicies;
};

/**
 * Creates evidence records for the organization based on control requirements.
 *
 * This function:
 * 1. Identifies all evidence requirements from the relevant controls
 * 2. Creates evidence records using templates from the data package
 * 3. Records which evidence was created for later artifact linking
 *
 * Evidence represents the actual documentation, reports, logs, etc. that
 * organizations must collect to demonstrate compliance with their controls.
 *
 * @param organizationId - ID of the organization
 * @param relevantControls - Array of controls relevant to the organization
 * @param userId - ID of the user creating the organization (becomes evidence assignee)
 * @returns Map of template evidence IDs to created evidence records
 */
const createOrganizationEvidence = async (
	organizationId: string,
	relevantControls: TemplateControl[],
	userId: string,
) => {
	if (!organizationId) {
		throw new Error("Not authorized - no organization found");
	}

	// Extract all evidence IDs required by the controls
	const evidenceIds = new Set<string>();

	for (const control of relevantControls) {
		for (const artifact of control.mappedArtifacts) {
			if (artifact.type === "evidence") {
				evidenceIds.add(artifact.evidenceId);
			}
		}
	}

	logger.info("Creating evidence record instances", {
		organizationId,
		evidenceCount: evidenceIds.size,
		evidenceIds: Array.from(evidenceIds),
	});

	// Create evidence records for the organization
	const createdEvidence = new Map<string, any>();

	// Process each evidence using the type-safe accessor function
	for (const evidenceId of evidenceIds) {
		const evidenceTemplate = getEvidenceById(evidenceId);

		if (!evidenceTemplate) {
			logger.warn(`Evidence template not found: ${evidenceId}`);
			continue;
		}

		try {
			// Create the evidence record using template data - include only fields in the schema
			const evidenceRecord = await db.evidence.create({
				data: {
					organizationId,
					name: evidenceTemplate.name,
					description: evidenceTemplate.description,
					frequency: evidenceTemplate.frequency,
					assigneeId: userId,
					department: evidenceTemplate.department,
					additionalUrls: [],
					fileUrls: [],
				},
			});

			// Store both the evidence record and template ID for later reference
			createdEvidence.set(evidenceId, {
				...evidenceRecord,
				templateId: evidenceId, // Store the template ID for reference
			});

			logger.info(`Created evidence: ${evidenceRecord.name}`, {
				evidenceId: evidenceRecord.id,
				templateId: evidenceId,
			});
		} catch (error) {
			logger.error(`Error creating evidence ${evidenceId}`, { error });
		}
	}

	return createdEvidence;
};

/**
 * Creates artifacts that link controls to their policies and evidence.
 *
 * This function:
 * 1. Retrieves all created control records
 * 2. For each control, creates artifacts linking it to its required policies and evidence
 *
 * Artifacts are the connections between controls and the policies/evidence that
 * demonstrate compliance with those controls. They represent the actual implementation
 * of compliance requirements.
 *
 * @param organizationId - ID of the organization
 * @param frameworkInstanceIds - IDs of the created framework instances
 * @param relevantControls - Array of controls relevant to the organization
 * @param createdPolicies - Map of template policy IDs to created policy records
 * @param createdEvidence - Map of template evidence IDs to created evidence records
 * @returns Object with success status and artifact count
 */
const createControlArtifacts = async (
	organizationId: string,
	frameworkInstanceIds: string[],
	relevantControls: TemplateControl[],
	createdPolicies: Map<string, any>,
	createdEvidence: Map<string, any>,
) => {
	if (!organizationId) {
		throw new Error("Not authorized - no organization found");
	}

	logger.info("Creating organization control artifacts", {
		organizationId,
		frameworkInstanceIds,
		relevantControlsCount: relevantControls.length,
	});

	// Get all controls for this organization and framework instances
	const dbControls = await db.control.findMany({
		where: {
			organizationId,
			frameworkInstances: {
				some: {
					id: {
						in: frameworkInstanceIds,
					},
				},
			},
		},
	});

	// Create a mapping from control name to database control record for efficient lookup
	const controlMap = new Map<string, any>();
	for (const control of dbControls) {
		controlMap.set(control.name, control);
	}

	// Create artifacts for each control
	let artifactsCreated = 0;

	for (const control of relevantControls) {
		const dbControl = controlMap.get(control.name);

		if (!dbControl) {
			logger.warn(`Control not found in database: ${control.name}`);
			continue;
		}

		// Create artifacts for each policy and evidence mapped to this control
		for (const artifact of control.mappedArtifacts) {
			try {
				if (artifact.type === "policy") {
					// Link control to a policy
					const policy = createdPolicies.get(artifact.policyId);

					if (!policy) {
						logger.warn(`Policy not found for artifact: ${artifact.policyId}`);
						continue;
					}

					// Create the policy artifact
					await db.artifact.create({
						data: {
							type: "policy",
							policyId: policy.id,
							organizationId,
							controls: {
								connect: {
									id: dbControl.id,
								},
							},
						},
					});

					artifactsCreated++;
				} else if (artifact.type === "evidence") {
					// Link control to evidence
					const evidenceRecord = createdEvidence.get(artifact.evidenceId);

					if (!evidenceRecord) {
						logger.warn(
							`Evidence not found for artifact: ${artifact.evidenceId}`,
						);
						continue;
					}

					// Create the evidence artifact
					await db.artifact.create({
						data: {
							type: "evidence",
							evidenceId: evidenceRecord.id,
							organizationId,
							controls: {
								connect: {
									id: dbControl.id,
								},
							},
						},
					});

					artifactsCreated++;
				}
			} catch (error) {
				logger.error(`Error creating artifact for control ${control.name}`, {
					error,
				});
			}
		}
	}

	logger.info(`Created ${artifactsCreated} artifacts for controls`);

	return { success: true, artifactsCreated };
};
