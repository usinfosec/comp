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
	privacy_policy_url: z.string().url().optional().nullable(),
	terms_of_service_url: z.string().url().optional().nullable(),
	service_level_agreement_url: z.string().url().optional().nullable(),
	security_overview_url: z.string().url().optional().nullable(),
	trust_portal_url: z.string().url().optional().nullable(),
	certified_security_frameworks: z.array(z.string()).optional().nullable(),
	subprocessors: z.array(z.string()).optional().nullable(),
	type_of_company: z.string().optional().nullable(),
});

// Define the schema for the initial response (might contain jobId)
const initialResponseSchema = z.object({
	success: z.boolean(),
	jobId: z.string().optional(), // jobId might be present if async
	data: z.any().optional(), // data might be present if sync/fast
	status: z.string().optional(), // status might be present
});

// Define the schema for the polling status response
const statusResponseSchema = z.object({
	success: z.boolean(),
	status: z.enum(["processing", "completed", "failed", "cancelled"]),
	data: firecrawlDataSchema.optional().nullable(), // data is present on completion
});

// Helper function to delay execution
function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const researchVendor = schemaTask({
	id: "research-vendor",
	schema: z.object({
		website: z.string().url(),
	}),
	maxDuration: 1000 * 60 * 10, // 10 minutes
	run: async (payload, { ctx }) => {
		const { website } = payload;
		logger.info("Starting vendor research", { website });

		try {
			// 1. Initiate Extraction Job (like curl POST)
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
						// Sending the schema structure directly
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
						// Potentially needed for async, though not explicitly documented for raw API
						// webhookId: null,
					}),
				},
			);

			if (!initialResponse.ok) {
				const errorBody = await initialResponse.text();
				throw new Error(
					`Firecrawl initial request failed with status ${initialResponse.status}: ${errorBody}`,
				);
			}

			const initialJson = await initialResponse.json();
			const parsedInitial = initialResponseSchema.safeParse(initialJson);

			if (!parsedInitial.success) {
				throw new Error(
					`Failed to parse initial Firecrawl response: ${parsedInitial.error.message}`,
				);
			}

			const { jobId, status, data } = parsedInitial.data;

			// If completed immediately (unlikely for complex scrapes but possible)
			if (status === "completed" && data) {
				const parsedData = firecrawlDataSchema.safeParse(data);
				if (parsedData.success) {
					logger.info("Firecrawl job completed synchronously", {
						data: parsedData.data,
					});
					// Here you would typically save the data to your DB
					// await db.globalVendors.create({ data: { website, ...parsedData.data } });
					return { success: true, data: parsedData.data };
				}
				logger.error("Failed to parse synchronously completed data", {
					error: parsedData.error,
					rawData: data,
				});
				throw new Error("Failed to parse completed Firecrawl data");
			}

			// If job started asynchronously
			if (jobId && status === "processing") {
				logger.info("Firecrawl job started asynchronously", { jobId });
				const maxAttempts = 60; // Poll for 5 minutes (60 attempts * 5 seconds)
				let attempts = 0;

				while (attempts < maxAttempts) {
					attempts++;
					logger.debug(`Polling job status attempt ${attempts}`, {
						jobId,
					});

					await sleep(5000); // Wait 5 seconds between polls

					// 2. Check Job Status (like curl GET)
					const statusResponse = await fetch(
						`https://api.firecrawl.dev/v1/extract/${jobId}`,
						{
							method: "GET",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${env.FIRECRAWL_API_KEY}`,
							},
						},
					);

					if (!statusResponse.ok) {
						// Don't throw immediately, maybe temporary issue
						logger.warn(
							`Firecrawl status check failed with status ${statusResponse.status}`,
							{ jobId },
						);
						continue; // Try again after delay
					}

					const statusJson = await statusResponse.json();
					const parsedStatus =
						statusResponseSchema.safeParse(statusJson);

					if (!parsedStatus.success) {
						logger.warn(
							"Failed to parse Firecrawl status response",
							{
								error: parsedStatus.error,
								rawData: statusJson,
								jobId,
							},
						);
						continue; // Try again
					}

					const currentStatus = parsedStatus.data.status;
					const resultData = parsedStatus.data.data;

					if (currentStatus === "completed") {
						logger.info("Firecrawl job completed", {
							jobId,
							data: resultData,
						});
						// Here you would typically save the data to your DB
						// await db.globalVendors.create({ data: { website, ...resultData } });
						return { success: true, data: resultData };
					}

					if (
						currentStatus === "failed" ||
						currentStatus === "cancelled"
					) {
						logger.error(
							`Firecrawl job ended with status: ${currentStatus}`,
							{ jobId },
						);
						throw new Error(
							`Firecrawl job ${jobId} ${currentStatus}`,
						);
					}

					// If still processing, loop continues...
					logger.debug("Job still processing", {
						jobId,
						status: currentStatus,
					});
				}

				logger.error("Firecrawl job timed out after polling", {
					jobId,
				});
				throw new Error(
					`Firecrawl job ${jobId} timed out after ${maxAttempts} attempts`,
				);
			}

			// If no jobId and not completed, something went wrong
			logger.error(
				"Firecrawl did not return a jobId or completed status",
				{
					response: parsedInitial.data,
				},
			);
			throw new Error(
				"Unexpected initial response from Firecrawl: No jobId and not completed.",
			);
		} catch (error: any) {
			logger.error("Error researching vendor", {
				error: error.message,
				stack: error.stack,
				website,
			});
			// Return failure to Trigger.dev
			return { success: false, error: error.message };
		}
	},
});
