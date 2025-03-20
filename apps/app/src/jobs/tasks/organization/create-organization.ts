import { db } from "@bubba/db";
import { RequirementType, type Policy } from "@bubba/db/types";
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

        await db.user.update({
          where: {
            id: userId,
          },
          data: {
            onboarded: true,
          },
        });
      });

      await createOrganizationCategories(organizationId, frameworkIds);

      const organizationFrameworks = await Promise.all(
        frameworkIds.map((frameworkId) =>
          createOrganizationFramework(organizationId, frameworkId)
        )
      );

      await createOrganizationPolicy(organizationId, frameworkIds);

      await createOrganizationControlRequirements(
        organizationId,
        organizationFrameworks.map((framework) => framework.id)
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
  const framework = await db.framework.findUnique({
    where: { id: frameworkId },
  });

  if (!framework) {
    logger.error("Framework not found when creating organization framework", {
      organizationId,
      frameworkId,
    });
    throw new Error(`Framework with ID ${frameworkId} not found`);
  }

  const organizationFramework = await db.organizationFramework.create({
    data: {
      organizationId,
      frameworkId,
      status: "not_started",
    },
    select: {
      id: true,
    },
  });

  logger.info("Created organization framework", {
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
      (oc) => oc.name === frameworkCategory.name
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
  frameworkIds: string[]
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
        frameworkIds.includes(frameworkId)
      )
    ) {
      policiesForFrameworks.push(policy);
    }
  }

  const organizationPolicies = await db.organizationPolicy.createMany({
    data: policiesForFrameworks.map((policy) => ({
      organizationId,
      policyId: policy.id,
      status: "draft",
      content: policy.content as InputJsonValue[],
      frequency: policy.frequency,
    })),
  });

  return organizationPolicies;
};

const createOrganizationCategories = async (
  organizationId: string,
  frameworkIds: string[]
) => {
  if (!organizationId) {
    throw new Error("Not authorized - no organization found");
  }

  // For each frameworkCategory we need to get the controls.
  const frameworkCategories = await db.frameworkCategory.findMany({
    where: {
      frameworkId: { in: frameworkIds },
    },
  });

  // Create the organization categories.
  const organizationCategories = await db.organizationCategory.createMany({
    data: frameworkCategories.map((category) => ({
      name: category.name,
      description: category.description,
      organizationId,
      frameworkId: category.frameworkId,
    })),
  });

  return organizationCategories;
};

const createOrganizationControlRequirements = async (
  organizationId: string,
  organizationFrameworkIds: string[]
) => {
  if (!organizationId) {
    throw new Error("Not authorized - no organization found");
  }

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

  for (const control of controls) {
    const requirements = controlRequirements.filter(
      (req) => req.controlId === control.controlId
    );

    await db.organizationControlRequirement.createMany({
      data: requirements.map((requirement) => {
        // Find the corresponding organization policy if this is a policy requirement
        const policyId =
          requirement.type === "policy" ? requirement.policy?.id : null;
        const organizationPolicy = policyId
          ? organizationPolicies.find((op) => op.policyId === policyId)
          : null;

        const evidenceId =
          requirement.type === "evidence" ? requirement.evidenceId : null;

        console.log({
          evidenceId,
        });

        const organizationEvidence = evidenceId
          ? organizationEvidences.find((e) => e.evidenceId === evidenceId)
          : null;

        console.log({
          organizationEvidence,
        });

        return {
          organizationControlId: control.id,
          controlRequirementId: requirement.id,
          type: requirement.type,
          description: requirement.description,
          organizationPolicyId: organizationPolicy?.id || null,
          organizationEvidenceId: organizationEvidence?.id || null,
        };
      }),
    });
  }

  return controlRequirements;
};

const createOrganizationEvidence = async (
  organizationId: string,
  frameworkIds: string[],
  userId: string
) => {
  if (!organizationId) {
    throw new Error("Not authorized - no organization found");
  }

  const evidence = await db.controlRequirement.findMany({
    where: {
      type: RequirementType.evidence,
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
    },
  });

  const organizationEvidence = await db.organizationEvidence.createMany({
    data: evidence.map((evidence) => ({
      organizationId,
      evidenceId: evidence.id,
      name: evidence.name,
      description: evidence.description,
      frequency: evidence.frequency,
      frameworkId: evidence.control.frameworkCategory?.framework.id || "",
      assigneeId: userId,
      department: evidence.department,
    })),
  });

  return organizationEvidence;
};
