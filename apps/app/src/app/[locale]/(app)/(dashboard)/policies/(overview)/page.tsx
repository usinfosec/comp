import { auth } from "@/auth";
import { PoliciesByAssignee } from "@/components/policies/charts/policies-by-assignee";
import { PoliciesByFramework } from "@/components/policies/charts/policies-by-framework";
import { PolicyOverview } from "@/components/policies/charts/policy-overview";
import { db } from "@bubba/db";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";

export default async function PoliciesOverview() {
  const session = await auth();

  if (!session?.user?.organizationId) {
    redirect("/onboarding");
  }

  const overview = await getPolicyOverview(session.user.organizationId);

  if (overview?.policies === 0) {
    redirect("/policies/all");
  }

  const frameworkStats = await getPoliciesByFramework(
    session.user.organizationId,
  );

  return (
    <div className="space-y-4 sm:space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PolicyOverview data={overview} />
        <PoliciesByFramework data={frameworkStats} />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <PoliciesByAssignee organizationId={session.user.organizationId} />
      </div>
    </div>
  );
}

const getPolicyOverview = unstable_cache(
  async (organizationId: string) => {
    return await db.$transaction(async (tx) => {
      const [policies, draftPolicies, publishedPolicies, needsReviewPolicies] =
        await Promise.all([
          tx.artifact.count({
            where: {
              organizationId,
              type: "policy",
            },
          }),
          tx.artifact.count({
            where: {
              organizationId,
              type: "policy",
              published: false,
            },
          }),
          tx.artifact.count({
            where: {
              organizationId,
              type: "policy",
              published: true,
            },
          }),
          tx.artifact.count({
            where: {
              organizationId,
              type: "policy",
              needsReview: true,
            },
          }),
        ]);

      return {
        policies,
        draftPolicies,
        publishedPolicies,
        needsReviewPolicies,
      };
    });
  },
  ["policy-overview-cache"],
);

const getPoliciesByFramework = unstable_cache(
  async (organizationId: string) => {
    const stats = await db.$transaction(async (tx) => {
      // Debug: Check if we have any frameworks at all
      const allFrameworks = await tx.framework.findMany({
        select: { id: true, name: true },
      });
      console.log("Available Frameworks:", allFrameworks);

      // First check if we have any organization frameworks
      const orgFrameworks = await tx.organizationFramework.findMany({
        where: { organizationId },
        select: {
          id: true,
          frameworkId: true,
          framework: {
            select: {
              name: true,
            },
          },
        },
      });

      console.log("Organization Frameworks:", orgFrameworks);

      // Then get the controls and artifacts
      const frameworks = await tx.organizationControl.findMany({
        where: {
          organizationId,
          organizationFrameworkId: {
            in: orgFrameworks.map((f) => f.id),
          },
        },
        select: {
          OrganizationFramework: {
            select: {
              framework: {
                select: {
                  name: true,
                },
              },
            },
          },
          artifacts: {
            select: {
              artifact: {
                select: {
                  id: true,
                  type: true,
                },
              },
            },
          },
        },
      });

      console.log("Framework Data:", JSON.stringify(frameworks, null, 2));

      // Group policies by framework
      const frameworkPolicies = new Map<string, Set<string>>();

      for (const control of frameworks) {
        const frameworkName = control.OrganizationFramework?.framework.name;
        if (!frameworkName) continue;

        if (!frameworkPolicies.has(frameworkName)) {
          frameworkPolicies.set(frameworkName, new Set());
        }

        for (const artifact of control.artifacts) {
          if (artifact.artifact.type === "policy") {
            frameworkPolicies.get(frameworkName)?.add(artifact.artifact.id);
          }
        }
      }

      // Convert to the format needed for the chart
      const stats = Array.from(frameworkPolicies.entries()).map(
        ([name, policies]) => ({
          name,
          value: policies.size,
        }),
      );

      console.log("Final Stats:", stats);

      return stats;
    });

    return stats.filter((stat) => stat.value > 0);
  },
  ["policies-by-framework-cache"],
);
