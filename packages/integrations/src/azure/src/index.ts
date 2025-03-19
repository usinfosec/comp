import { DefaultAzureCredential } from "@azure/identity";
import nodeFetch from "node-fetch";
import { decrypt } from "@bubba/app/src/lib/encryption";
import type { EncryptedData } from "@bubba/app/src/lib/encryption";

const API_VERSION = "2019-01-01";

interface AzureEncryptedCredentials {
	AZURE_CLIENT_ID: EncryptedData;
	AZURE_TENANT_ID: EncryptedData;
	AZURE_CLIENT_SECRET: EncryptedData;
	AZURE_SUBSCRIPTION_ID: EncryptedData;
}

interface ComplianceControl {
	Id: string;
	name: string;
	standard: string;
	Title: string;
	description: string;
	state: string;
	Compliance: {
		Status: string;
	};
	Severity: {
		Label: string;
	};
	Remediation: {
		Recommendation: {
			Text: string;
			Url: string;
		};
	};
	Description: string;
}

interface ComplianceStandard {
	name: string;
	controls: ComplianceControl[];
}

interface AzureResponse {
	value: Array<{
		name: string;
		properties?: {
			description: string;
			state: string;
		};
	}>;
}

interface AzureControlResponse {
	name: string;
	properties?: {
		description: string;
		state: string;
	};
}

/**
 * Fetches compliance data from Azure Security Center
 * @returns Promise containing an array of compliance standards with their controls
 */
async function fetchComplianceData(
	credentials: AzureEncryptedCredentials,
): Promise<ComplianceControl[]> {
	try {
		// Decrypt credentials
		const decryptedClientId = await decrypt(credentials.AZURE_CLIENT_ID);
		const decryptedTenantId = await decrypt(credentials.AZURE_TENANT_ID);
		const decryptedClientSecret = await decrypt(
			credentials.AZURE_CLIENT_SECRET,
		);
		const decryptedSubscriptionId = await decrypt(
			credentials.AZURE_SUBSCRIPTION_ID,
		);

		const BASE_URL = `https://management.azure.com/subscriptions/${decryptedSubscriptionId}/providers/Microsoft.Security`;

		// Set environment variables for DefaultAzureCredential
		process.env.AZURE_CLIENT_ID = decryptedClientId;
		process.env.AZURE_TENANT_ID = decryptedTenantId;
		process.env.AZURE_CLIENT_SECRET = decryptedClientSecret;

		// Get access token
		const credential = new DefaultAzureCredential();
		const tokenResponse = await credential.getToken(
			"https://management.azure.com/.default",
		);
		const token = tokenResponse.token;

		// Fetch all compliance standards
		const standardsUrl = `${BASE_URL}/regulatoryComplianceStandards?api-version=${API_VERSION}`;
		const standardsResponse = await nodeFetch(standardsUrl, {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (!standardsResponse.ok) {
			throw new Error(
				`Failed to fetch standards: ${standardsResponse.statusText}`,
			);
		}

		const standardsData = (await standardsResponse.json()) as AzureResponse;
		const standards = standardsData.value.map((standard) => standard.name);

		// Fetch controls for each standard
		const complianceData: ComplianceStandard[] = [];

		// Fetch details for each control
		const controlDetails: ComplianceControl[] = [];

		for (const standard of standards) {
			const controlsUrl = `${BASE_URL}/regulatoryComplianceStandards/${standard}/regulatoryComplianceControls?api-version=${API_VERSION}`;
			const controlsResponse = await nodeFetch(controlsUrl, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			if (!controlsResponse.ok) {
				console.error(
					`Failed to fetch controls for ${standard}: ${controlsResponse.statusText}`,
				);
				continue;
			}

			const controlsData = (await controlsResponse.json()) as AzureResponse;
			const controls = controlsData.value.map((control) => control.name);

			for (const control of controls) {
				const detailsUrl = `${BASE_URL}/regulatoryComplianceStandards/${standard}/regulatoryComplianceControls/${control}?api-version=${API_VERSION}`;
				const detailsResponse = await nodeFetch(detailsUrl, {
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				});

				if (!detailsResponse.ok) {
					console.error(
						`Failed to fetch details for ${control} in ${standard}: ${detailsResponse.statusText}`,
					);
					continue;
				}

				const detailsData =
					(await detailsResponse.json()) as AzureControlResponse;
				const controlDetail = detailsData;
				if (controlDetail?.properties) {
					controlDetails.push({
						Id: detailsUrl,
						name: control,
						standard: standard,
						Title: controlDetail.properties.description,
						description: controlDetail.properties.description,
						state: controlDetail.properties.state,
						Compliance: {
							Status: controlDetail.properties.state,
						},
						Severity: {
							Label: controlDetail.properties.state,
						},
						Description: controlDetail.properties.description,
						Remediation: {
							Recommendation: {
								Text: controlDetail.properties.description,
								Url: "",
							},
						},
					});
				}
			}
		}
		console.log(JSON.stringify(controlDetails, null, 2));
		return controlDetails;
	} catch (error) {
		console.error("Error fetching Azure compliance data:", error);
		throw error;
	}
}

export { fetchComplianceData as fetch };
