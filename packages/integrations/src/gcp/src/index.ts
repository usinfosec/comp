/**
import { SecurityCenterClient } from "@google-cloud/security-center";

// GCP Project and Organization Settings
const ORGANIZATION_ID = "your-organization-id"; // Replace with your GCP Organization ID
const FILTER = "state=\"ACTIVE\""; // 🔹 Filter for only active security findings

const client = new SecurityCenterClient();

async function fetchSecurityFindings(): Promise<void> {
  try {
    const orgResource = `organizations/${ORGANIZATION_ID}`;

    // 🔹 API request to fetch Security Command Center (SCC) findings
    const [findingsResponse] = await client.listFindings({
      parent: `${orgResource}/sources/-`, // "-" fetches findings from all sources
      filter: FILTER, // Optional filtering (e.g., active findings only)
      pageSize: 100, // Adjust page size as needed (default max is 1000)
    });

    const findings = findingsResponse.findings || [];
    console.log(`Retrieved ${findings.length} security findings.`);

    // 🔹 Process and log findings
    findings.forEach((finding) => {
      console.log(`🛑 [${finding.severity}] ${finding.category} - ${finding.state}`);
    });

    return findings;
  } catch (error) {
    console.error("Error fetching GCP security findings:", error);
    throw error;
  }
}

// Run the function
fetchSecurityFindings();
 */


import {
	SecurityHubClient,
	GetFindingsCommand,
} from "@aws-sdk/client-securityhub";
import type {
	SecurityHubClientConfig,
	GetFindingsCommandInput,
	GetFindingsCommandOutput,
} from "@aws-sdk/client-securityhub";

/**
 * Fetches security findings from AWS Security Hub
 * @returns Promise containing an array of findings
 */
async function fetch(
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
				sessionToken: AWS_SESSION_TOKEN, // Required for temporary credentials
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

// Export the function for use in other modules
export { fetch };
