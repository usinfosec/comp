"use server";

import { db } from "@bubba/db";
import { revalidatePath } from "next/cache";
import { authActionClient } from "@/actions/safe-action";
import { integrations } from "@bubba/integrations";

// Create a map of integration handlers with proper typing
type IntegrationHandler = {
	id: string;
	fetch: (credentials: any) => Promise<any[]>;
};

// Create a map of integration handlers
const integrationHandlers = new Map<string, IntegrationHandler>();

// Find and add integrations to the map if they exist
const aws = integrations.find((integration) => integration.id === "aws");
const gcp = integrations.find((integration) => integration.id === "gcp");
const azure = integrations.find((integration) => integration.id === "azure");

if (aws && "fetch" in aws) {
	integrationHandlers.set("aws", aws as unknown as IntegrationHandler);
}
if (gcp && "fetch" in gcp) {
	integrationHandlers.set("gcp", gcp as unknown as IntegrationHandler);
}
if (azure && "fetch" in azure) {
	integrationHandlers.set("azure", azure as unknown as IntegrationHandler);
}

export const refreshTestsAction = authActionClient
	.metadata({
		name: "refresh-tests",
		track: {
			event: "refresh-tests",
			channel: "server",
		},
	})
	.action(async ({ parsedInput, ctx }) => {
		const { user } = ctx;

		if (!user.id || !user.organizationId) {
			throw new Error("Invalid user input");
		}

		const integrationsTable = await db.organizationIntegrations.findMany({
			where: {
				organizationId: user.organizationId,
			},
		});

		for (const integration of integrationsTable) {
			const integrationHandler = integrationHandlers.get(
				integration.integration_id,
			);

			// Skip if no handler is found for this integration type
			if (!integrationHandler) {
				console.log(
					`No handler found for integration type: ${integration.integration_id}`,
				);
				continue;
			}

			try {
				// Pass encrypted credentials directly to the integration handler
				const results = await integrationHandler.fetch(integration.user_settings);

				// Store the integration results using model name that matches the database
				for (const result of results) {
					// First verify the integration exists
					const existingIntegration =
						await db.organizationIntegrations.findUnique({
							where: { id: integration.id },
						});

					if (!existingIntegration) {
						console.log(`Integration with ID ${integration.id} not found`);
						continue;
					}

					// Check if a result with the same finding ID already exists
					// Assuming all integrations have an Id field in their results
					const existingResult =
						await db.organizationIntegrationResults.findFirst({
							where: {
								resultDetails: {
									path: ["Id"],
									equals: result?.Id,
								},
								organizationIntegrationId: existingIntegration.id,
							},
						});

					if (existingResult) {
						// Update the existing result instead of creating a new one
						await db.organizationIntegrationResults.update({
							where: { id: existingResult.id },
							data: {
								status: result?.Compliance?.Status || "unknown",
								label: result?.Severity?.Label || "INFO",
								resultDetails: result || { error: "No result returned" },
							},
						});
						continue;
					}

					await db.organizationIntegrationResults.create({
						data: {
							title: result?.Title,
							status: result?.Compliance?.Status || "unknown",
							label: result?.Severity?.Label || "INFO",
							resultDetails: result || { error: "No result returned" },
							organizationIntegrationId: existingIntegration.id,
							organizationId: integration.organizationId,
							// assignedUserId is now optional, so we don't need to provide it
						},
					});
				}
			} catch (error) {
				console.error(
					`Error processing ${integration.integration_id} integration:`,
					error,
				);
			}
		}

		console.log("Refreshing tests");

		return { success: true };
	});
