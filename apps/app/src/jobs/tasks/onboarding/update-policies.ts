import { openai } from "@ai-sdk/openai";
import { db } from "@comp/db";
import { Prisma } from "@comp/db/types";
import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { generateObject, NoObjectGeneratedError } from "ai";
import { JSONContent } from "novel";
import { z } from "zod";
import { generatePrompt } from "../../lib/prompts";

if (!process.env.OPENAI_API_KEY) {
	throw new Error("OPENAI_API_KEY is not set");
}

export const updatePolicies = schemaTask({
	id: "update-policies",
	schema: z.object({
		organizationId: z.string(),
		policyId: z.string(),
		risks: z.any(),
		contextHub: z.string(),
	}),
	maxDuration: 1000 * 60 * 10,
	run: async ({ organizationId, policyId, risks, contextHub }) => {
		try {
			logger.info(
				`Running populate policies with company details for ${organizationId}`,
			);

			const organization = await db.organization.findUnique({
				where: {
					id: organizationId,
				},
			});

			const policy = await db.policy.findUnique({
				where: {
					id: policyId,
					organizationId,
				},
			});

			if (!policy) {
				logger.error(`Policy not found for ${policyId}`);
				return;
			}

			try {
				const { object } = await generateObject({
					model: openai("gpt-4.5-preview"),
					schemaName: "A policy document",
					schemaDescription: "A policy document formatted for TipTap",
					mode: "json",
					schema: z.object({
						content: z.array(
							z.object({
								type: z.string(),
								attrs: z.record(z.any()).optional(),
								content: z.array(z.any()).optional(),
								text: z.string().optional(),
								marks: z
									.array(
										z.object({
											type: z.string(),
											attrs: z.record(z.any()).optional(),
										}),
									)
									.optional(),
							}),
						),
					}),
					system: "You are an expert at writing tiptap formatted JSON.",
					prompt: generatePrompt({
						existingPolicyContent: policy?.content as
							| JSONContent
							| JSONContent[],
						contextHub,
						risks,
						policy,
						companyName: organization?.name ?? "Company",
						companyWebsite:
							organization?.website ?? "https://company.com",
					}),
				});

				if (!object) {
					logger.error(`Failed generating policy for ${policyId}`);
					return;
				}

				try {
					await db.policy.update({
						where: {
							id: policyId,
						},
						data: {
							content: object.content,
						},
					});

					return {
						policyId,
						contextHub,
						risks,
						policy,
						updatedContent: object.content,
					};
				} catch (dbError) {
					logger.error(
						`Failed to update policy in database: ${dbError}`,
					);
					throw dbError;
				}
			} catch (aiError) {
				logger.error(`Error generating AI content: ${aiError}`);

				if (NoObjectGeneratedError.isInstance(aiError)) {
					logger.error(
						`NoObjectGeneratedError: ${JSON.stringify({
							cause: aiError.cause,
							text: aiError.text,
							response: aiError.response,
							usage: aiError.usage,
						})}`,
					);
				}
				throw aiError;
			}
		} catch (error) {
			logger.error(`Unexpected error in populatePolicyWithAI: ${error}`);
			throw error;
		}
	},
});
