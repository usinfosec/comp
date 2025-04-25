import * as fs from "node:fs/promises";
import * as path from "node:path";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

const prisma = new PrismaClient();
const JSON_FILE_PATH = path.join(__dirname, "vendors.json"); // Assumes vendors.json is in the same directory as the script

// Define an interface for better type safety matching the JSON structure
interface VendorJson {
	name?: string;
	headquarterAddress?: string;
	legalName?: string;
	websiteUrl?: string; // This is crucial (maps to PK)
	privacyPolicyUrl?: string;
	serviceLevelAgreementUrl?: string;
	serviceSoftwareAgreementUrl?: string; // Fallback for SLA
	description?: string;
	statusPageUrl?: string; // Not in schema, ignored
	termsOfServiceUrl?: string;
	category?: string;
	certifications?: string[];
	securityPageUrl?: string;
	trustPageUrl?: string;
	subprocessorsListUrl?: string; // Maps to subprocessors array
	// Add other potential fields from JSON if needed, even if not mapped
}

async function main() {
	console.log(`Attempting to load data from: ${JSON_FILE_PATH}`);

	let vendorsData: VendorJson[];
	try {
		const fileContent = await fs.readFile(JSON_FILE_PATH, "utf-8");
		vendorsData = JSON.parse(fileContent);
		console.log(
			`Successfully loaded ${vendorsData.length} vendor records from JSON.`,
		);
	} catch (error: any) {
		if (error.code === "ENOENT") {
			console.error(`Error: JSON file not found at ${JSON_FILE_PATH}`);
		} else if (error instanceof SyntaxError) {
			console.error(
				"Error: Failed to parse JSON file. Check for syntax errors.",
			);
			console.error(error.message);
		} else {
			console.error("Error reading or parsing JSON file:", error);
		}
		return; // Stop execution if file loading fails
	}

	let processedCount = 0;
	let skippedCount = 0;
	const errors: { vendorName: string | undefined; error: any }[] = [];

	console.log("Starting vendor data import/update...");

	for (const vendor of vendorsData) {
		const website = vendor.websiteUrl;

		// --- Validation: Skip if primary key (website) is missing ---
		if (!website) {
			console.warn(
				`Skipping record: Missing 'websiteUrl' for vendor (name: ${
					vendor.name ?? "N/A"
				}).`,
			);
			skippedCount++;
			continue;
		}

		// --- Data Mapping ---
		const slaUrl =
			vendor.serviceLevelAgreementUrl ??
			vendor.serviceSoftwareAgreementUrl ??
			null; // Handle fallback and ensure null if both missing
		const subprocessorsList = vendor.subprocessorsListUrl
			? [vendor.subprocessorsListUrl] // Put URL in an array
			: []; // Empty array if no URL

		try {
			await prisma.globalVendors.upsert({
				where: { website: website }, // Use the unique identifier
				update: {
					// Fields to update if record exists
					company_name: vendor.name ?? null,
					legal_name: vendor.legalName ?? null,
					company_description: vendor.description ?? null,
					company_hq_address: vendor.headquarterAddress ?? null,
					privacy_policy_url: vendor.privacyPolicyUrl ?? null,
					terms_of_service_url: vendor.termsOfServiceUrl ?? null,
					service_level_agreement_url: slaUrl,
					security_page_url: vendor.securityPageUrl ?? null,
					trust_page_url: vendor.trustPageUrl ?? null,
					security_certifications: vendor.certifications ?? [], // Default to empty array
					subprocessors: subprocessorsList,
					type_of_company: vendor.category ?? null,
					// 'approved' and 'createdAt' will use defaults or remain unchanged on update
				},
				create: {
					// Fields to set if record is new
					website: website, // PK must be provided on create
					company_name: vendor.name ?? null,
					legal_name: vendor.legalName ?? null,
					company_description: vendor.description ?? null,
					company_hq_address: vendor.headquarterAddress ?? null,
					privacy_policy_url: vendor.privacyPolicyUrl ?? null,
					terms_of_service_url: vendor.termsOfServiceUrl ?? null,
					service_level_agreement_url: slaUrl,
					security_page_url: vendor.securityPageUrl ?? null,
					trust_page_url: vendor.trustPageUrl ?? null,
					security_certifications: vendor.certifications ?? [],
					subprocessors: subprocessorsList,
					type_of_company: vendor.category ?? null,
					// 'approved' and 'createdAt' will use defaults defined in schema
				},
			});
			processedCount++;
			if (processedCount % 10 === 0) {
				// Log progress
				console.log(
					`  Processed ${processedCount}/${vendorsData.length} vendors...`,
				);
			}
		} catch (error: any) {
			console.error(
				`Error processing vendor '${vendor.name ?? website}':`,
				error?.message || error, // Log Prisma error message if available
			);
			errors.push({
				vendorName: vendor.name ?? website,
				error: error?.message || error,
			});
			// Continue processing other vendors even if one fails
		}
	}

	console.log("------------------------------------");
	console.log("Vendor import process finished.");
	console.log(`Successfully processed (inserted/updated): ${processedCount}`);
	console.log(`Skipped records (missing websiteUrl): ${skippedCount}`);
	if (errors.length > 0) {
		console.warn(`Encountered ${errors.length} errors during processing:`);
		for (const err of errors) {
			console.warn(` - ${err.vendorName}: ${err.error}`);
		}
	}
	console.log("------------------------------------");
}

main()
	.catch((e) => {
		console.error("An unexpected error occurred in the main function:", e);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
		console.log("Prisma client disconnected.");
	});
