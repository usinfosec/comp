"use server";

import { authActionClient } from "@/actions/safe-action";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { db } from "@comp/db";
import { Attachment, AttachmentEntityType } from "@comp/db/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// --- S3 Client Configuration ---
if (
	!process.env.AWS_ACCESS_KEY_ID ||
	!process.env.AWS_SECRET_ACCESS_KEY ||
	!process.env.AWS_BUCKET_NAME ||
	!process.env.AWS_REGION
) {
	console.error(
		"AWS credentials or configuration missing for deleteTaskAttachment",
	);
}

const s3Client = new S3Client({
	region: process.env.AWS_REGION!,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	},
});
// --- End S3 Client Configuration ---

// --- Input Schema ---
const schema = z.object({
	attachmentId: z.string(),
});
// --- End Input Schema ---

// --- Helper to extract S3 key ---
function extractS3KeyFromUrl(url: string): string {
	const fullUrlMatch = url.match(/amazonaws\.com\/(.+)$/);
	if (fullUrlMatch?.[1]) {
		return decodeURIComponent(fullUrlMatch[1]);
	}
	if (!url.includes("amazonaws.com") && url.split("/").length > 1) {
		return url;
	}
	console.error("Invalid S3 URL format for deletion:", url);
	throw new Error("Invalid S3 URL format");
}
// --- End Helper ---

export const deleteTaskAttachment = authActionClient
	.schema(schema)
	.metadata({
		name: "deleteTaskAttachment",
		track: {
			event: "delete-task-attachment",
			channel: "server",
		},
	})
	.action(async ({ parsedInput, ctx }) => {
		const { session } = ctx;
		const { attachmentId } = parsedInput;
		const organizationId = session.activeOrganizationId;

		if (!organizationId) {
			return { success: false, error: "Not authorized" } as const;
		}

		let attachmentToDelete: Attachment | null = null;
		try {
			// 1. Find the attachment record and verify ownership/type
			attachmentToDelete = await db.attachment.findUnique({
				where: {
					id: attachmentId,
					organizationId: organizationId,
					entityType: AttachmentEntityType.task,
				},
			});

			if (!attachmentToDelete) {
				return {
					success: false,
					error: "Attachment not found or access denied",
				} as const;
			}

			// 2. Attempt to delete from S3
			let key: string;
			try {
				key = extractS3KeyFromUrl(attachmentToDelete.url);
				const deleteCommand = new DeleteObjectCommand({
					Bucket: process.env.AWS_BUCKET_NAME!,
					Key: key,
				});
				await s3Client.send(deleteCommand);
			} catch (s3Error: any) {
				const errorMessage =
					s3Error instanceof Error
						? s3Error.message
						: String(s3Error);
				console.error(
					"S3 Delete Error for attachment:",
					attachmentId,
					errorMessage,
				);
				// Decide if failure to delete from S3 should prevent DB deletion
				// For now, we'll proceed but log the error.
				// return { success: false, error: "Failed to delete file from storage" } as const;
			}

			// 3. Delete from Database
			await db.attachment.delete({
				where: {
					id: attachmentId,
					// Including orgId again for safety, though findUnique already checked
					organizationId: organizationId,
				},
			});

			// Revalidate the task path if needed, depends on how attachments are loaded
			revalidatePath(
				`/${organizationId}/tasks/${attachmentToDelete.entityId}`,
			);

			return {
				success: true,
				data: { deletedAttachmentId: attachmentId },
			};
		} catch (error: any) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			console.error(
				"Error deleting attachment:",
				attachmentId,
				errorMessage,
			);
			return {
				success: false,
				error: "Failed to delete attachment.",
			} as const;
		}
	});
