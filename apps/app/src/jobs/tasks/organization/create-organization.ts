import { frameworks } from "@bubba/data";
import { db } from "@bubba/db";
import { RequirementType } from "@bubba/db/types";
import type { InputJsonValue } from "@prisma/client/runtime/library";
import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";

export const createOrganizationTask = schemaTask({
	id: "create-organization",
	maxDuration: 1000 * 60 * 3, // 3 minutes
	schema: z.object({
		organizationId: z.string(),
		userId: z.string(),
		fullName: z.string(),
		website: z.string(),
		frameworkIds: z.array(z.string()),
	}),
	run: async ({ organizationId, userId, fullName, website, frameworkIds }) => {
		logger.info("Creating organization", {
			organizationId,
			userId,
			fullName,
			website,
			frameworkIds,
		});

		const organization = await db.organization.findFirst({
			where: {
				id: organizationId,
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
			await db.$transaction(async () => {
				await db.organization.upsert({
					where: {
						id: organization.id,
					},
					update: {
						name: fullName,
						website,
					},
					create: {
						name: fullName,
						website,
					},
				});
			});

			await createOrganizationCategories(organizationId, frameworkIds);

			const organizationFrameworks = await Promise.all(
				frameworkIds.map((frameworkId) =>
					createOrganizationFramework(organizationId, frameworkId),
				),
			);

			await createOrganizationPolicy(organizationId, frameworkIds, userId);

			await createOrganizationControlRequirements(
				organizationId,
				organizationFrameworks.map((framework) => framework.id),
			);

			await createOrganizationEvidence(organizationId, frameworkIds, userId);

			await db.organization.update({
				where: {
					id: organizationId,
				},
				data: {
					setup: true,
				},
			});

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

const createOrganizationFramework = async (
	organizationId: string,
	frameworkId: string,
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
	const framework = frameworks[frameworkId as keyof typeof frameworks];

	if (!framework) {
		logger.error("Framework not found when creating organization framework", {
			organizationId,
			frameworkId,
		});
		throw new Error(`Framework with ID ${frameworkId} not found`);
	}

	// Use upsert to handle the case where a record may already exist
	const organizationFramework = await db.organizationFramework.upsert({
		where: {
			organizationId_frameworkId: {
				organizationId,
				frameworkId,
			},
		},
		update: {
			status: "not_started", // Only update status if it already exists
		},
		create: {
			organizationId,
			frameworkId,
			status: "not_started",
		},
		select: {
			id: true,
		},
	});

	logger.info("Created/updated organization framework", {
		organizationId,
		frameworkId,
		organizationFrameworkId: organizationFramework.id,
	});

	const frameworkCategories = await db.frameworkCategory.findMany({
		where: { frameworkId },
		include: {
			controls: true,
		},
	});

	const organizationCategories = await db.organizationCategory.findMany({
		where: {
			organizationId,
			frameworkId,
		},
	});

	for (const frameworkCategory of frameworkCategories) {
		const organizationCategory = organizationCategories.find(
			(oc) => oc.name === frameworkCategory.name,
		);

		if (!organizationCategory) continue;

		await db.organizationControl.createMany({
			data: frameworkCategory.controls.map((control) => ({
				organizationFrameworkId: organizationFramework.id,
				controlId: control.id,
				organizationId,
				status: "not_started",
				organizationCategoryId: organizationCategory.id,
			})),
		});
	}

	return organizationFramework;
};

const createOrganizationPolicy = async (
	organizationId: string,
	frameworkIds: string[],
	userId: string,
) => {
	if (!organizationId) {
		throw new Error("Not authorized - no organization found");
	}

	const policies = await db.policy.findMany();
	const policiesForFrameworks: Policy[] = [];

	for (const policy of policies) {
		const usedBy = policy.usedBy;

		if (!usedBy) {
			continue;
		}

		const usedByFrameworkIds = Object.keys(usedBy);

		if (
			usedByFrameworkIds.some((frameworkId) =>
				frameworkIds.includes(frameworkId),
			)
		) {
			policiesForFrameworks.push(policy);
		}
	}

	const organizationPolicies = await db.organizationPolicy.createMany({
		data: policiesForFrameworks.map((policy) => ({
			organizationId,
			policyId: policy.id,
			ownerId: userId,
			status: "draft",
			content: policy.content as InputJsonValue[],
			frequency: policy.frequency,
		})),
	});

	return organizationPolicies;
};

const createOrganizationControlRequirements = async (
	organizationId: string,
	organizationFrameworkIds: string[],
) => {
	if (!organizationId) {
		throw new Error("Not authorized - no organization found");
	}

	logger.info("Creating organization control requirements", {
		organizationId,
		organizationFrameworkIds,
	});

	const controls = await db.organizationControl.findMany({
		where: {
			organizationId,
			organizationFrameworkId: {
				in: organizationFrameworkIds,
			},
		},
		include: {
			control: true,
		},
	});

	// Create control requirements for each control
	const controlRequirements = await db.controlRequirement.findMany({
		where: {
			controlId: { in: controls.map((control) => control.controlId) },
		},
		include: {
			policy: true, // Include the policy to get its ID
			evidence: true, // Include the evidence to get its ID
			control: {
				include: {
					frameworkCategory: {
						include: {
							framework: true,
						},
					},
				},
			},
		},
	});

	// Get all organization policies for this organization
	const organizationPolicies = await db.organizationPolicy.findMany({
		where: {
			organizationId,
		},
	});

	// Get all organization evidences for this organization
	const organizationEvidences = await db.organizationEvidence.findMany({
		where: {
			organizationId,
		},
	});

	logger.info("Found control requirements and related items", {
		controls: controls.length,
		controlRequirements: controlRequirements.length,
		organizationPolicies: organizationPolicies.length,
		organizationEvidences: organizationEvidences.length,
	});

	// Create any missing organization evidence records
	const missingEvidenceRecords = [];

	// First check for existing records to avoid duplicates
	const existingEvidenceIds = new Set(
		organizationEvidences.map((e) => e.evidenceId),
	);

	for (const requirement of controlRequirements) {
		if (
			requirement.type === "evidence" &&
			requirement.evidenceId &&
			requirement.evidence &&
			!existingEvidenceIds.has(requirement.evidenceId)
		) {
			missingEvidenceRecords.push({
				organizationId,
				evidenceId: requirement.evidenceId,
				name: requirement.name,
				description: requirement.description,
				frequency: requirement.frequency,
				frameworkId: requirement.control.frameworkCategory?.framework.id || "",
				assigneeId: null, // No user provided in this function
				department: requirement.department,
			});
			// Add the new ID to our set so subsequent iterations don't duplicate it
			existingEvidenceIds.add(requirement.evidenceId);
		}
	}

	// Create any missing evidence records
	if (missingEvidenceRecords.length > 0) {
		logger.info(
			`Creating ${missingEvidenceRecords.length} missing organization evidence records`,
		);

		await db.organizationEvidence.createMany({
			data: missingEvidenceRecords,
			skipDuplicates: true, // Add this to ensure we don't create duplicates
		});

		// Refresh the organization evidences collection
		const refreshedEvidences = await db.organizationEvidence.findMany({
			where: {
				organizationId,
			},
		});

		organizationEvidences.length = 0;
		organizationEvidences.push(...refreshedEvidences);

		logger.info(
			`After creating missing records, now have ${organizationEvidences.length} organization evidence records`,
		);
	}

	let evidenceNotFoundCount = 0;
	let evidenceFoundCount = 0;

	for (const control of controls) {
		const requirements = controlRequirements.filter(
			(req) => req.controlId === control.controlId,
		);

		const requirementsToCreate = requirements.map((requirement) => {
			// For policy requirements
			let organizationPolicyId = null;
			if (requirement.type === "policy" && requirement.policyId) {
				const organizationPolicy = organizationPolicies.find(
					(op) => op.policyId === requirement.policyId,
				);

				if (!organizationPolicy) {
					logger.warn("Policy not found in organization policies", {
						requirementId: requirement.id,
						policyId: requirement.policyId,
					});
				} else {
					organizationPolicyId = organizationPolicy.id;
				}
			}

			// For evidence requirements
			let organizationEvidenceId = null;
			if (requirement.type === "evidence" && requirement.evidenceId) {
				const organizationEvidence = organizationEvidences.find(
					(oe) => oe.evidenceId === requirement.evidenceId,
				);

				if (!organizationEvidence) {
					logger.warn("Evidence not found in organization evidences", {
						requirementId: requirement.id,
						evidenceId: requirement.evidenceId,
						organizationEvidenceIds: organizationEvidences.map(
							(e) => e.evidenceId,
						),
					});
					evidenceNotFoundCount++;
				} else {
					organizationEvidenceId = organizationEvidence.id;
					evidenceFoundCount++;

					logger.info("Successfully linked evidence", {
						requirementId: requirement.id,
						evidenceId: requirement.evidenceId,
						organizationEvidenceId: organizationEvidence.id,
					});
				}
			}

			return {
				organizationControlId: control.id,
				controlRequirementId: requirement.id,
				type: requirement.type,
				description: requirement.description || "",
				organizationPolicyId: organizationPolicyId,
				organizationEvidenceId: organizationEvidenceId,
			};
		});

		if (requirementsToCreate.length > 0) {
			await db.organizationControlRequirement.createMany({
				data: requirementsToCreate,
			});
		}
	}

	logger.info(
		`Evidence requirements found: ${evidenceFoundCount}, not found: ${evidenceNotFoundCount}`,
	);

	return controlRequirements;
};

const createOrganizationEvidence = async (
	organizationId: string,
	frameworkIds: string[],
	userId: string,
) => {
	if (!organizationId) {
		throw new Error("Not authorized - no organization found");
	}

	logger.info("Starting organization evidence creation", {
		organizationId,
		frameworkIds,
	});

	const controlRequirements = await db.controlRequirement.findMany({
		where: {
			type: RequirementType.evidence,
			control: {
				frameworkCategory: {
					frameworkId: { in: frameworkIds },
				},
			},
		},
		include: {
			control: {
				include: {
					frameworkCategory: {
						include: {
							framework: true,
						},
					},
				},
			},
			evidence: true, // Include evidence to get the actual evidence ID
		},
	});

	logger.info(
		`Found ${controlRequirements.length} control requirements for evidence`,
	);

	// Filter out requirements that don't have a properly linked evidence record
	const validRequirements = controlRequirements.filter((req) => req.evidence);

	logger.info(
		`Found ${validRequirements.length} valid requirements with evidence`,
	);
	logger.info("Evidence IDs to be created", {
		evidenceIds: validRequirements.map((req) => req.evidenceId),
	});

	if (validRequirements.length === 0) {
		logger.warn(
			"No valid evidence requirements found with linked evidence records",
			{
				organizationId,
				frameworkIds,
				totalRequirements: controlRequirements.length,
			},
		);
		return { count: 0 };
	}

	logger.info("Creating organization evidence", {
		organizationId,
		frameworkIds,
		validRequirements: validRequirements.length,
		totalRequirements: controlRequirements.length,
	});

	// First check for existing records to avoid duplicates
	const existingEvidences = await db.organizationEvidence.findMany({
		where: {
			organizationId,
			evidenceId: {
				in: validRequirements
					.map((req) => req.evidenceId)
					.filter((id): id is string => id !== null),
			},
		},
		select: {
			evidenceId: true,
		},
	});

	const existingEvidenceIds = new Set(
		existingEvidences.map((e) => e.evidenceId),
	);
	const newRequirements = validRequirements.filter(
		(req) => req.evidenceId && !existingEvidenceIds.has(req.evidenceId),
	);

	logger.info(
		`Found ${existingEvidences.length} existing evidence records, creating ${newRequirements.length} new records`,
	);

	if (newRequirements.length > 0) {
		// Only create evidence records that don't already exist
		const organizationEvidence = await db.organizationEvidence.createMany({
			data: newRequirements.map((req) => ({
				organizationId,
				evidenceId: req.evidence!.id, // Use the actual evidence ID from the linked evidence
				name: req.name,
				description: req.description,
				frequency: req.frequency,
				frameworkId: req.control.frameworkCategory?.framework.id || "",
				assigneeId: userId,
				department: req.department,
			})),
		});

		logger.info(
			`Created ${organizationEvidence.count} new organization evidence records`,
		);
	}

	// Verify the evidence was created by querying
	const createdEvidences = await db.organizationEvidence.findMany({
		where: {
			organizationId,
			evidenceId: {
				in: validRequirements
					.map((req) => req.evidenceId)
					.filter((id): id is string => id !== null),
			},
		},
	});

	logger.info(
		`Total evidence records: ${createdEvidences.length} organization evidence records`,
	);
	logger.info("Evidence IDs", {
		createdEvidenceIds: createdEvidences.map((e) => e.evidenceId),
	});

	return { count: createdEvidences.length };
};
