import { fleet } from "@/lib/fleet";
import { openai } from "@ai-sdk/openai";
import { db } from "@comp/db";
import {
	Departments,
	Impact,
	Likelihood,
	RiskCategory,
	RiskTreatmentType,
	VendorCategory,
} from "@comp/db/types";
import { logger, task, tasks } from "@trigger.dev/sdk/v3";
import { generateObject } from "ai";
import axios from "axios";
import { exec as callbackExec } from "node:child_process";
import { promisify } from "node:util";
import * as fs from "node:fs/promises";
import { s3Client, BUCKET_NAME } from "../../../app/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import z from "zod";
import { researchVendor } from "../scrape/research";
import { updatePolicies } from "./update-policies";

export const onboardOrganization = task({
	id: "onboard-organization",
	cleanup: async ({ organizationId }: { organizationId: string }) => {
		// Set triggerJobId to null to signal that the job is complete or failed.
		await db.onboarding.update({
			where: {
				organizationId,
			},
			data: { triggerJobId: null },
		});

		try {
			logger.info(
				`Revalidating path ${process.env.BETTER_AUTH_URL}/${organizationId}`,
			);
			const revalidateResponse = await axios.post(
				`${process.env.BETTER_AUTH_URL}/api/revalidate/path`,
				{
					path: `${process.env.BETTER_AUTH_URL}/${organizationId}`,
					secret: process.env.REVALIDATION_SECRET,
					type: "layout",
				},
			);

			if (!revalidateResponse.data?.revalidated) {
				logger.error(
					`Failed to revalidate path: ${revalidateResponse.statusText}`,
				);
				logger.error(revalidateResponse.data);
			} else {
				logger.info("Revalidated path successfully");
			}
		} catch (err) {
			logger.error("Error revalidating path", { err });
		}
	},
	onSuccess: async ({ organizationId }) => {
		// Create FleetDm label and store it.
		const organization = await db.organization.findUnique({
			where: {
				id: organizationId,
			},
		});

		if (!organization) {
			logger.error(`Organization ${organizationId} not found`);
			return;
		}

		// Create FleetDm label so we can query devices later.
		const response = await fleet.post("/labels", {
			name: organization.id,
			query: `SELECT 1 FROM file WHERE (path = '/etc/fleet_org_id' OR path = 'C:\\ProgramData\\fleet_org_id') AND content = '${organization.id}';`,
		});

		if (!response.data) {
			logger.error(
				`Failed to create label for organization ${organizationId}`,
			);
			return;
		}

		// Store label ID in organization.
		await db.organization.update({
			where: {
				id: organizationId,
			},
			data: {
				fleetDmLabelId: response.data.label.id,
			},
		});

		// Create osquery agent file.
		const execAsync = promisify(callbackExec);
		const enrollSecret = organization.fleetDmSecret;
		const fleetUrl = process.env.FLEET_URL;
		// Ensure this script is available in deployment environment or create it dynamically.
		// For now, assuming it's in the same directory or a known path.
		const scriptName = "write-org-id.sh";
		const scriptContentMac = `#!/bin/bash\necho "${organizationId}" > /etc/fleet_org_id`; // Example content, adjust as needed
		const scriptContentWindows = `echo "${organizationId}" > C:\ProgramData\fleet_org_id`;
		const localScriptPathMac = `/tmp/${scriptName}`;
		const localScriptPathWindows = `/tmp/${scriptName}`;

		const generatedPackageName = `fleet-osquery-${organizationId}.pkg`;
		const localPackagePathMac = `/tmp/${generatedPackageName}`;
		const localPackagePathWindows = `/tmp/${generatedPackageName}`;
		// BUCKET_NAME is imported from ../../../app/s3
		const s3Key = `fleet_packages/${organizationId}/${generatedPackageName}`;

		if (!enrollSecret) {
			logger.error(
				"FLEET_ENROLL_SECRET is not set. Cannot create osquery agent.",
			);
			return;
		}
		if (!BUCKET_NAME) {
			// s3.ts should throw if BUCKET_NAME is missing in dev, or log error in prod
			logger.error(
				"AWS_BUCKET_NAME is not configured (via apps/app/src/app/s3.ts). Cannot upload osquery agent.",
			);
			return;
		}

		try {
			// Create the write-org-id.sh script dynamically in /tmp
			await fs.writeFile(localScriptPathMac, scriptContentMac, {
				mode: 0o755,
			});
			await fs.writeFile(localScriptPathWindows, scriptContentWindows, {
				mode: 0o755,
			});
			logger.info(`Created script at ${localScriptPathMac}`);
			logger.info(`Created script at ${localScriptPathWindows}`);

			// 1. Construct and execute the fleetctl command
			// The --output flag directs fleetctl to write the package to the specified path.
			const commandMac = `fleetctl package \
			  --type=pkg \
			  --fleet-url ${fleetUrl} \
			  --enroll-secret "${enrollSecret}" \
			  --enable-scripts \
			  --script ${localScriptPathMac} \
			  --org-id ${organizationId} \
			  --output ${localPackagePathMac}`;

			const commandWindows = `fleetctl package \
			  --type=pkg \
			  --fleet-url ${fleetUrl} \
			  --enroll-secret "${enrollSecret}" \
			  --enable-scripts \
			  --script ${localScriptPathWindows} \
			  --org-id ${organizationId} \
			  --output ${localPackagePathWindows}`;

			logger.info(`Executing command: ${commandMac}`);
			logger.info(`Executing command: ${commandWindows}`);
			// Run fleetctl from /tmp or ensure it has write access to its CWD if --output is not used/supported for pkg type.
			// Using /tmp as CWD for safety, though --output should handle file placement.
			const { stdout, stderr } = await execAsync(commandMac, {
				cwd: "/tmp",
			});

			logger.info("fleetctl stdout", { stdout });
			if (stderr) {
				logger.warn("fleetctl stderr (this might be informational)", {
					stderr,
				});
			}
			logger.info(
				`Package should be generated at ${localPackagePathMac}`,
			);

			// 2. Read the generated file
			const fileContent = await fs.readFile(localPackagePathMac);
			logger.info(`Successfully read file: ${localPackagePathMac}`);

			// 3. Upload to S3 using the imported s3Client (AWS SDK v3)
			const putObjectCommand = new PutObjectCommand({
				Bucket: BUCKET_NAME, // Imported from ../../../app/s3
				Key: s3Key,
				Body: fileContent,
				ContentType: "application/octet-stream", // Or more specific, e.g., 'application/x-apple-diskimage'
			});

			logger.info(
				`Uploading ${localPackagePathMac} to S3 bucket ${BUCKET_NAME} with key ${s3Key}`,
			);
			await s3Client.send(putObjectCommand);

			// Construct the S3 object URL
			const s3Region = await s3Client.config.region(); // Get region from client config
			const s3ObjectUrl = `https://${BUCKET_NAME}.s3.${s3Region}.amazonaws.com/${s3Key}`;
			logger.info("S3 Upload successful.", { fileUrl: s3ObjectUrl });

			// Store the S3 URL in the organization record
			await db.organization.update({
				where: { id: organizationId },
				data: { osqueryAgentDownloadUrl: s3ObjectUrl },
			});
			logger.info(
				`Stored S3 package URL for organization ${organizationId}`,
			);
		} catch (error) {
			logger.error("Error in fleetctl packaging or S3 upload process", {
				error,
			});
			// Optionally, re-throw to fail the task or handle more gracefully
			// throw error;
		} finally {
			// 4. Clean up local files from /tmp
			try {
				await fs.unlink(localPackagePathMac);
				logger.info(`Cleaned up local package: ${localPackagePathMac}`);
			} catch (e) {
				logger.warn(
					`Failed to clean up local package ${localPackagePathMac}`,
					{ error: e },
				);
			}
			try {
				await fs.unlink(localScriptPathMac);
				logger.info(`Cleaned up local script: ${localScriptPathMac}`);
			} catch (e) {
				logger.warn(
					`Failed to clean up local script ${localScriptPathMac}`,
					{ error: e },
				);
			}
		}

		// Upload it to S3. // This comment is now effectively handled above
	},
	run: async (payload: {
		organizationId: string;
	}) => {
		logger.info(`Start onboarding organization ${payload.organizationId}`);

		const organization = await db.organization.findUnique({
			where: {
				id: payload.organizationId,
			},
		});

		if (!organization) {
			logger.error(`Organization ${payload.organizationId} not found`);
			return;
		}

		const contextHub = await db.context.findMany({
			where: {
				organizationId: payload.organizationId,
			},
		});

		const questionsAndAnswers = contextHub.map((context) => ({
			question: context.question,
			answer: context.answer,
		}));

		const extractVendors = await generateObject({
			model: openai("gpt-4.1-mini"),
			schema: z.object({
				vendors: z.array(
					z.object({
						vendor_name: z.string(),
						vendor_website: z.string(),
						vendor_description: z.string(),
						category: z.enum(
							Object.values(VendorCategory) as [
								string,
								...string[],
							],
						),
						inherent_probability: z.enum(
							Object.values(Likelihood) as [string, ...string[]],
						),
						inherent_impact: z.enum(
							Object.values(Impact) as [string, ...string[]],
						),
						residual_probability: z.enum(
							Object.values(Likelihood) as [string, ...string[]],
						),
						residual_impact: z.enum(
							Object.values(Impact) as [string, ...string[]],
						),
					}),
				),
			}),
			system: "Extract vendor names from the following questions and answers. Return their name (grammar-correct), website, description, category, inherent probability, inherent impact, residual probability, and residual impact.",
			prompt: questionsAndAnswers
				.map((q) => `${q.question}\n${q.answer}`)
				.join("\n"),
		});

		for (const vendor of extractVendors.object.vendors) {
			const existingVendor = await db.vendor.findMany({
				where: {
					organizationId: payload.organizationId,
					name: {
						contains: vendor.vendor_name,
					},
				},
			});

			if (existingVendor.length > 0) {
				logger.info(`Vendor ${vendor.vendor_name} already exists`);
				continue;
			}

			const createdVendor = await db.vendor.create({
				data: {
					name: vendor.vendor_name,
					website: vendor.vendor_website,
					description: vendor.vendor_description,
					category: vendor.category as VendorCategory,
					inherentProbability:
						vendor.inherent_probability as Likelihood,
					inherentImpact: vendor.inherent_impact as Impact,
					residualProbability:
						vendor.residual_probability as Likelihood,
					residualImpact: vendor.residual_impact as Impact,
					organizationId: payload.organizationId,
				},
			});

			const handle = await tasks.trigger<typeof researchVendor>(
				"research-vendor",
				{
					website: createdVendor.website ?? "",
				},
			);

			logger.info(
				`Created vendor: ${createdVendor.id} (${createdVendor.name}) with handle ${handle.id}`,
			);
		}

		const existingRisks = await db.risk.findMany({
			where: {
				organizationId: payload.organizationId,
			},
			select: {
				title: true,
				department: true,
			},
		});

		const extractRisks = await generateObject({
			model: openai("gpt-4.1-mini"),
			schema: z.object({
				risks: z.array(
					z.object({
						risk_name: z.string(),
						risk_description: z.string(),
						risk_treatment_strategy: z.enum(
							Object.values(RiskTreatmentType) as [
								string,
								...string[],
							],
						),
						risk_treatment_strategy_description: z.string(),
						risk_residual_probability: z.enum(
							Object.values(Likelihood) as [string, ...string[]],
						),
						risk_residual_impact: z.enum(
							Object.values(Impact) as [string, ...string[]],
						),
						category: z.enum(
							Object.values(RiskCategory) as [
								string,
								...string[],
							],
						),
						department: z.enum(
							Object.values(Departments) as [string, ...string[]],
						),
					}),
				),
			}),
			system: `Create a list of 8-12 risks that are relevant to the organization. Use action-oriented language, assume reviewers understand basic termilology - skip definitions.
            Your mandate is to propose risks that satisfy both ISO 27001:2022 clause 6.1 (risk management) and SOC 2 trust services criteria CC3 and CC4.
            Return the risk name, description, treatment strategy, treatment strategy description, residual probability, residual impact, category, and department.`,
			prompt: `
            The organization is ${organization.name}.

            Do not propose risks that are already in the database:
            ${existingRisks.map((r) => r.title).join("\n")}

            The questions and answers are:
            ${questionsAndAnswers
				.map((q) => `${q.question}\n${q.answer}`)
				.join("\n")}
            `,
		});

		for (const risk of extractRisks.object.risks) {
			const createdRisk = await db.risk.create({
				data: {
					title: risk.risk_name,
					description: risk.risk_description,
					category: risk.category as RiskCategory,
					department: risk.department as Departments | null,
					likelihood: risk.risk_residual_probability as Likelihood,
					impact: risk.risk_residual_impact as Impact,
					treatmentStrategy:
						risk.risk_treatment_strategy as RiskTreatmentType,
					treatmentStrategyDescription:
						risk.risk_treatment_strategy_description,
					organizationId: payload.organizationId,
				},
			});

			logger.info(
				`Created risk: ${createdRisk.id} (${createdRisk.title})`,
			);
		}

		const policies = await db.policy.findMany({
			where: {
				organizationId: payload.organizationId,
			},
		});

		if (policies.length > 0) {
			await updatePolicies.batchTriggerAndWait(
				policies.map((policy) => ({
					payload: {
						organizationId: payload.organizationId,
						policyId: policy.id,
						contextHub: contextHub
							.map((c) => `${c.question}\n${c.answer}`)
							.join("\n"),
					},
					queue: {
						name: "update-policies",
						concurrencyLimit: 5,
					},
					concurrencyKey: payload.organizationId,
				})),
			);
		}

		await db.onboarding.update({
			where: {
				organizationId: payload.organizationId,
			},
			data: { completed: true },
		});

		logger.info(`Created ${extractRisks.object.risks.length} risks`);
		logger.info(`Created ${extractVendors.object.vendors.length} vendors`);
	},
});
