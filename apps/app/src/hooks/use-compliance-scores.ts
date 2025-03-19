"use client";

import { useMemo } from "react";
import { usePolicies } from "@/app/[locale]/(app)/(dashboard)/[orgId]/policies/all/(overview)/hooks/usePolicies";
import { useTests } from "@/app/[locale]/(app)/(dashboard)/[orgId]/tests/all/hooks/useTests";
import type {
  Framework,
  OrganizationControl,
  OrganizationFramework,
} from "@bubba/db/types";
import { useOrganizationEvidenceTasks } from "@/app/[locale]/(app)/(dashboard)/[orgId]/evidence/hooks/useEvidenceTasks";
import { usePoliciesByFramework } from "./use-policies-by-framework";

interface UseComplianceScoresProps {
  frameworks?: (OrganizationFramework & {
    framework: Framework;
    organizationControl: OrganizationControl[];
  })[];
}

export function useComplianceScores({
  frameworks = [],
}: UseComplianceScoresProps = {}) {
  // Getting ALL policies.
  const { policies = [], isLoading: policiesLoading } = usePolicies({
    page: 1,
    pageSize: 1000,
  });

  // Get policies by framework.
  const { policiesByFramework = [], isLoading: frameworksLoading } =
    usePoliciesByFramework();

  // Getting ALL evidence tasks.
  const { data: evidenceTasks = [], isLoading: evidenceTasksLoading } =
    useOrganizationEvidenceTasks({
      page: 1,
      pageSize: 1000,
    });

  // Create evidenceByFramework array for clearer separation of concerns
  const evidenceByFramework = useMemo(() => {
    // Map evidence tasks to their frameworks
    return evidenceTasks
      .filter((task) => task.frameworkId) // Only include tasks with a frameworkId
      .map((task) => ({
        id: task.id,
        frameworkId: task.frameworkId,
        evidenceId: task.id,
        published: task.published,
      }));
  }, [evidenceTasks]);

  // Getting ALL tests.
  const { tests = [], isLoading: testsLoading } = useTests();

  // Combined loading state
  const isLoading = policiesLoading || evidenceTasksLoading || testsLoading;

  // Calculate all compliance scores
  const scores = useMemo(() => {
    // Calculate policies compliance (checking for published status)
    const policiesCompliance =
      policies.length > 0
        ? Math.round(
            (policies.filter((p) => p.status === "published").length /
              policies.length) *
              100
          )
        : 0;

    // Calculate evidence tasks compliance (checking for published status)
    const evidenceTasksCompliance =
      evidenceTasks.length > 0
        ? Math.round(
            (evidenceTasks.filter((task) => task.published === true).length /
              evidenceTasks.length) *
              100
          )
        : 0;

    // Calculate cloud tests compliance (tests with "passed" result)
    const cloudTestsCompliance =
      tests.length > 0
        ? Math.round(
            (tests.filter((t) => t.result === "passed").length / tests.length) *
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

      // Find policies for this specific framework using policiesByFramework
      const frameworkPolicies = policiesByFramework.filter(
        (policy) => policy.frameworkId === framework.framework.id
      );

      // Calculate framework-specific policies compliance
      // We need to look up the policy status in the main policies array since policiesByFramework might not have it directly
      const frameworkPoliciesCompliance =
        frameworkPolicies.length > 0
          ? Math.round(
              (frameworkPolicies.filter((frameworkPolicy) => {
                // Find the corresponding policy in the main policies array
                const policy = policies.find(
                  (p) => p.id === frameworkPolicy.policyId
                );
                // Check if it's published
                return policy?.status === "published";
              }).length /
                frameworkPolicies.length) *
                100
            )
          : null;

      // Find evidence tasks related to this framework using evidenceByFramework
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
    };
  }, [
    policies,
    evidenceTasks,
    tests,
    frameworks,
    policiesByFramework,
    evidenceByFramework,
  ]);

  return {
    ...scores,
    isLoading,
    policies,
    evidenceTasks,
    tests,
  };
}
