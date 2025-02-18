"use server";

import { db, type Policy, type User } from "@bubba/db";
import { authActionClient } from "../safe-action";
import { z } from "zod";
import type { ActionData } from "../types";
import type { InputJsonValue } from "@prisma/client/runtime/library";

const selectFrameworksSchema = z.object({
  frameworkIds: z.array(z.string()),
});

export const selectFrameworksAction = authActionClient
  .schema(selectFrameworksSchema)
  .metadata({
    name: "select-frameworks",
    track: {
      event: "select-frameworks",
      channel: "server",
    },
  })
  .action(async ({ parsedInput, ctx }): Promise<ActionData<true>> => {
    const { frameworkIds } = parsedInput;
    const { user } = ctx;

    if (!user.organizationId) {
      return {
        error: "Not authorized - no organization found",
      };
    }

    try {
      // First create categories
      await createOrganizationCategories(user as User, frameworkIds);

      // Then create frameworks and controls
      await Promise.all(
        frameworkIds.map((frameworkId) =>
          createOrganizationFramework(user as User, frameworkId)
        )
      );

      // Finally create policies
      await createOrganizationPolicy(user as User, frameworkIds);

      return {
        data: true,
      };
    } catch (error) {
      console.error("Error selecting frameworks:", error);
      return {
        error: "Failed to select frameworks",
      };
    }
  });

const createOrganizationFramework = async (user: User, frameworkId: string) => {
  if (!user.organizationId) {
    throw new Error("Not authorized - no organization found");
  }

  // Connect the framework to the organization.
  const organizationFramework = await db.organizationFramework.create({
    data: {
      organizationId: user.organizationId,
      frameworkId,
      status: "not_started",
    },
    select: {
      id: true,
    },
  });

  // Get the framework categories and their corresponding organization categories
  const frameworkCategories = await db.frameworkCategory.findMany({
    where: { frameworkId },
    include: {
      controls: true,
    },
  });

  // Get the organization categories that were just created
  const organizationCategories = await db.organizationCategory.findMany({
    where: {
      organizationId: user.organizationId,
      frameworkId,
    },
  });

  // Create controls for each category
  for (const frameworkCategory of frameworkCategories) {
    const organizationCategory = organizationCategories.find(
      (oc) => oc.name === frameworkCategory.name
    );

    if (!organizationCategory) continue;

    const controls = await db.organizationControl.createManyAndReturn({
      data: frameworkCategory.controls.map((control) => ({
        organizationFrameworkId: organizationFramework.id,
        controlId: control.id,
        organizationId: user.organizationId!,
        status: "not_started",
        organizationCategoryId: organizationCategory.id,
      })),
    });

    // Create control requirements for each control
    const controlRequirements = await db.controlRequirement.findMany({
      where: {
        controlId: { in: controls.map((control) => control.controlId) },
      },
    });

    for (const control of controls) {
      const requirements = controlRequirements.filter(
        (req) => req.controlId === control.controlId
      );

      await db.organizationControlRequirement.createMany({
        data: requirements.map((requirement) => ({
          organizationControlId: control.id,
          controlRequirementId: requirement.id,
          type: requirement.type,
          description: requirement.description,
        })),
      });
    }
  }
};

const createOrganizationPolicy = async (user: User, frameworkIds: string[]) => {
  if (!user.organizationId) {
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
      organizationId: user.organizationId!,
      policyId: policy.id,
      status: "draft",
      content: policy.content as InputJsonValue[],
    })),
  });

  return organizationPolicies;
};

const createOrganizationCategories = async (
  user: User,
  frameworkIds: string[]
) => {
  if (!user.organizationId) {
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
      organizationId: user.organizationId!,
      frameworkId: category.frameworkId,
    })),
  });

  return organizationCategories;
};
