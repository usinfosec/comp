import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { ArtifactType, db } from "@bubba/db";
import { schemaTask } from "@trigger.dev/sdk/v3";
import { logger } from "@trigger.dev/sdk/v3";
import { z } from "zod";

export const createDefaultPoliciesTask = schemaTask({
  id: "create-default-policies",
  schema: z.object({
    organizationId: z.string(),
    organizationName: z.string(),
    ownerId: z.string(),
  }),
  run: async (payload) => {
    const { organizationId, organizationName, ownerId } = payload;
    const seedPoliciesPath = path.join(process.cwd(), "src/jobs/seed/policies");

    try {
      const policyFiles = await readdir(seedPoliciesPath);

      for (const fileName of policyFiles) {
        const filePath = path.join(seedPoliciesPath, fileName);
        const fileContent = await readFile(filePath, "utf-8");
        const policyData = JSON.parse(fileContent);

        // Replace organization and date placeholders in the JSON content
        const currentDate = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        const processedContent = JSON.stringify(policyData, null, 2)
          .replace(/\{\{organization\}\}/g, organizationName)
          .replace(/\{\{date\}\}/g, currentDate);

        // Extract the policy name from the first heading in the content
        const policyName =
          policyData.content.find(
            (node: any) => node.type === "heading" && node.attrs?.level === 1,
          )?.content?.[0]?.text || fileName.replace(".json", "");

        // Create the artifact
        const artifact = await db.artifact.create({
          data: {
            name: policyName,
            content: processedContent,
            organizationId,
            type: ArtifactType.policy,
            published: false,
            needsReview: true,
            version: 1,
            ownerId,
          },
        });

        // If the policy has controls specified in its metadata, create the relationships
        const controls = policyData.metadata?.controls;
        if (controls && Array.isArray(controls)) {
          // Get all the controls mentioned in the policy
          const dbControls = await db.control.findMany({
            where: {
              code: {
                in: controls,
              },
            },
          });

          // For each control, get or create the organization control and link it to the artifact
          for (const control of dbControls) {
            // Get or create the organization control
            const orgControl = await db.organizationControl.upsert({
              where: {
                id: `${organizationId}-${control.id}`,
              },
              create: {
                id: `${organizationId}-${control.id}`,
                organizationId,
                controlId: control.id,
              },
              update: {},
            });

            // Create the control-artifact relationship
            await db.controlArtifact.create({
              data: {
                organizationControlId: orgControl.id,
                artifactId: artifact.id,
              },
            });
          }
        }

        logger.info(`Created policy: ${policyName}`);
      }

      return {
        success: true,
        message: `Successfully copied and customized ${policyFiles.length} policies for organization ${organizationId}`,
      };
    } catch (error) {
      logger.error("Error creating default policies:", { error });
      throw error;
    }
  },
});

export default createDefaultPoliciesTask;
