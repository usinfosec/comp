const { DefaultAzureCredential } = require("@azure/identity");
const fetch = require("node-fetch");

// Azure Subscription ID (replace with actual ID)
const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID; // 🔹 Replace with your Azure Subscription ID
const API_VERSION = "2023-01-01";  // 🔹 API version for Defender for Cloud

// Base URL for Microsoft Defender for Cloud
const SECURITY_ALERTS_URL = `https://management.azure.com/subscriptions/${subscriptionId}/providers/Microsoft.Security/alerts?api-version=${API_VERSION}`;

// Function to fetch Security Findings from Microsoft Defender for Cloud
async function fetchSecurityFindings() {
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

    let findings = [];
    let url = SECURITY_ALERTS_URL;

    // 🔹 Loop through all pages of results (handles pagination)
    while (url) {
      const response = await fetch(url, { headers });
      if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

      const data = await response.json();
      findings = findings.concat(data.value || []); // Append new findings

      // 🔹 Handle pagination (if "nextLink" exists, fetch next page)
      url = data.nextLink || null;
    }

    console.log(`Retrieved ${findings.length} security findings.`);

    // 🔹 Process findings (filter active alerts, format output, etc.)
    for (const finding of findings) {
      console.log(`🛑 [${finding.properties.severity}] ${finding.properties.alertDisplayName} - ${finding.properties.status}`);
    }

    return findings;
  } catch (error) {
    console.error("Error fetching security findings:", error);
    throw error;
  }
}

// Run the function
fetchSecurityFindings();