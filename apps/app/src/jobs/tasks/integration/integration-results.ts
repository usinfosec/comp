import { db } from "@bubba/db";
import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { integrations } from "@bubba/integrations";

import { decrypt } from "@/lib/encryption";
import type { EncryptedData } from "@/lib/encryption";

// Create a map of integration handlers with proper typing
type IntegrationHandler = {
	id: string;
	fetch: (
		region: string,
		accessKeyId: string,
		secretAccessKey: string,
		sessionToken: string,
	) => Promise<any[]>;
};

// Create a map of integration handlers
const integrationHandlers = new Map<string, IntegrationHandler>();

// Find and add integrations to the map if they exist
const aws = integrations.find((integration) => integration.id === "aws");
const gcp = integrations.find((integration) => integration.id === "gcp");
const azure = integrations.find((integration) => integration.id === "azure");

if (aws && "fetch" in aws) {
	integrationHandlers.set("aws", aws as unknown as IntegrationHandler);
}
if (gcp && "fetch" in gcp) {
	integrationHandlers.set("gcp", gcp as unknown as IntegrationHandler);
}
if (azure && "fetch" in azure) {
	integrationHandlers.set("azure", azure as unknown as IntegrationHandler);
}

export const sendIntegrationResults = schemaTask({
  id: "send-integration-results",
  schema: z.object({
    integration: z.object({
      id: z.string(),
      name: z.string(),
      integration_id: z.string(),
      settings: z.any(),
      user_settings: z.any(),
      organization: z.object({
        id: z.string(),
        name: z.string(),
      }),
    }),
  }),
  maxDuration: 1000 * 60 * 10, // 10 minutes
  run: async (payload) => {
    const { integration } = payload;

    try {
      // Access the integration_id to determine which integration to run
      const integrationId = integration.integration_id;

      // Extract user settings which may contain necessary credentials
      const userSettings = integration.user_settings;

      const integrationHandler = integrationHandlers.get(integrationId);

      if (!integrationHandler) {
        logger.error(`Integration handler for ${integrationId} not found`);
        return { success: false, error: "Integration handler not found" };
      }
      const { region, access_key_id, secret_access_key, session_token } =
      integration.user_settings as unknown as {
        region: EncryptedData;
        access_key_id: EncryptedData;
        secret_access_key: EncryptedData;
        session_token: EncryptedData;
      };

      const decryptedRegion = await decrypt(region);
      const decryptedAccessKeyId = await decrypt(access_key_id);
      const decryptedSecretAccessKey = await decrypt(secret_access_key);
      const decryptedSessionToken = await decrypt(session_token);
      
      const results = await integrationHandler.fetch(
        decryptedRegion,
        decryptedAccessKeyId,
        decryptedSecretAccessKey,
        decryptedSessionToken,
      );

      // Store the integration results using model name that matches the database
      for (const result of results) {
        // First verify the integration exists
        const existingIntegration =
          await db.organizationIntegrations.findUnique({
            where: { id: integration.id },
          });

        if (!existingIntegration) {
          logger.error(`Integration with ID ${integration.id} not found`);
          continue;
        }

        await db.organizationIntegrationResults.create({
          data: {
            title: result?.Title,
            status: result?.Compliance?.Status || "unknown",
            label: result?.Severity?.Label || "INFO",
            resultDetails: result || { error: "No result returned" },
            organizationIntegrationId: existingIntegration.id,
            organizationId: integration.organization.id,
            // assignedUserId is now optional, so we don't need to provide it
          },
        });
      }

      logger.info(`Integration run completed for ${integration.name}`);
      return { success: true };

    } catch (error) {
      logger.error(`Error running integration: ${error}`);

      // Record the failure using model name that matches the database
      try {
        await db.organizationIntegrationResults.create({
          data: {
            title: `${integration.name} Security Check`,
            status: "error",
            label: "ERROR",
            resultDetails: {
              error: error instanceof Error ? error.message : String(error),
            },
            organizationIntegrationId: integration.integration_id,
            organizationId: integration.organization.id,
            // assignedUserId is now optional, so we don't need to provide it
          },
        });
      } catch (createError) {
        logger.error(`Failed to create error record: ${createError}`);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
});
