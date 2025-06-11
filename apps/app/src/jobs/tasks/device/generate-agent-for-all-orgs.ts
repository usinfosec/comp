import { db } from "@comp/db";
import { logger, task } from "@trigger.dev/sdk/v3";
import { generateAgentFile } from "./generate-agent-file";

export const generateAgentForAllOrgs = task({
  id: "generate-agent-for-all-orgs",
  run: async () => {
    const organizations = await db.organization.findMany({
      where: {
        isFleetSetupCompleted: false,
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
