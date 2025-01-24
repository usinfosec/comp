import { soc2Seed } from "@/actions/soc2-seed";
import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import createDefaultPoliciesTask from "./create-default-policies";

export const newOrganizationTask = schemaTask({
  id: "new-organization",
  schema: z.object({
    organizationId: z.string().uuid(),
    userId: z.string().uuid(),
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
