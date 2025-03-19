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

import { SecurityCenterClient } from "@google-cloud/security-center";
import type { google } from "@google-cloud/security-center/build/protos/protos";
import { decrypt } from "@bubba/app/src/lib/encryption";
import type { EncryptedData } from "@bubba/app/src/lib/encryption";

interface GCPEncryptedCredentials {
	project_id: EncryptedData;
	client_email: EncryptedData;
	private_key: EncryptedData;
	organization_id: EncryptedData;
}

type GCPFinding = google.cloud.securitycenter.v1.IFinding;

interface TransformedFinding {
	Id: string;
	Title: string;
	Compliance: {
		Status: string;
	};
	Severity: {
		Label: string;
	};
	[key: string]: any;
}

/**
 * Fetches security findings from GCP Security Command Center
 * @returns Promise containing an array of findings
 */
async function fetch(
	credentials: GCPEncryptedCredentials
): Promise<TransformedFinding[]> {
	try {
		// Decrypt credentials
		const decryptedProjectId = await decrypt(credentials.project_id);
		const decryptedClientEmail = await decrypt(credentials.client_email);
		const decryptedPrivateKey = await decrypt(credentials.private_key);
		const decryptedOrganizationId = await decrypt(credentials.organization_id);

		// Create a client
		const client = new SecurityCenterClient({
			credentials: {
				client_email: decryptedClientEmail,
				private_key: decryptedPrivateKey,
			},
			projectId: decryptedProjectId,
		});

		const orgResource = `organizations/${decryptedOrganizationId}`;
		const filter = 'state="ACTIVE"'; // Filter for only active security findings

		// API request to fetch Security Command Center (SCC) findings
		const [findingsResponse] = await client.listFindings({
			parent: `${orgResource}/sources/-`, // "-" fetches findings from all sources
			filter: filter,
			pageSize: 100, // Adjust page size as needed (default max is 1000)
		});

		const findings = (findingsResponse.findings || []) as GCPFinding[];
		console.log(`Retrieved ${findings.length} security findings.`);

		// Transform findings to match the expected format
		const transformedFindings = findings.map((finding: GCPFinding): TransformedFinding => ({
			Id: finding.name || "",
			Title: finding.category || "",
			Compliance: {
				Status: finding.state || "UNKNOWN",
			},
			Severity: {
				Label: finding.severity || "UNKNOWN",
			},
			...finding,
		}));

		return transformedFindings;
	} catch (error) {
		console.error("Error fetching GCP security findings:", error);
		throw error;
	}
}

export { fetch };
