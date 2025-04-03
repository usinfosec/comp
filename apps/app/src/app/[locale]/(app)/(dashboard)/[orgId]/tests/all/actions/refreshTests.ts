"use server";

import { authActionClient } from "@/actions/safe-action";
import { decrypt } from "@comp/app/src/lib/encryption";
import { db } from "@comp/db";
import type { DecryptFunction } from "@comp/integrations";
import { getIntegrationHandler } from "@comp/integrations";

export const refreshTestsAction = authActionClient
	.metadata({
		name: "refresh-tests",
		track: {
			event: "refresh-tests",
			channel: "server",
		},
	})
	.action(async ({ parsedInput, ctx }) => {
		const { session } = ctx;

		if (!session?.activeOrganizationId || !session.activeOrganizationId) {
			throw new Error("Invalid user input");
		}

		const integrationsTable = await db.integration.findMany({
			where: {
				organizationId: session.activeOrganizationId,
			},
		});

		for (const integration of integrationsTable) {
			// Get the integration handler with proper typing
			const integrationHandler = getIntegrationHandler<any>(
				integration.integrationId,
			);

			// Skip if no handler is found for this integration type
			if (!integrationHandler) {
				console.log(
					`No handler found for integration type: ${integration.integrationId}`,
				);
				continue;
			}

			try {
				// Process credentials using the integration handler
				const userSettings = integration.userSettings as unknown as Record<
					string,
					unknown
				>;

				// Pass the decrypt function to the processCredentials method
				const typedCredentials = await integrationHandler.processCredentials(
					userSettings,
					// Cast decrypt to match the expected DecryptFunction type
					decrypt as unknown as DecryptFunction,
				);

				// Fetch results using properly typed credentials
				const results = await integrationHandler.fetch(typedCredentials);

				// Store the integration results using model name that matches the database
				for (const result of results) {
					// First verify the integration exists
					const existingIntegration = await db.integration.findUnique({
						where: { id: integration.id },
					});

					if (!existingIntegration) {
						console.log(`Integration with ID ${integration.id} not found`);
						continue;
					}

					// Check if a result with the same title already exists
					const existingResult = await db.integrationResult.findFirst({
						where: {
							title: result.title,
							integrationId: existingIntegration.id,
						},
					});

					if (existingResult) {
						// Update the existing result instead of creating a new one
						await db.integrationResult.update({
							where: { id: existingResult.id },
							data: {
								title: result.title,
								description: result.description,
								remediation: result.remediation,
								status: result.status,
								severity: result.severity,
								resultDetails: result.resultDetails,
							},
						});
						continue;
					}

					await db.integrationResult.create({
						data: {
							title: result.title,
							description: result.description,
							remediation: result.remediation,
							status: result.status,
							severity: result.severity,
							resultDetails: result.resultDetails,
							integrationId: existingIntegration.id,
							organizationId: integration.organizationId,
						},
					});
				}
			} catch (error) {
				console.error(
					`Error processing ${integration.integrationId} integration:`,
					error,
				);
			}
		}

		console.log("Refreshing tests");

		return { success: true };
	});
