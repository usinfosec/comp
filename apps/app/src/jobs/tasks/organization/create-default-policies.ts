import { ArtifactType, db } from "@bubba/db";
import type { JSONContent } from "@tiptap/react";
import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { parseStringPromise } from "xml2js";
import { z } from "zod";

const S3_BUCKET_URL = "https://compai-policies.s3.eu-central-1.amazonaws.com";

async function listPolicyFiles(): Promise<string[]> {
  try {
    const response = await fetch(`${S3_BUCKET_URL}`);
    const text = await response.text();

    const result = await parseStringPromise(text);

    const keys: string[] = [];
    const contents = result.ListBucketResult?.Contents || [];

    for (const content of contents) {
      const key = content.Key?.[0];
      if (key?.endsWith(".json")) {
        keys.push(key);
      }
    }

    return keys;
  } catch (error) {
    logger.error("Error listing policy files from S3:", { error });
    throw error;
  }
}

// Helper to fetch a single policy file
async function fetchPolicyFile(fileName: string) {
  const response = await fetch(`${S3_BUCKET_URL}/${fileName}`);
  return response.json();
}

export const createDefaultPoliciesTask = schemaTask({
  id: "create-default-policies",
  schema: z.object({
    organizationId: z.string(),
    organizationName: z.string(),
    ownerId: z.string(),
  }),
  run: async (payload) => {
    const { organizationId, organizationName, ownerId } = payload;

    try {
      const policyFiles = await listPolicyFiles();

      for (const fileName of policyFiles) {
        const policyData = (await fetchPolicyFile(fileName)) as {
          type: string;
          metadata: { controls: string[] };
          content: JSONContent[];
        };

        const currentDate = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        // Replace placeholders in content while preserving node structure
        const replaceInContent = (node: any): any => {
          if (!node) return node;

          if (typeof node === "string") {
            return node
              .replace(/\{\{organization\}\}/g, organizationName)
              .replace(/\{\{date\}\}/g, currentDate);
          }

          if (Array.isArray(node)) {
            return node.map((item) => replaceInContent(item));
          }

          if (typeof node === "object") {
            const result: any = {};
            for (const [key, value] of Object.entries(node)) {
              if (key === "type" || key === "attrs") {
                result[key] = value;
              } else {
                result[key] = replaceInContent(value);
              }
            }
            return result;
          }

          return node;
        };

        const processedPolicy = {
          type: policyData.type,
          metadata: policyData.metadata,
          content: replaceInContent(policyData.content),
        };

        const policyName =
          processedPolicy.content?.find(
            (node: any) => node.type === "heading" && node.attrs?.level === 1,
          )?.content?.[0]?.text || fileName.replace(".json", "");

        const artifact = await db.artifact.create({
          data: {
            name: policyName,
            content: processedPolicy,
            organizationId,
            type: ArtifactType.policy,
            published: false,
            needsReview: true,
            version: 1,
            ownerId,
          },
        });

        const controls = processedPolicy.metadata?.controls;
        if (controls && Array.isArray(controls)) {
          const dbControls = await db.control.findMany({
            where: {
              code: {
                in: controls,
              },
            },
          });

          for (const control of dbControls) {
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
