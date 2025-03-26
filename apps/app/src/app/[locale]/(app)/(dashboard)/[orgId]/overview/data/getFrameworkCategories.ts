"use server";

import { db } from "@bubba/db";
import type {
  ComplianceStatus,
  Framework,
  OrganizationControlRequirement,
  OrganizationEvidence,
  OrganizationFramework,
  OrganizationPolicy,
} from "@bubba/db/types";

// Define a type for the control with its requirements as returned from the database
type ControlWithRequirements = {
  id: string;
  status: ComplianceStatus;
  control: {
    code: string;
    description: string | null;
    name: string;
  };
  OrganizationControlRequirement: Array<
    OrganizationControlRequirement & {
      organizationPolicy: Pick<OrganizationPolicy, "status"> | null;
      organizationEvidence: Pick<OrganizationEvidence, "published"> | null;
    }
  >;
};

// Helper function to check if a control is compliant based on its requirements
const isControlCompliant = (control: ControlWithRequirements) => {
  // First, check if the control has the direct status of "compliant"
  if (control.status === "compliant") {
    return true;
  }

  // Then check the requirements if they exist
  const requirements = control.OrganizationControlRequirement;

  if (!requirements || requirements.length === 0) {
    return false;
  }

  const totalRequirements = requirements.length;
  const completedRequirements = requirements.filter((req) => {
    let isCompleted = false;

    switch (req.type) {
      case "policy":
        isCompleted = req.organizationPolicy?.status === "published";
        break;
      case "file":
        isCompleted = !!req.fileUrl;
        break;
      case "evidence":
        isCompleted = req.organizationEvidence?.published === true;
        break;
      default:
        isCompleted = req.published;
    }

    return isCompleted;
  }).length;

  return completedRequirements === totalRequirements;
};

export async function getFrameworkCategories(
  organizationId: string,
  frameworks: (OrganizationFramework & { framework: Framework })[]
) {
  // For each framework, get the categories and controls
  const frameworksWithCompliance = await Promise.all(
    frameworks.map(async (framework) => {
      const organizationCategories = await db.organizationCategory.findMany({
        where: {
          organizationId,
          frameworkId: framework.framework.id,
        },
        include: {
          organizationControl: {
            include: {
              control: true,
              OrganizationControlRequirement: {
                include: {
                  organizationPolicy: {
                    select: {
                      status: true,
                    },
                  },
                  organizationEvidence: {
                    select: {
                      published: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Transform the categories into a list of controls
      const controls = organizationCategories.flatMap((category) =>
        category.organizationControl.map((control) => control)
      );

      // Calculate compliance percentage
      const totalControls = controls.length;
      const compliantControls = controls.filter((control) =>
        isControlCompliant(control as ControlWithRequirements)
      ).length;

      const compliance =
        totalControls > 0
          ? Math.round((compliantControls / totalControls) * 100)
          : 0;

      return {
        framework,
        compliance,
      };
    })
  );

  return frameworksWithCompliance;
}
