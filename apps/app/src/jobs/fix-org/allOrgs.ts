import { db } from "@comp/db";
import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { fixSingleOrgTask } from "./singleOrg";

export const fixAllOrgsTask = schemaTask({
	id: "fix-all-orgs",
	run: async (payload, { ctx }) => {
		try {

		try {
			logger.info(
				"Starting fix-all-orgs task: Fetching all organizations.",
			);

			const organizations = await db.organization.findMany({
				select: { id: true, name: true },
			});

			logger.info(
				`Found ${organizations.length} organizations to process.`,
			);

			const batchSize = 500;
			let totalSent = 0;

			for (let i = 0; i < organizations.length; i += batchSize) {
				const batch = organizations.slice(i, i + batchSize);
				const events = batch.map((org) => ({
					payload: { organizationId: org.id },
				}));

				if (events.length > 0) {
					logger.info(
						`Processing batch ${i / batchSize + 1}: Sending ${events.length} events.`,
					);
					await fixSingleOrgTask.batchTrigger(events);
					totalSent += events.length;
					logger.info(
						`Sent batch ${i / batchSize + 1}. Total sent so far: ${totalSent}.`,
					);
				}
			}

			if (totalSent === 0) {
				logger.info(
					"No organizations found or processed, no events sent.",
				);
			} else {
				logger.info(
					`Finished sending events. Total organizations processed: ${totalSent}.`,
				);
			}

			return { success: true, count: totalSent };
		} catch (error) {
			logger.error(`Error in fix-all-orgs task: ${error}`);
			// Consider more robust error handling/reporting if needed
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			return {
				success: false,
				error: errorMessage,
			};
		}
	},
});
