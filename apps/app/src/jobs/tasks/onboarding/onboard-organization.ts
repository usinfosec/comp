import { fleet } from "@/lib/fleet";
import { openai } from "@ai-sdk/openai";
import { PutObjectCommand } from "@aws-sdk/client-s3";
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
import {
  createReadStream,
  mkdirSync,
  mkdtempSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import z from "zod";
import { BUCKET_NAME, s3Client } from "../../../app/s3";
import type { researchVendor } from "../scrape/research";
import { updatePolicies } from "./update-policies";

export const onboardOrganization = task({
  id: "onboard-organization",
  cleanup: async ({ organizationId }: { organizationId: string }, ctx) => {
    // Set triggerJobId to null to signal that the job is complete or failed.
    await db.onboarding.update({
      where: {
        organizationId,
      },
      data: { triggerJobId: null },
    });

    try {
      logger.info(
        `Revalidating path ${process.env.BETTER_AUTH_URL}/${organizationId}`
      );
      const revalidateResponse = await axios.post(
        `${process.env.BETTER_AUTH_URL}/api/revalidate/path`,
        {
          path: `${process.env.BETTER_AUTH_URL}/${organizationId}`,
          secret: process.env.REVALIDATION_SECRET,
          type: "layout",
        }
      );

      if (!revalidateResponse.data?.revalidated) {
        logger.error(
          `Failed to revalidate path: ${revalidateResponse.statusText}`
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
    const organization = await db.organization.findUnique({
      where: {
        id: organizationId,
      },
    });

    if (!organization) {
      logger.error(`Organization ${organizationId} not found`);
      return;
    }

    // Create a manual label that we can assign to hosts.
    const response = await fleet.post("/labels", {
      name: organization.id,
      query: `SELECT 1 FROM file WHERE path = '/Users/Shared/.fleet/${organizationId}' LIMIT 1;`,
    });

    const enrollSecret = organization.fleetDmSecret;

    const secretsResponse = await fleet.get("/spec/enroll_secret");
    const existingSecrets = secretsResponse.data.spec.secrets;

    await fleet.post("/spec/enroll_secret", {
      spec: {
        secrets: [
          ...existingSecrets,
          {
            secret: enrollSecret,
            name: organization.id,
          },
        ],
      },
    });

    if (!response.data) {
      logger.error(`Failed to create label for organization ${organizationId}`);
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
    const fleetUrl = process.env.FLEET_URL;

    if (!enrollSecret) {
      logger.error(
        "FLEET_ENROLL_SECRET is not set. Cannot create osquery agent."
      );
      return;
    }

    if (!BUCKET_NAME) {
      logger.error(
        "AWS_BUCKET_NAME is not configured (via apps/app/src/app/s3.ts). Cannot upload osquery agent."
      );
      return;
    }

    try {
      const workDir = mkdtempSync(
        path.join(tmpdir(), `pkg-${organizationId}-`)
      );

      logger.info(`Building .pkg in ${workDir}`);

      const commandMac = `fleetctl package \
			  --type=pkg \
			  --fleet-url ${fleetUrl} \
			  --enable-scripts \
			  --fleet-desktop \
			  --verbose \
			  --enroll-secret "${enrollSecret}"`;

      logger.info(`Executing; command: ${commandMac}`);

      await execAsync(commandMac, {
        cwd: workDir,
      });

      const pkgPath = path.join(workDir, "fleet-osquery.pkg");
      const installScriptContent = `#!/bin/bash
# Create org marker for Fleet policies/labels
set -euo pipefail

ORG_ID="${organizationId}"
ORG_DIR="/Users/Shared/.fleet"

mkdir -p "$ORG_DIR"
echo "$ORG_ID" > "$ORG_DIR/${organizationId}"
chmod 755 "$ORG_DIR"
chmod 644 "$ORG_DIR/${organizationId}"

echo "Org marker written to $ORG_DIR/${organizationId}"
exit 0`;

      const scriptPath = path.join(workDir, "run_me_first.command");
      writeFileSync(scriptPath, installScriptContent, { mode: 0o755 });

      logger.info(`Created run_me_first.command in ${scriptPath}`);

      // Zip both files before uploading
      const zipName = "compai-device-agent.zip";
      const zipPath = path.join(workDir, zipName);
      const zipCommand = `zip -j ${zipPath} ${pkgPath} ${scriptPath}`;
      logger.info(`Zipping files with: ${zipCommand}`);
      await execAsync(zipCommand);

      const s3KeyZip = `${organizationId}/macos/${zipName}`;

      // Upload the zip to S3
      const putObjectCommandZip = new PutObjectCommand({
        Bucket: "compai-fleet-packages",
        Key: s3KeyZip,
        Body: createReadStream(zipPath),
        ContentType: "application/zip",
      });

      logger.info(`Uploading onboarding bundle to S3: ${s3KeyZip}`);
      await s3Client.send(putObjectCommandZip);

      const s3Region = await s3Client.config.region();
      const s3ObjectUrlZip = `https://compai-fleet-packages.s3.${s3Region}.amazonaws.com/${s3KeyZip}`;

      logger.info("S3 Upload successful.", {
        fileUrlZip: s3ObjectUrlZip,
      });

      await db.organization.update({
        where: { id: organizationId },
        data: { osqueryAgentDownloadUrl: s3ObjectUrlZip },
      });
      logger.info(`Stored S3 bundle URL for organization ${organizationId}`);
    } catch (error) {
      logger.error("Error in fleetctl packaging or S3 upload process", {
        error,
      });
    }
  },
  run: async (payload: { organizationId: string }) => {
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
              Object.values(VendorCategory) as [string, ...string[]]
            ),
            inherent_probability: z.enum(
              Object.values(Likelihood) as [string, ...string[]]
            ),
            inherent_impact: z.enum(
              Object.values(Impact) as [string, ...string[]]
            ),
            residual_probability: z.enum(
              Object.values(Likelihood) as [string, ...string[]]
            ),
            residual_impact: z.enum(
              Object.values(Impact) as [string, ...string[]]
            ),
          })
        ),
      }),
      system:
        "Extract vendor names from the following questions and answers. Return their name (grammar-correct), website, description, category, inherent probability, inherent impact, residual probability, and residual impact.",
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
          inherentProbability: vendor.inherent_probability as Likelihood,
          inherentImpact: vendor.inherent_impact as Impact,
          residualProbability: vendor.residual_probability as Likelihood,
          residualImpact: vendor.residual_impact as Impact,
          organizationId: payload.organizationId,
        },
      });

      const handle = await tasks.trigger<typeof researchVendor>(
        "research-vendor",
        {
          website: createdVendor.website ?? "",
        }
      );

      logger.info(
        `Created vendor: ${createdVendor.id} (${createdVendor.name}) with handle ${handle.id}`
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
              Object.values(RiskTreatmentType) as [string, ...string[]]
            ),
            risk_treatment_strategy_description: z.string(),
            risk_residual_probability: z.enum(
              Object.values(Likelihood) as [string, ...string[]]
            ),
            risk_residual_impact: z.enum(
              Object.values(Impact) as [string, ...string[]]
            ),
            category: z.enum(
              Object.values(RiskCategory) as [string, ...string[]]
            ),
            department: z.enum(
              Object.values(Departments) as [string, ...string[]]
            ),
          })
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
          treatmentStrategy: risk.risk_treatment_strategy as RiskTreatmentType,
          treatmentStrategyDescription:
            risk.risk_treatment_strategy_description,
          organizationId: payload.organizationId,
        },
      });

      logger.info(`Created risk: ${createdRisk.id} (${createdRisk.title})`);
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
        }))
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
