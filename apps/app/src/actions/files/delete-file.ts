"use server";

import { authActionClient } from "@/actions/safe-action";
import { db } from "@bubba/db";
import { z } from "zod";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { UPLOAD_TYPE } from "@/actions/types";

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error("AWS credentials are not set");
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Extract S3 key from fileUrl
function extractKeyFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    // Remove the leading slash
    return pathname.startsWith("/") ? pathname.substring(1) : pathname;
  } catch (error) {
    console.error("Error extracting key from URL:", error);
    return null;
  }
}

type UploadType = (typeof UPLOAD_TYPE)[keyof typeof UPLOAD_TYPE];

const schema = z.discriminatedUnion("uploadType", [
  z.object({
    uploadType: z.literal(UPLOAD_TYPE.evidence),
    evidenceId: z.string(),
    fileUrl: z.string(),
  }),
  z.object({
    uploadType: z.literal(UPLOAD_TYPE.riskTask),
    taskId: z.string(),
    fileUrl: z.string(),
  }),
  z.object({
    uploadType: z.literal(UPLOAD_TYPE.vendorTask),
    taskId: z.string(),
    fileUrl: z.string(),
  }),
]);

interface SuccessResponse {
  success: true;
}

interface ErrorResponse {
  success: false;
  error: string;
}

type ActionResponse = SuccessResponse | ErrorResponse;

export const deleteFile = authActionClient
  .schema(schema)
  .metadata({
    name: "deleteFile",
    track: {
      event: "delete-file",
      channel: "server",
    },
  })
  .action(async ({ parsedInput, ctx }): Promise<ActionResponse> => {
    const { user, session } = ctx;
    const { uploadType, fileUrl } = parsedInput;

    if (!session.activeOrganizationId) {
      return {
        success: false,
        error: "Not authorized - no organization found",
      };
    }

    try {
      if (uploadType === UPLOAD_TYPE.evidence) {
        const evidenceId = parsedInput.evidenceId;

        const evidence = await db.evidence.findFirst({
          where: {
            id: evidenceId,
            organizationId: session.activeOrganizationId,
          },
        });

        if (!evidence) {
          return {
            success: false,
            error: "Evidence not found",
          };
        }

        await db.evidence.update({
          where: { id: evidenceId },
          data: {
            fileUrls: {
              set: evidence.fileUrls.filter((url) => url !== fileUrl),
            },
          },
        });

        return {
          success: true,
        };
      }

      if (uploadType === UPLOAD_TYPE.riskTask) {
        const taskId = parsedInput.taskId;

        const task = await db.riskMitigationTask.findFirst({
          where: {
            id: taskId,
            organizationId: session.activeOrganizationId,
            taskAttachment: {
              some: {
                fileUrl,
              },
            },
          },
        });

        if (!task) {
          return {
            success: false,
            error: "Task not found",
          };
        }

        await db.riskMitigationTask.update({
          where: { id: taskId },
          data: {
            taskAttachment: {
              deleteMany: {
                fileUrl,
              },
            },
          },
        });

        return {
          success: true,
        };
      }

      if (uploadType === UPLOAD_TYPE.vendorTask) {
        const taskId = parsedInput.taskId;
        const fileUrl = parsedInput.fileUrl;

        const fileUrlWithoutQuery = fileUrl.split("?")[0];

        const task = await db.vendorTask.findFirst({
          where: {
            id: taskId,
            organizationId: session.activeOrganizationId,
          },
        });

        if (!task) {
          return {
            success: false,
            error: "Vendor task not found",
          };
        }

        const attachment = await db.vendorTaskAttachment.findFirst({
          where: {
            taskId: taskId,
            fileUrl: fileUrlWithoutQuery,
            organizationId: session.activeOrganizationId,
          },
        });

        if (!attachment) {
          return {
            success: false,
            error: "Attachment not found",
          };
        }

        // Extract key from URL
        const key =
          attachment.fileKey || extractKeyFromUrl(fileUrlWithoutQuery);

        if (key) {
          try {
            await s3Client.send(
              new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME!,
                Key: key,
              })
            );
          } catch (error) {
            console.error("Error deleting from S3:", error);
          }
        }

        await db.vendorTaskAttachment.delete({
          where: {
            id: attachment.id,
          },
        });

        return {
          success: true,
        };
      }

      return {
        success: false,
        error: "Invalid upload type",
      };
    } catch (error) {
      console.error("Error deleting file:", error);
      return {
        success: false,
        error: "Failed to delete file",
      };
    }
  });
