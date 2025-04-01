"use server";

import { db } from "@bubba/db";
import type {
  FrameworkInstance,
  Control,
  Artifact,
  Policy,
  Evidence,
} from "@bubba/db/types";

// Define a type for the framework with compliance info
interface FrameworkWithCompliance {
  framework: FrameworkInstance;
  compliance: number;
}

/**
 * Checks if a control is compliant based on its artifacts
 * @param control - The control to check
 * @returns boolean indicating if the control is compliant
 */
const isControlCompliant = (
  control: Control & {
    artifacts: (Artifact & {
      policy: Policy | null;
      evidence: Evidence | null;
    })[];
  }
) => {
  // First, check if the control has the direct status of "compliant"
  if (control.status === "compliant") {
    return true;
  }

  // If there are no artifacts, the control is not compliant
  if (!control.artifacts || control.artifacts.length === 0) {
    return false;
  }

  const totalArtifacts = control.artifacts.length;
  const completedArtifacts = control.artifacts.filter((artifact) => {
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
        // For other types, check if there's an associated artifact at all
        return true;
      default:
        return false;
    }
  }).length;

  return completedArtifacts === totalArtifacts;
};

/**
 * Gets all framework instances for an organization with compliance calculations
 * @param organizationId - The ID of the organization
 * @returns Array of frameworks with compliance percentages
 */
export async function getFrameworkCategories(
  organizationId: string
): Promise<FrameworkWithCompliance[]> {
  // Get all framework instances for the organization
  const frameworkInstances = await db.frameworkInstance.findMany({
    where: {
      organizationId,
    },
    include: {
      // Include the controls to calculate compliance
      controls: {
        include: {
          artifacts: {
            include: {
              policy: true,
              evidence: true,
            },
          },
        },
      },
    },
  });

  // Calculate compliance for each framework
  const frameworksWithCompliance = frameworkInstances.map(
    (frameworkInstance) => {
      // Get all controls for this framework
      const controls = frameworkInstance.controls;

      // Calculate compliance percentage
      const totalControls = controls.length;
      const compliantControls = controls.filter((control) =>
        isControlCompliant(control)
      ).length;

      const compliance =
        totalControls > 0
          ? Math.round((compliantControls / totalControls) * 100)
          : 0;

      return {
        framework: frameworkInstance,
        compliance,
      };
    }
  );

  return frameworksWithCompliance;
}
