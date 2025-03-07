"use server";

import { db } from "@bubba/db";
import { revalidatePath } from "next/cache";
import { authActionClient } from "@/actions/safe-action";
import { decrypt } from "@/lib/encryption";
import {
	SecurityHubClient,
	GetFindingsCommand,
	type SecurityHubClientConfig,
	type GetFindingsCommandInput,
	type GetFindingsCommandOutput,
} from "@aws-sdk/client-securityhub";

/**
 * Fetches security findings from AWS Security Hub
 * @returns Promise containing an array of findings
 */
async function fetchSecurityFindings(
	AWS_REGION: string,
	AWS_ACCESS_KEY_ID: string,
	AWS_SECRET_ACCESS_KEY: string,
	AWS_SESSION_TOKEN: string,
): Promise<any[]> {
	try {
		// 1. Configure the SecurityHub client with AWS credentials
		// For production, prefer using environment variables or AWS credential profiles rather than hardcoding
		const config: SecurityHubClientConfig = {
			region: AWS_REGION,
			credentials: {
				accessKeyId: AWS_ACCESS_KEY_ID,
				secretAccessKey: AWS_SECRET_ACCESS_KEY,
				sessionToken: AWS_SESSION_TOKEN,
			},
		};
		const securityHubClient = new SecurityHubClient(config);

		// 2. Define filters for the findings we want to retrieve.
		// Example: get only NEW (unresolved) findings for failed compliance controls.
		const params: GetFindingsCommandInput = {
			Filters: {
				WorkflowStatus: [{ Value: "NEW", Comparison: "EQUALS" }], // only active findings
				ComplianceStatus: [{ Value: "FAILED", Comparison: "EQUALS" }], // only failed control checks
			},
			MaxResults: 100, // adjust page size as needed (max 100)
		};

		const command = new GetFindingsCommand(params);
		let response: GetFindingsCommandOutput =
			await securityHubClient.send(command);

		const allFindings: any[] = response.Findings || [];
		let nextToken = response.NextToken;

		// 3. Loop to paginate through all results if there are more than 100 findings
		while (nextToken) {
			const nextPageParams: GetFindingsCommandInput = {
				...params,
				NextToken: nextToken,
			};
			response = await securityHubClient.send(
				new GetFindingsCommand(nextPageParams),
			);

			if (response.Findings) {
				allFindings.push(...response.Findings);
			}

			nextToken = response.NextToken;
		}

		console.log(`Retrieved ${allFindings.length} findings`);
		return allFindings;
	} catch (error) {
		console.error("Error fetching Security Hub findings:", error);
		throw error;
	}
}

export const refreshTestsAction = authActionClient
  .metadata({
    name: "refresh-tests",
    track: {
      event: "refresh-tests",
      channel: "server",
    },
  })
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx;

    if (!user.id || !user.organizationId) {
      throw new Error("Invalid user input");
    }

	const integrations = await db.organizationIntegrations.findMany({
		where: {
			organizationId: user.organizationId,
		},
	});

	for (const integration of integrations) {
		if (integration.integration_id === "aws") {
      const { region, access_key_id, secret_access_key, session_token } = integration.user_settings;
      const decryptedRegion = await decrypt(region);
      const decryptedAccessKeyId = await decrypt(access_key_id);
      const decryptedSecretAccessKey = await decrypt(secret_access_key);
      const decryptedSessionToken = await decrypt(session_token);

      console.log(decryptedRegion, decryptedAccessKeyId, decryptedSecretAccessKey, decryptedSessionToken);

      const results = await fetchSecurityFindings(decryptedRegion, decryptedAccessKeyId, decryptedSecretAccessKey, decryptedSessionToken);

      // Store the integration results using model name that matches the database
      for (const result of results) {

        // Check if a result with the same AWS Security Hub finding ID already exists
        const existingResult = await db.organizationIntegrationResults.findFirst({
          where: {
            resultDetails: {
              path: ['Id'],
              equals: result?.Id
            },
            organizationIntegrationId: integration.integration_id,
          },
        });

        if (existingResult) {
          // Update the existing result instead of creating a new one
          await db.organizationIntegrationResults.update({
            where: { id: existingResult.id },
            data: {
              status: result?.Compliance?.Status || "unknown",
              label: result?.Severity?.Label || "INFO",
              resultDetails: result || { error: "No result returned" },
            },
          });
          continue;
        }

        await db.organizationIntegrationResults.create({
          data: {
            title: result?.Title,
            status: result?.Compliance?.Status || "unknown",
            label: result?.Severity?.Label || "INFO",
            resultDetails: result || { error: "No result returned" },
            organizationIntegrationId: integration.integration_id,
            organizationId: integration.organizationId,
            // assignedUserId is now optional, so we don't need to provide it
          },
        });
      }
		}
	}

    console.log("Refreshing tests");

    revalidatePath("/tests");

    return { success: true };
  });