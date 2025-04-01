"use server";

import { db } from "@bubba/db";
import type {
  FrameworkInstance,
  Control,
  Evidence,
  IntegrationResult,
  Policy,
  Artifact,
} from "@bubba/db/types";

interface ComplianceScoresResult {
  policiesCompliance: number;
  evidenceTasksCompliance: number;
  cloudTestsCompliance: number;
  overallCompliance: number;
  frameworkCompliance: {
    id: string;
    name: string;
    compliance: number;
  }[];
  policies: Policy[];
  evidenceTasks: Evidence[];
  tests: IntegrationResult[];
}

export async function getComplianceScores(
  organizationId: string,
  frameworksWithControls: (FrameworkInstance & {
    controls: (Control & {
      artifacts: (Artifact & {
        policy: Policy | null;
        evidence: Evidence | null;
      })[];
    })[];
  })[]
): Promise<ComplianceScoresResult> {
  // Extract all artifacts related to policies and evidence
  const allArtifacts = frameworksWithControls.flatMap((framework) =>
    framework.controls.flatMap((control) => control.artifacts)
  );

  // Extract policy artifacts (filter out null policies)
  const policyArtifacts = allArtifacts.filter(
    (artifact) => artifact.type === "policy" && artifact.policy !== null
  );

  // Extract evidence artifacts (filter out null evidence)
  const evidenceArtifacts = allArtifacts.filter(
    (artifact) => artifact.type === "evidence" && artifact.evidence !== null
  );

  // Get unique policies and evidence to avoid duplicates
  const policyMap = new Map<string, Policy>();
  for (const artifact of policyArtifacts) {
    if (artifact.policy) {
      policyMap.set(artifact.policy.id, artifact.policy);
    }
  }
  const uniquePolicies = Array.from(policyMap.values());

  const evidenceMap = new Map<string, Evidence>();
  for (const artifact of evidenceArtifacts) {
    if (artifact.evidence) {
      evidenceMap.set(artifact.evidence.id, artifact.evidence);
    }
  }
  const uniqueEvidence = Array.from(evidenceMap.values());

  // Map policy framework data to a simpler structure
  const mappedPoliciesByFramework = policyArtifacts
    .map((pa) => {
      // Find the framework this policy belongs to by looking at the associated control
      const frameworkId = findFrameworkIdForArtifact(
        pa.id,
        frameworksWithControls
      );
      return {
        policyId: pa.policy?.id || "",
        status: pa.policy?.status || "draft",
        frameworkId,
      };
    })
    .filter((item) => item.policyId !== ""); // Filter out any items with empty policyIds

  // Map evidence tasks to framework
  const evidenceByFramework = evidenceArtifacts
    .map((ea) => {
      // Find the framework this evidence belongs to by looking at the associated control
      const frameworkId = findFrameworkIdForArtifact(
        ea.id,
        frameworksWithControls
      );
      return {
        id: ea.evidence?.id || "",
        frameworkId,
        evidenceId: ea.evidence?.id || "",
        published: ea.evidence?.published || false,
      };
    })
    .filter((item) => item.id !== ""); // Filter out any items with empty ids

  // Get all tests for the organization
  const integrationResults = await db.integrationResult.findMany({
    where: { organizationId },
    include: {
      integration: {
        select: {
          id: true,
          name: true,
          integrationId: true,
        },
      },
    },
  });

  // Transform the data to match the expected format
  const tests = integrationResults.map((result) => ({
    id: result.id,
    severity: result.severity,
    result: result.status,
    title: result.title || result.integration.name,
    provider: result.integration.integrationId,
    createdAt: result.completedAt || new Date(),
    description: result.description,
    organizationId: result.organizationId,
    remediation: result.remediation,
    status: result.status,
    resultDetails: result.resultDetails,
    completedAt: result.completedAt,
    integrationId: result.integrationId,
    assignedUserId: result.assignedUserId,
  }));

  // Calculate policies compliance
  const policiesCompliance =
    uniquePolicies.length > 0
      ? Math.round(
          (uniquePolicies.filter((p) => p.status === "published").length /
            uniquePolicies.length) *
            100
        )
      : 0;

  // Calculate evidence tasks compliance
  const evidenceTasksCompliance =
    uniqueEvidence.length > 0
      ? Math.round(
          (uniqueEvidence.filter((e) => e.published === true).length /
            uniqueEvidence.length) *
            100
        )
      : 0;

  // Calculate cloud tests compliance (checking for "PASSED" status as per the type definition)
  const cloudTestsCompliance =
    tests.length > 0
      ? Math.round(
          (tests.filter((test) => test.result?.toUpperCase() === "PASSED")
            .length /
            tests.length) *
            100
        )
      : 0;

  // Calculate framework-specific compliance
  const frameworkCompliance = frameworksWithControls.map((framework) => {
    // Calculate framework controls compliance
    const totalControls = framework.controls.length;

    // Count controls with any progress (in_progress or compliant)
    const inProgressControls = framework.controls.filter(
      (control) => control.status === "in_progress"
    ).length;

    const compliantControls = framework.controls.filter(
      (control) => control.status === "compliant"
    ).length;

    // For compliance percentage, count both in_progress (partial) and compliant (full)
    // Give in_progress controls half weight compared to compliant ones
    const progressWeight = 0.5; // Weight for in_progress controls
    const weightedProgress =
      compliantControls + inProgressControls * progressWeight;

    // Calculate compliance percentage based on controls
    const controlsCompliance =
      totalControls > 0
        ? Math.round((weightedProgress / totalControls) * 100)
        : 0;

    // Find policies for this specific framework
    const frameworkPolicies = mappedPoliciesByFramework.filter(
      (policy) => policy.frameworkId === framework.frameworkId
    );

    // Calculate framework-specific policies compliance
    const frameworkPoliciesCompliance =
      frameworkPolicies.length > 0
        ? Math.round(
            (frameworkPolicies.filter((policy) => policy.status === "published")
              .length /
              frameworkPolicies.length) *
              100
          )
        : null;

    // Find evidence tasks related to this framework
    const frameworkEvidenceTasks = evidenceByFramework.filter(
      (evidence) => evidence.frameworkId === framework.frameworkId
    );

    // Calculate framework-specific evidence tasks compliance
    const frameworkEvidenceTasksCompliance =
      frameworkEvidenceTasks.length > 0
        ? Math.round(
            (frameworkEvidenceTasks.filter(
              (evidence) => evidence.published === true
            ).length /
              frameworkEvidenceTasks.length) *
              100
          )
        : null;

    // Calculate overall framework compliance as average of all components with data
    const complianceScores = [controlsCompliance];
    if (frameworkPoliciesCompliance !== null)
      complianceScores.push(frameworkPoliciesCompliance);
    if (frameworkEvidenceTasksCompliance !== null)
      complianceScores.push(frameworkEvidenceTasksCompliance);

    const totalCompliance =
      complianceScores.length > 0
        ? Math.round(
            complianceScores.reduce((sum, score) => sum + score, 0) /
              complianceScores.length
          )
        : controlsCompliance;

    return {
      id: framework.frameworkId,
      name: framework.frameworkId, // We'll need to get the framework name from somewhere else
      compliance: totalCompliance,
    };
  });

  // Calculate overall compliance as the average of all available scores
  const calculateOverallCompliance = () => {
    // Count how many categories have data
    const categoriesWithData = [
      uniquePolicies.length > 0,
      uniqueEvidence.length > 0,
      tests.length > 0,
    ].filter(Boolean).length;

    // If no categories have data, return 0
    if (categoriesWithData === 0) return 0;

    // Calculate the sum of all compliance scores
    const totalScore =
      policiesCompliance + evidenceTasksCompliance + cloudTestsCompliance;

    // Return the average, rounded to the nearest integer
    return Math.round(totalScore / categoriesWithData);
  };

  return {
    policiesCompliance,
    evidenceTasksCompliance,
    cloudTestsCompliance,
    overallCompliance: calculateOverallCompliance(),
    frameworkCompliance,
    policies: uniquePolicies,
    evidenceTasks: uniqueEvidence,
    tests,
  };
}

/**
 * Helper function to find which framework an artifact belongs to
 */
function findFrameworkIdForArtifact(
  artifactId: string,
  frameworksWithControls: (FrameworkInstance & {
    controls: (Control & {
      artifacts: Artifact[];
    })[];
  })[]
): string | undefined {
  for (const framework of frameworksWithControls) {
    for (const control of framework.controls) {
      const artifactExists = control.artifacts.some((a) => a.id === artifactId);
      if (artifactExists) {
        return framework.frameworkId;
      }
    }
  }
  return undefined;
}
