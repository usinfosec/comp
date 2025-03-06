import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";

export const newOrganizationTask = schemaTask({
  id: "new-organization",
  maxDuration: 1000 * 60 * 10, // 10 minutes
  schema: z.object({
    organizationId: z.string(),
    userId: z.string(),
  }),
  run: async ({ organizationId, userId }) => {
    logger.info("New organization task started", {
      organizationId,
      userId,
    });

    logger.info("New organization task completed", {
      organizationId,
      userId,
    });
  },
});
