import {
  FrameworkId,
  frameworks,
  controls,
  policies,
  evidence,
} from "@bubba/data";
import { db } from "@bubba/db";
import type {
  ComplianceStatus,
  Departments,
  FrameworkStatus,
  Policy as PolicyType,
  PolicyStatus,
  RequirementType,
} from "@prisma/client";
import type { InputJsonValue } from "@prisma/client/runtime/library";
import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import type { TemplateControl } from "@bubba/data";
import type { TemplatePolicy } from "@bubba/data";
import type { TemplateEvidence } from "@bubba/data";

// Type for policy and evidence maps with index signatures
type PolicyMap = Record<string, TemplatePolicy>;
type EvidenceMap = Record<string, TemplateEvidence>;

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

    // Verify the organization exists and the user has access to it
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
      // Update or create the organization with the provided details
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

      // Create framework instances for each selected framework
      const organizationFrameworks = await Promise.all(
        frameworkIds.map((frameworkId) =>
          createFrameworkInstance(organizationId, frameworkId)
        )
      );

      // Get controls relevant to the selected frameworks
      const relevantControls = getRelevantControls(frameworkIds);

      // Create policies required by the controls
      const policiesForFrameworks = await createOrganizationPolicies(
        organizationId,
        relevantControls,
        userId
      );

      // Create evidence requirements for the controls
      const evidenceForFrameworks = await createOrganizationEvidence(
        organizationId,
        relevantControls,
        userId
      );

      // Link controls to their policies and evidence through artifacts
      await createOrganizationControlArtifacts(
        organizationId,
        organizationFrameworks.map((framework) => framework.id),
        relevantControls,
        policiesForFrameworks,
        evidenceForFrameworks
      );

      // Mark the organization setup as complete
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
const getRelevantControls = (frameworkIds: string[]): TemplateControl[] => {
  return controls.filter((control) =>
    control.mappedRequirements.some((req) =>
      frameworkIds.includes(req.frameworkId)
    )
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
  frameworkId: string
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
        frameworkId,
      },
    },
    update: {
      organizationId,
      frameworkId,
    },
    create: {
      organizationId,
      frameworkId,
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
    control.mappedRequirements.some((req) => req.frameworkId === frameworkId)
  );

  // Create database records for each control
  for (const control of frameworkControls) {
    await db.control.create({
      data: {
        organizationId,
        controlId: control.id,
        status: "not_started" as ComplianceStatus,
        frameworkInstanceId: frameworkInstance.id,
      },
    });

    logger.info("Created control", {
      controlId: control.id,
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
  userId: string
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

  // Cast policies to a type with an index signature
  const policyTemplates = policies as unknown as PolicyMap;

  // Create each policy from its template
  for (const policyId of policyIds) {
    const policyTemplate = policyTemplates[policyId];

    if (!policyTemplate) {
      logger.warn(`Policy template not found: ${policyId}`);
      continue;
    }

    try {
      // Create the policy record using template data
      const policy = await db.policy.create({
        data: {
          organizationId,
          name: policyTemplate.metadata.name,
          description: policyTemplate.metadata.description,
          status: "draft" as PolicyStatus,
          content: policyTemplate.content as InputJsonValue[],
          policyId: policyTemplate.metadata.id,
          ownerId: userId,
          frequency: policyTemplate.metadata.frequency,
          department: policyTemplate.metadata.department,
        },
      });

      // Store for later artifact creation
      createdPolicies.set(policyId, policy);

      logger.info(`Created policy: ${policy.name}`, {
        policyId: policy.id,
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
  userId: string
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

  logger.info("Creating organization evidence", {
    organizationId,
    evidenceCount: evidenceIds.size,
    evidenceIds: Array.from(evidenceIds),
  });

  // Create evidence records for the organization
  const createdEvidence = new Map<string, any>();

  // Cast evidence to a type with an index signature
  const evidenceTemplates = evidence as unknown as EvidenceMap;

  // Create each evidence from its template
  for (const evidenceId of evidenceIds) {
    const evidenceTemplate = evidenceTemplates[evidenceId];

    if (!evidenceTemplate) {
      logger.warn(`Evidence template not found: ${evidenceId}`);
      continue;
    }

    try {
      // Create the evidence record using template data
      const evidenceRecord = await db.evidence.create({
        data: {
          organizationId,
          name: evidenceTemplate.name,
          description: evidenceTemplate.description || "",
          evidenceId: evidenceTemplate.id,
          frequency: evidenceTemplate.frequency,
          assigneeId: userId,
          department: evidenceTemplate.department,
          additionalUrls: [],
          fileUrls: [],
        },
      });

      // Store for later artifact creation
      createdEvidence.set(evidenceId, evidenceRecord);

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
const createOrganizationControlArtifacts = async (
  organizationId: string,
  frameworkInstanceIds: string[],
  relevantControls: TemplateControl[],
  createdPolicies: Map<string, any>,
  createdEvidence: Map<string, any>
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
      frameworkInstanceId: {
        in: frameworkInstanceIds,
      },
    },
  });

  // Create a mapping from control ID to database control record for efficient lookup
  const controlMap = new Map<string, any>();
  for (const control of dbControls) {
    controlMap.set(control.controlId, control);
  }

  // Create artifacts for each control
  let artifactsCreated = 0;

  for (const control of relevantControls) {
    const dbControl = controlMap.get(control.id);

    if (!dbControl) {
      logger.warn(`Control not found in database: ${control.id}`);
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
              controlId: dbControl.id,
              type: "policy" as RequirementType,
              description: `Policy artifact for control ${control.name}`,
              policyId: policy.id,
            },
          });

          artifactsCreated++;
        } else if (artifact.type === "evidence") {
          // Link control to evidence
          const evidenceRecord = createdEvidence.get(artifact.evidenceId);

          if (!evidenceRecord) {
            logger.warn(
              `Evidence not found for artifact: ${artifact.evidenceId}`
            );
            continue;
          }

          // Create the evidence artifact
          await db.artifact.create({
            data: {
              controlId: dbControl.id,
              type: "evidence" as RequirementType,
              description: `Evidence artifact for control ${control.name}`,
              evidenceId: evidenceRecord.id,
            },
          });

          artifactsCreated++;
        }
      } catch (error) {
        logger.error(`Error creating artifact for control ${control.id}`, {
          error,
        });
      }
    }
  }

  logger.info(`Created ${artifactsCreated} artifacts for controls`);

  return { success: true, artifactsCreated };
};
