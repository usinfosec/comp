import { db } from "@comp/db";
import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { fixSingleOrgTask } from "./singleOrg";

export const fixAllOrgsTask = schemaTask({
	id: "fix-all-orgs",
	// This task doesn't need a payload schema itself
	// Removed maxDuration as it might not be necessary for just triggering other tasks
	run: async (payload, { ctx }) => {
		// Remove the previous logic related to integrations

		try {
			logger.info("Starting fix-all-orgs task: Fetching all organizations.");

			// Fetch all organizations
			const organizations = await db.organization.findMany({
				select: { id: true, name: true },
			});

			logger.info(`Found ${organizations.length} organizations to process.`);

			// Trigger fixSingleOrgTask for each organization
			const events = organizations.map((org) => ({
				payload: { organizationId: org.id }, // batchTrigger expects an array of { payload: ... }
				// name is not needed for batchTrigger, the task is specified by the object called
			}));

			if (events.length > 0) {
				// Use batchTrigger directly on the imported task definition
				await fixSingleOrgTask.batchTrigger(events);
				logger.info(`Sent ${events.length} events to fixSingleOrgTask.`);
			} else {
				logger.info("No organizations found, no events sent.");
			}

			return { success: true, count: organizations.length };
		} catch (error) {
			logger.error(`Error in fix-all-orgs task: ${error}`);
			return {
				success: false,
				error: error instanceof Error ? error.message : String(error),
			};
		}
	},
});

// Remove the old logic related to integrations
