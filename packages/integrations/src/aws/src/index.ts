import {
	SecurityHubClient,
	GetFindingsCommand,
} from "@aws-sdk/client-securityhub";
import type {
	SecurityHubClientConfig,
	GetFindingsCommandInput,
	GetFindingsCommandOutput,
} from "@aws-sdk/client-securityhub";

interface AWSCredentials {
	region: string;
	access_key_id: string;
	secret_access_key: string;
}

/**
 * Fetches security findings from AWS Security Hub
 * @returns Promise containing an array of findings
 */
async function fetch(credentials: AWSCredentials): Promise<any[]> {
	try {
		// 1. Configure the SecurityHub client with AWS credentials
		const config: SecurityHubClientConfig = {
			region: credentials.region,
			credentials: {
				accessKeyId: credentials.access_key_id,
				secretAccessKey: credentials.secret_access_key,
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

// Export the function and types for use in other modules
export { fetch };
export type { AWSCredentials };
