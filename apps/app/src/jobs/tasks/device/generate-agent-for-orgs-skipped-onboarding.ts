import { db } from "@comp/db";
import { logger, schedules } from "@trigger.dev/sdk/v3";
import { generateAgentFile } from "./generate-agent-file";

export const generateAgentForOrgsSkippedOnboarding = schedules.task({
  id: "generate-agent-for-orgs-skipped-onboarding",
  cron: "0 * * * *", // every hour
  maxDuration: 1000 * 60 * 10, // 10 minutes
  run: async () => {
    const organizations = await db.organization.findMany({
      where: {
        isFleetSetupCompleted: false,
        onboarding: {
          completed: true,
        },
      },
    });

    logger.info(
      `Found ${organizations.length} organizations to generate agent for`
    );

    const batchItems = organizations.map((organization) => ({
      payload: {
        organizationId: organization.id,
      },
    }));

    logger.info(`Triggering batch job for ${batchItems.length} organizations`);
    await generateAgentFile.batchTrigger(batchItems);
  },
});
