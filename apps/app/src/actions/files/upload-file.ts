"use server";

import { authActionClient } from "@/actions/safe-action";
import { z } from "zod";
import { db } from "@bubba/db";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { UPLOAD_TYPE } from "@/actions/types";

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error("AWS credentials are not set");
}
type UploadType = (typeof UPLOAD_TYPE)[keyof typeof UPLOAD_TYPE];

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadFile = authActionClient
  .schema(
    z.discriminatedUnion("uploadType", [
      z.object({
        uploadType: z.literal(UPLOAD_TYPE.evidence),
        evidenceId: z.string(),
        fileName: z.string(),
        fileType: z.string(),
      }),
      z.object({
        uploadType: z.literal(UPLOAD_TYPE.riskTask),
        taskId: z.string(),
        fileName: z.string(),
        fileType: z.string(),
      }),
      z.object({
        uploadType: z.literal(UPLOAD_TYPE.vendorTask),
        taskId: z.string(),
        fileName: z.string(),
        fileType: z.string(),
      }),
    ])
  )
  .metadata({
    name: "uploadFile",
    track: {
      event: "upload-file",
      channel: "server",
    },
  })
  .action(async ({ ctx, parsedInput }) => {
    const { user, session } = ctx;
    const { uploadType, fileName, fileType } = parsedInput;

    if (!session.activeOrganizationId) {
      return {
        success: false,
        error: "Not authorized - no organization found",
      } as const;
    }

    try {
      let key: string;

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
          } as const;
        }

        const timestamp = Date.now();
        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
        key = `${session.activeOrganizationId}/${evidenceId}/${timestamp}-${sanitizedFileName}`;

        const command = new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: key,
          ContentType: fileType,
        });

        const uploadUrl = await getSignedUrl(s3Client, command, {
          expiresIn: 3600, // URL expires in 1 hour
        });

        const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        await db.evidence.update({
          where: { id: evidenceId },
          data: {
            fileUrls: {
              push: fileUrl,
            },
          },
        });

        return {
          success: true,
          data: {
            uploadUrl,
            fileUrl,
          },
        } as const;
      }

      if (uploadType === UPLOAD_TYPE.riskTask) {
        const taskId = parsedInput.taskId;
        const task = await db.riskMitigationTask.findFirst({
          where: {
            id: taskId,
            organizationId: session.activeOrganizationId,
          },
        });

        if (!task) {
          return {
            success: false,
            error: "Task not found",
          } as const;
        }

        const timestamp = Date.now();
        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
        key = `${session.activeOrganizationId}/tasks/${taskId}/${timestamp}-${sanitizedFileName}`;

        const command = new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: key,
          ContentType: fileType,
        });

        const uploadUrl = await getSignedUrl(s3Client, command, {
          expiresIn: 3600, // URL expires in 1 hour
        });

        const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        await db.taskAttachment.create({
          data: {
            riskMitigationTaskId: taskId,
            name: sanitizedFileName,
            fileUrl,
            fileKey: key,
            organizationId: session.activeOrganizationId,
            ownerId: user.id,
          },
        });

        return {
          success: true,
          data: {
            uploadUrl,
            fileUrl,
          },
        } as const;
      }

      if (uploadType === UPLOAD_TYPE.vendorTask) {
        const taskId = parsedInput.taskId;
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
          } as const;
        }

        const timestamp = Date.now();
        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
        key = `${session.activeOrganizationId}/vendor-tasks/${taskId}/${timestamp}-${sanitizedFileName}`;

        const command = new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: key,
          ContentType: fileType,
        });

        const uploadUrl = await getSignedUrl(s3Client, command, {
          expiresIn: 3600, // URL expires in 1 hour
        });

        const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        await db.vendorTaskAttachment.create({
          data: {
            taskId: taskId,
            vendorId: task.vendorId,
            name: sanitizedFileName,
            fileUrl,
            fileKey: key,
            organizationId: session.activeOrganizationId,
            ownerId: user.id,
          },
        });

        return {
          success: true,
          data: {
            uploadUrl,
            fileUrl,
          },
        } as const;
      }

      return {
        success: false,
        error: "Invalid upload type",
      } as const;
    } catch (error) {
      return {
        success: false,
        error: "Failed to upload file",
      } as const;
    }
  });
