const { DefaultAzureCredential } = require("@azure/identity");
const fetch = require("node-fetch");

const API_VERSION = "2019-01-01";
const requiredEnvVars = {
    AZURE_CLIENT_ID: process.env.AZURE_CLIENT_ID,
    AZURE_TENANT_ID: process.env.AZURE_TENANT_ID,
    AZURE_CLIENT_SECRET: process.env.AZURE_CLIENT_SECRET,
    AZURE_SUBSCRIPTION_ID: process.env.AZURE_SUBSCRIPTION_ID,
  };

const BASE_URL = `https://management.azure.com/subscriptions/${requiredEnvVars.AZURE_SUBSCRIPTION_ID}/providers/Microsoft.Security`;



/**
 * Authenticate and get an Azure access token
 */
async function getAccessToken() {
    try {
        const credential = new DefaultAzureCredential(
            requiredEnvVars.AZURE_TENANT_ID,
            requiredEnvVars.AZURE_CLIENT_ID,
            requiredEnvVars.AZURE_CLIENT_SECRET
        );
        const tokenResponse = await credential.getToken("https://management.azure.com/.default");
        return tokenResponse.token;
    } catch (error) {
        console.error("Failed to get access token:", error);
        throw error;
    }
}

/**
 * Fetch all compliance standards
 */
async function fetchComplianceStandards(token) {
    const url = `${BASE_URL}/regulatoryComplianceStandards?api-version=${API_VERSION}`;
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) throw new Error(`Failed to fetch standards: ${response.statusText}`);
        const data = await response.json();
        console.log(`✅ Found ${data.value.length} compliance standards.`);
        return data.value.map((standard) => standard.name);
    } catch (error) {
        console.error("Error fetching compliance standards:", error);
        return [];
    }
}

/**
 * Fetch all compliance controls for a given standard
 */
async function fetchComplianceControls(token, standard) {
    const url = `${BASE_URL}/regulatoryComplianceStandards/${standard}/regulatoryComplianceControls?api-version=${API_VERSION}`;
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) throw new Error(`Failed to fetch controls for ${standard}: ${response.statusText}`);
        const data = await response.json();
        console.log(`  🔹 ${standard}: Found ${data.value.length} controls.`);
        return data.value.map((control) => control.name);
    } catch (error) {
        console.error(`Error fetching controls for ${standard}:`, error);
        return [];
    }
}

/**
 * Fetch details of an individual compliance control
 */
async function fetchControlDetails(token, standard, control) {
    const url = `${BASE_URL}/regulatoryComplianceStandards/${standard}/regulatoryComplianceControls/${control}?api-version=${API_VERSION}`;
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) throw new Error(`Failed to fetch details for ${control} in ${standard}: ${response.statusText}`);
        const data = await response.json();
        console.log(`    ${(data.properties.state === "Passed" ? `✅` : `❌`)} Control: ${data.properties.description} - Status: ${data.properties.state}`);
        return data;
    } catch (error) {
        console.error(`Error fetching details for ${control} in ${standard}:`, error);
        return null;
    }
}

/**
 * Main function to fetch all compliance data
 */
async function main() {
    try {
        console.log("🔄 Fetching Azure compliance data...");
        const token = await getAccessToken();

        // Step 1: Fetch all compliance standards
        const standards = await fetchComplianceStandards(token);
        if (standards.length === 0) {
            console.log("❌ No compliance standards found.");
            return;
        }

        // Step 2: Fetch controls for each standard
        for (const standard of standards) {
            const controls = await fetchComplianceControls(token, standard);
            
            // Step 3: Fetch detailed control information
            for (const control of controls) {
                const controlDetails = await fetchControlDetails(token, standard, control);
            }
        }

        console.log("✅ Compliance data retrieval complete.");
    } catch (error) {
        console.error("🚨 Error in main execution:", error);
    }
}

// Run the script
main();
