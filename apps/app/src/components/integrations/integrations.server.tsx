import { auth } from "@/auth";
import { db } from "@bubba/db";
import { redirect } from "next/navigation";
import type { IntegrationSettingsItem } from "./integration-settings";
import { OrganizationIntegration } from "./integrations";

export async function IntegrationsServer() {
	const session = await auth();

	const organization = await db.organization.findUnique({
		where: {
			id: session?.user.organizationId,
		},
	});

	if (!organization) {
		return redirect("/");
	}

	// Fetch organization integrations
	const organizationIntegrations = await db.organizationIntegrations.findMany({
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
	const integrationsWithRunInfo = organizationIntegrations.map(
		(integration) => {
			const lastRun = integration.lastRuns[0];

			// Calculate next run time (at midnight after the last run)
			let nextRunAt = null;
			if (lastRun) {
				const lastRunDate = new Date(lastRun.lastRunAt);
				// Set to next midnight after the last run
				const nextMidnight = new Date(lastRunDate);
				nextMidnight.setDate(nextMidnight.getDate() + 1);
				nextMidnight.setHours(0, 0, 0, 0);

				// If next midnight is in the past (because lastRun was more than a day ago),
				// use upcoming midnight instead
				const now = new Date();
				if (nextMidnight < now) {
					nextMidnight.setDate(now.getDate() + 1);
				}

				nextRunAt = nextMidnight;
			}

			return {
				...integration,
				lastRunAt: lastRun?.lastRunAt || null,
				nextRunAt,
			};
		},
	);

	return <OrganizationIntegration installed={integrationsWithRunInfo} />;
}
