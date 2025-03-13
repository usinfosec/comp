/*
import { DefaultAzureCredential } from "@azure/identity";
import fetch from "node-fetch";

// Azure Subscription ID (replace with actual ID)
const subscriptionId = "your-subscription-id";  // 🔹 Replace with your Azure Subscription ID
const API_VERSION = "2023-01-01";  // 🔹 API version for Defender for Cloud

// Base URL for Microsoft Defender for Cloud
const SECURITY_ALERTS_URL = `https://management.azure.com/subscriptions/${subscriptionId}/providers/Microsoft.Security/alerts?api-version=${API_VERSION}`;

// Function to fetch Security Findings from Microsoft Defender for Cloud
async function fetchSecurityFindings(): Promise<void> {
  try {
    // 🔹 Authenticate using DefaultAzureCredential (supports managed identity, environment variables, etc.)
    const credential = new DefaultAzureCredential();
    const tokenResponse = await credential.getToken("https://management.azure.com/.default");

    if (!tokenResponse || !tokenResponse.token) {
      throw new Error("Failed to retrieve Azure authentication token.");
    }

    // 🔹 Set up the API request headers
    const headers = {
      Authorization: `Bearer ${tokenResponse.token}`,
      "Content-Type": "application/json",
    };

    let findings: any[] = [];
    let url = SECURITY_ALERTS_URL;

    // 🔹 Loop through all pages of results (handles pagination)
    while (url) {
      const response = await fetch(url, { headers });
      if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

      const data = await response.json();
      findings = findings.concat(data.value || []); // Append new findings

      // 🔹 Handle pagination (if "nextLink" exists, fetch next page)
      url = data["nextLink"] || null;
    }

    console.log(`Retrieved ${findings.length} security findings.`);

    // 🔹 Process findings (filter active alerts, format output, etc.)
    findings.forEach((finding) => {
      console.log(`🛑 [${finding.properties.severity}] ${finding.properties.alertDisplayName} - ${finding.properties.status}`);
    });

    return findings;
  } catch (error) {
    console.error("Error fetching security findings:", error);
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
