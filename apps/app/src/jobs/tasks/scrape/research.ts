import { env } from "@/env.mjs";
import { db } from "@comp/db";
import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { string, z } from "zod";

// Define the schema for the expected final data
const firecrawlDataSchema = z.object({
	company_name: z.string().optional().nullable(),
	legal_name: z.string().optional().nullable(),
	company_description: z.string().optional().nullable(),
	company_hq_address: z.string().optional().nullable(),
	privacy_policy_url: z
		.union([z.string().url(), z.literal("")])
		.optional()
		.nullable(),
	terms_of_service_url: z
		.union([z.string().url(), z.literal("")])
		.optional()
		.nullable(),
	service_level_agreement_url: z
		.union([z.string().url(), z.literal("")])
		.optional()
		.nullable(),
	security_overview_url: z
		.union([z.string().url(), z.literal("")])
		.optional()
		.nullable(),
	trust_portal_url: z
		.union([z.string().url(), z.literal("")])
		.optional()
		.nullable(),
	certified_security_frameworks: z.array(z.string()).optional().nullable(),
	subprocessors: z.array(z.string()).optional().nullable(),
	type_of_company: z.string().optional().nullable(),
});

// Define the schema for the initial response containing the jobId
const initialResponseSchema = z.object({
	success: z.boolean(),
	id: z.string(), // Expecting id for async operation, not jobId
});

// Define the schema for the polling status response
const statusResponseSchema = z.object({
	success: z.boolean(),
	status: z.enum(["processing", "completed", "failed", "cancelled"]),
	data: z
		.union([
			firecrawlDataSchema,
			z
				.array(z.any())
				.length(0), // Allow empty array for processing status
			z.null(),
		])
		.optional(), // data is present on completion, array on processing, maybe null/absent otherwise
	expiresAt: z.string().optional(), // Include expiresAt as it's in the response
});

// Helper function to delay execution
function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const MAX_POLL_DURATION_MS = 1000 * 60 * 5; // 5 minutes polling timeout
const POLL_INTERVAL_MS = 5000; // 5 seconds polling interval

export const researchVendor = schemaTask({
	id: "research-vendor",
	schema: z.object({
		website: z.string().url(),
	}),
	maxDuration: 1000 * 60 * 10, // 10 minutes total task duration
	run: async (payload, { ctx }) => {
		const { website } = payload;
		logger.info("Starting vendor research", { website });
		const startTime = Date.now();

		try {
			const doesVendorExist = await db.globalVendors.findUnique({
				where: {
					website: website,
				},
			});

			if (doesVendorExist) {
				logger.info("Vendor already exists", { website });
				return {
					success: true,
					data: doesVendorExist,
				};
			}

			const initialResponse = await fetch(
				"https://api.firecrawl.dev/v1/extract",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${env.FIRECRAWL_API_KEY}`,
					},
					body: JSON.stringify({
						urls: [website],
						prompt: "You're a cyber security researcher, researching a vendor.",
						schema: {
							type: "object",
							properties: {
								company_name: { type: "string" },
								legal_name: { type: "string" },
								company_description: { type: "string" },
								company_hq_address: { type: "string" },
								privacy_policy_url: { type: "string" },
								terms_of_service_url: { type: "string" },
								service_level_agreement_url: {
									type: "string",
								},
								security_overview_url: { type: "string" },
								trust_portal_url: { type: "string" },
								certified_security_frameworks: {
									type: "array",
									items: { type: "string" },
								},
								subprocessors: {
									type: "array",
									items: { type: "string" },
								},
								type_of_company: { type: "string" },
							},
						},
						scrapeOptions: {
							onlyMainContent: true,
							removeBase64Images: true,
						},
					}),
				},
			);

			const initialData = await initialResponse.json();
			logger.info("Initial Firecrawl response", { initialData });

			const parsedInitial = initialResponseSchema.safeParse(initialData);

			if (!parsedInitial.success || !parsedInitial.data.id) {
				logger.error(
					"Failed to parse initial Firecrawl response or missing id",
					{
						error: parsedInitial.error?.issues,
						data: initialData,
					},
				);
				return {
					success: false,
					error: "Invalid initial response from Firecrawl",
				};
			}

			const { id: jobId } = parsedInitial.data;
			logger.info("Firecrawl job started", { jobId });

			// Polling loop
			while (Date.now() - startTime < MAX_POLL_DURATION_MS) {
				await sleep(POLL_INTERVAL_MS);

				const statusCheckResponse = await fetch(
					`https://api.firecrawl.dev/v1/extract/${jobId}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${env.FIRECRAWL_API_KEY}`,
						},
					},
				);

				const statusData = await statusCheckResponse.json();
				logger.debug("Polling Firecrawl job status", {
					jobId,
					statusData,
				});

				const parsedStatus = statusResponseSchema.safeParse(statusData);

				if (!parsedStatus.success) {
					logger.warn("Failed to parse Firecrawl status response", {
						error: parsedStatus.error?.issues,
						data: statusData, // Log the raw data for debugging
					});
					continue; // Try polling again
				}

				// Now we know the overall status response is valid according to the schema
				const { status, data } = parsedStatus.data; // data here can be object, [], null, or undefined

				switch (status) {
					case "completed": {
						logger.info("Firecrawl job completed successfully", {
							jobId,
							data,
						});

						const finalDataValidation =
							firecrawlDataSchema.safeParse(data);

						if (!finalDataValidation.success) {
							logger.error("Final data validation failed", {
								error: finalDataValidation.error.issues,
								data,
							});
							return {
								success: false,
								error: "Invalid final data structure from Firecrawl",
							};
						}

						const security_certifications =
							finalDataValidation.data
								.certified_security_frameworks ?? [];
						const subprocessors =
							finalDataValidation.data.subprocessors ?? [];

						await db.globalVendors.create({
							data: {
								company_name:
									finalDataValidation.data.company_name,
								website: website,
								company_description:
									finalDataValidation.data
										.company_description,
								company_hq_address:
									finalDataValidation.data.company_hq_address,
								privacy_policy_url:
									finalDataValidation.data.privacy_policy_url,
								terms_of_service_url:
									finalDataValidation.data
										.terms_of_service_url,
								service_level_agreement_url:
									finalDataValidation.data
										.service_level_agreement_url,
								security_page_url:
									finalDataValidation.data
										.security_overview_url,
								trust_page_url:
									finalDataValidation.data.trust_portal_url,
								security_certifications:
									security_certifications,
								subprocessors: subprocessors,
								type_of_company:
									finalDataValidation.data.type_of_company,
								approved: false,
							},
						});
						return {
							success: true,
							data: finalDataValidation.data,
						};
					}
					case "processing":
						logger.info("Firecrawl job still processing", {
							jobId,
						});
						continue; // Continue polling
					case "failed":
						logger.error("Firecrawl job failed", {
							jobId,
							statusData,
						});
						return {
							success: false,
							error: "Firecrawl job failed",
						};
					case "cancelled":
						logger.warn("Firecrawl job was cancelled", {
							jobId,
							statusData,
						});
						return {
							success: false,
							error: "Firecrawl job cancelled",
						};
					default:
						logger.warn("Unknown Firecrawl job status", {
							jobId,
							status,
						});
						continue; // Treat unknown status as processing for now
				}
			}

			logger.error("Firecrawl job polling timed out", { jobId, website });
			return { success: false, error: "Firecrawl job polling timed out" };
		} catch (error: any) {
			logger.error("Error during vendor research or polling", {
				error: error.message,
				stack: error.stack,
				website,
			});
			// Return failure to Trigger.dev
			return {
				success: false,
				error: error.message || "Unknown error occurred",
			};
		}
	},
});
