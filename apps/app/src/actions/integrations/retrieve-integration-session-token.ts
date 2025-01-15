// retrieve-integration-session-token.ts

"use server";

import { Nango } from "@nangohq/node";
import { authActionClient } from "../safe-action";
import { createIntegrationSchema } from "../schema";

export const retrieveIntegrationSessionTokenAction = authActionClient
  .schema(createIntegrationSchema)
  .metadata({
    name: "retrieve-integration-session-token",
    track: {
      event: "retrieve-integration-session-token",
      channel: "server",
    },
  })
  .action(async ({ parsedInput, ctx }) => {
    const { integrationId } = parsedInput;
    const { user } = ctx;

    const nango = new Nango({
      secretKey: process.env.NANGO_SECRET_KEY as string,
    });

    const response = await nango.createConnectSession({
      end_user: {
        id: user.id,
        email: user.email || undefined,
        display_name: user.name || undefined,
      },
      organization: {
        id: user.organizationId,
      },
      allowed_integrations: [integrationId],
    });

    return {
      success: true,
      sessionToken: response.data.token,
    };
  });
