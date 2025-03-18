import {
	SecurityHubClient,
	GetFindingsCommand,
} from "@aws-sdk/client-securityhub";
import type {
	SecurityHubClientConfig,
	GetFindingsCommandInput,
	GetFindingsCommandOutput,
} from "@aws-sdk/client-securityhub";
import { decrypt } from "@bubba/app/src/lib/encryption";
import type { EncryptedData } from "@bubba/app/src/lib/encryption";

interface AWSEncryptedCredentials {
	region: EncryptedData;
	access_key_id: EncryptedData;
	secret_access_key: EncryptedData;
}

/**
 * Fetches security findings from AWS Security Hub
 * @returns Promise containing an array of findings
 */
async function fetch(
	credentials: AWSEncryptedCredentials
): Promise<any[]> {
	try {
		// Decrypt credentials
		const decryptedRegion = await decrypt(credentials.region);
		const decryptedAccessKeyId = await decrypt(credentials.access_key_id);
		const decryptedSecretAccessKey = await decrypt(credentials.secret_access_key);

		// 1. Configure the SecurityHub client with AWS credentials
		const config: SecurityHubClientConfig = {
			region: decryptedRegion,
			credentials: {
				accessKeyId: decryptedAccessKeyId,
				secretAccessKey: decryptedSecretAccessKey,
			},
		};
		const securityHubClient = new SecurityHubClient(config);

		// 2. Define filters for the findings we want to retrieve.
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

// Export the function for use in other modules
export { fetch };
