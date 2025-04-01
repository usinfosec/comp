import { Requirement } from "@bubba/data";
import { db } from "@bubba/db";
import type { Control, Policy, Artifact, Evidence } from "@bubba/db/types";

// Custom type that extends the base Requirement
export type FrameworkRequirements = {
  name: string;
  description: string;
  controls: (Control & {
    artifacts: (Artifact & {
      policy: Policy | null;
      evidence: Evidence | null;
    })[];
  })[];
}[];

export const getFrameworkRequirements = async (
  frameworkId: string,
  organizationId: string
): Promise<FrameworkRequirements> => {
  // Fetch framework controls with artifacts
  const controls = await db.control.findMany({
    where: {
      organizationId,
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

  // Create a formatted requirement object that matches what the components expect
  const requirements: FrameworkRequirements = [
    {
      name: `${frameworkId.toUpperCase()} Framework`,
      description: `Requirements for ${frameworkId.toUpperCase()}`,
      controls: controls,
    },
  ];

  return requirements;
};
