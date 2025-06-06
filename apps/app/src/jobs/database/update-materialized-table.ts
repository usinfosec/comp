import { db } from "@comp/db";
import { logger, schedules } from "@trigger.dev/sdk/v3";

export const refreshMaterializedView = schedules.task({
	id: "refresh-materialized-view",
	cron: "0 5 * * *", // Runs every day at 5:00 AM UTC
	run: async () => {
		logger.info("Starting nightly refresh of OrganizationStats materialized view.");
		try {
			await db.$executeRawUnsafe(
				'REFRESH MATERIALIZED VIEW CONCURRENTLY "OrganizationStats";'
			);
			logger.info(
				"Successfully refreshed OrganizationStats materialized view."
			);
			return { success: true };
		} catch (error) {
			logger.error(
				"Failed to refresh OrganizationStats materialized view",
				{ error }
			);
			return {
				success: false,
				error: error instanceof Error ? error.message : String(error),
			};
		}
	},
});
