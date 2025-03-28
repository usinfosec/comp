"use server";

import { db } from "@bubba/db";
import type {
  Framework,
  OrganizationControl,
  OrganizationEvidence,
  OrganizationIntegrationResults,
  OrganizationFramework,
  OrganizationPolicy,
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
  policies: OrganizationPolicy[];
  evidenceTasks: OrganizationEvidence[];
  tests: any[];
}

export async function getComplianceScores(
  organizationId: string,
  frameworks: (OrganizationFramework & {
    framework: Framework;
    organizationControl: OrganizationControl[];
  })[]
): Promise<ComplianceScoresResult> {
  // Get all policies for the organization
  const policies = await db.organizationPolicy.findMany({
    where: { organizationId },
    include: {
      policy: {
        select: {
          id: true,
          name: true,
          description: true,
          slug: true,
        },
      },
    },
  });

  // Get all policies by framework
  const policiesByFramework = await db.policyFramework.findMany({
    where: {
      policy: {
        OrganizationPolicy: {
          some: {
            organizationId,
          },
        },
      },
    },
    include: {
      policy: {
        select: {
          id: true,
          OrganizationPolicy: {
            where: { organizationId },
            select: { id: true, status: true },
          },
        },
      },
    },
  });

  // Map policy framework data to a simpler structure
  const mappedPoliciesByFramework = policiesByFramework.map((pf) => ({
    frameworkId: pf.frameworkId,
    policyId: pf.policyId,
    organizationPolicyId: pf.policy.OrganizationPolicy[0]?.id,
    status: pf.policy.OrganizationPolicy[0]?.status,
  }));

  // Get all evidence tasks for the organization
  const evidenceTasks = await db.organizationEvidence.findMany({
    where: { organizationId },
    include: {
      evidence: true,
    },
  });

  // Map evidence tasks to framework
  const evidenceByFramework = evidenceTasks
    .filter((task) => task.frameworkId) // Only include tasks with a frameworkId
    .map((task) => ({
      id: task.id,
      frameworkId: task.frameworkId,
      evidenceId: task.id,
      published: task.published,
    }));

  // Get all tests for the organization (using organizationIntegrationResults as per the getTests action)
  const integrationResults = await db.organizationIntegrationResults.findMany({
    where: { organizationId },
    include: {
      organizationIntegration: {
        select: {
          id: true,
          name: true,
          integration_id: true,
        },
      },
    },
  });

  // Transform the data to match the expected format
  const tests = integrationResults.map((result) => ({
    id: result.id,
    severity: result.severity,
    result: result.status,
    title: result.title || result.organizationIntegration.name,
    provider: result.organizationIntegration.integration_id,
    createdAt: result.completedAt || new Date(),
  }));

  // Calculate policies compliance
  const policiesCompliance =
    policies.length > 0
      ? Math.round(
          (policies.filter((p) => p.status === "published").length /
            policies.length) *
            100
        )
      : 0;

  // Calculate evidence tasks compliance
  const evidenceTasksCompliance =
    evidenceTasks.length > 0
      ? Math.round(
          (evidenceTasks.filter((task) => task.published === true).length /
            evidenceTasks.length) *
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
  const frameworkCompliance = frameworks.map((framework) => {
    // Calculate framework controls compliance
    const totalControls = framework.organizationControl.length;

    // Count controls with any progress (in_progress or compliant)
    const inProgressControls = framework.organizationControl.filter(
      (control) => control.status === "in_progress"
    ).length;

    const compliantControls = framework.organizationControl.filter(
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
      (policy) => policy.frameworkId === framework.framework.id
    );

    // Calculate framework-specific policies compliance
    const frameworkPoliciesCompliance =
      frameworkPolicies.length > 0
        ? Math.round(
            (frameworkPolicies.filter(
              (frameworkPolicy) => frameworkPolicy.status === "published"
            ).length /
              frameworkPolicies.length) *
              100
          )
        : null;

    // Find evidence tasks related to this framework
    const frameworkEvidenceTasks = evidenceByFramework.filter(
      (evidence) => evidence.frameworkId === framework.framework.id
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
      id: framework.framework.id,
      name: framework.framework.name,
      compliance: totalCompliance,
    };
  });

  // Calculate overall compliance as the average of all available scores
  const calculateOverallCompliance = () => {
    // Count how many categories have data
    const categoriesWithData = [
      policies.length > 0,
      evidenceTasks.length > 0,
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
    policies,
    evidenceTasks,
    tests,
  };
}
