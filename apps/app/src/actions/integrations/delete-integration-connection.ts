// delete-integration-connection.ts

"use server";

import { db } from "@bubba/db";
import { revalidatePath } from "next/cache";
import { authActionClient } from "../safe-action";
import { deleteIntegrationConnectionSchema } from "../schema";

export const deleteIntegrationConnectionAction = authActionClient
  .schema(deleteIntegrationConnectionSchema)
  .metadata({
    name: "delete-integration-connection",
    track: {
      event: "delete-integration-connection",
      channel: "server",
    },
  })
  .action(async ({ parsedInput, ctx }) => {
    const { integrationId } = parsedInput;
    const { user } = ctx;

    const integration = await db.organizationIntegrations.findUnique({
      where: {
        name: integrationId.toLowerCase(),
        organizationId: user.organizationId,
      },
    });

    if (!integration) {
      return {
        success: false,
        error: "Integration not found",
      };
    }

    await db.organizationIntegrations.delete({
      where: {
        id: integration.id,
      },
    });

    revalidatePath("/integrations");

    return {
      success: true,
    };
  });
