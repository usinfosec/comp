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
		},
	);

	return <OrganizationIntegration installed={integrationsWithRunInfo} />;
}
