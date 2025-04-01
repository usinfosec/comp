import { auth } from "@bubba/auth";
import { db } from "@bubba/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { OrganizationIntegration } from "./integrations";

export async function IntegrationsServer() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const organization = await db.organization.findUnique({
    where: {
      id: session?.session.activeOrganizationId,
    },
  });

  if (!organization) {
    return redirect("/");
  }

  // Fetch organization integrations
  const integrations = await db.integration.findMany({
    where: {
      organizationId: organization.id,
    },
    include: {
      // Include the last run information for each integration
      lastRuns: {
        where: {
          organizationId: organization.id,
        },
        orderBy: {
          lastRunAt: "desc",
        },
        take: 1,
      },
    },
  });

  // Map integrations with last run data
  const integrationsWithRunInfo = integrations.map((integration) => {
    const lastRun = integration.lastRuns[0];

    // Calculate next run time (at midnight UTC)
    let nextRunAt = null;
    if (lastRun) {
      // Get the current UTC date
      const now = new Date();

      // Calculate the next midnight in UTC
      const nextMidnightUTC = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          // If we're already past midnight UTC today, use tomorrow
          now.getUTCHours() >= 0 ? now.getUTCDate() + 1 : now.getUTCDate(),
          0,
          0,
          0,
          0, // Set to midnight UTC (00:00:00.000)
        ),
      );

      nextRunAt = nextMidnightUTC;
    }

    return {
      ...integration,
      lastRunAt: lastRun?.lastRunAt || null,
      nextRunAt,
    };
  });

  return <OrganizationIntegration installed={integrationsWithRunInfo} />;
}
