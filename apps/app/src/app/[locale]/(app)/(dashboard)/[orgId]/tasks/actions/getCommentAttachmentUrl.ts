"use server";

import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { db } from "@comp/db";
import { AttachmentEntityType, CommentEntityType } from "@comp/db/types";
import { z } from "zod";
import { s3Client, BUCKET_NAME, extractS3KeyFromUrl } from "@/app/s3";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";

const schema = z.object({
	attachmentId: z.string(),
});

export const getCommentAttachmentUrl = async (
	input: z.infer<typeof schema>,
) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	const { attachmentId } = input;
	const organizationId = session?.session?.activeOrganizationId;

	if (!organizationId) {
		return {
			success: false,
			error: "Not authorized - no organization found",
		} as const;
	}

	try {
		// 1. Find the attachment and verify ownership & TYPE
		const attachment = await db.attachment.findUnique({
			where: {
				id: attachmentId,
				organizationId: organizationId,
				// No include needed here anymore
			},
		});

		if (!attachment) {
			return {
				success: false,
				error: "Attachment not found or access denied (1)",
			} as const;
		}

		// 1b. Check if it's actually a comment attachment
		if (attachment.entityType !== AttachmentEntityType.comment) {
			console.error(
				"Attachment requested is not a comment attachment",
				attachmentId,
			);
			return {
				success: false,
				error: "Invalid attachment type requested",
			} as const;
		}

		// 2. Fetch the associated Comment
		const comment = await db.comment.findUnique({
			where: {
				id: attachment.entityId, // Use entityId from attachment
				organizationId: organizationId, // Ensure comment is in the same org
			},
			select: {
				entityId: true, // Parent (Task) ID
				entityType: true, // Parent (Task) Type
			},
		});

		if (!comment) {
			console.error(
				"Comment associated with attachment not found",
				attachmentId,
				attachment.entityId,
			);
			return {
				success: false,
				error: "Attachment link error (Comment not found)",
			} as const;
		}

		// 3. Verify parent entity is a task
		if (comment.entityType !== CommentEntityType.task) {
			console.error(
				"Comment's parent entity is not a task",
				attachmentId,
				comment.entityType,
			);
			return {
				success: false,
				error: "Invalid attachment parent link",
			} as const;
		}

		// 4. Verify user has access to the parent Task
		const parentTask = await db.task.findFirst({
			where: {
				id: comment.entityId, // Use entityId from comment
				organizationId: organizationId,
			},
			select: { id: true },
		});
		if (!parentTask) {
			console.error(
				"Parent task not found or access denied",
				comment.entityId,
			);
			return {
				success: false,
				error: "Access denied to parent task",
			} as const;
		}

		// 5. Extract S3 key
		let key: string;
		try {
			key = extractS3KeyFromUrl(attachment.url);
		} catch (extractError) {
			console.error(
				"Error extracting S3 key for comment attachment:",
				attachmentId,
				extractError,
			);
			return {
				success: false,
				error: "Could not process attachment URL",
			} as const;
		}

		// 6. Generate Signed URL using shared client and bucket name
		try {
			const command = new GetObjectCommand({
				Bucket: BUCKET_NAME!,
				Key: key,
			});

			const signedUrl = await getSignedUrl(s3Client, command, {
				expiresIn: 3600,
			});

			if (!signedUrl) {
				console.error("getSignedUrl returned undefined for key:", key);
				return {
					success: false,
					error: "Failed to generate signed URL",
				} as const;
			}

			return { success: true, data: { signedUrl } };
		} catch (s3Error) {
			console.error("S3 getSignedUrl Error:", s3Error);
			return {
				success: false,
				error: "Could not generate access URL for the file",
			} as const;
		}
	} catch (dbError) {
		console.error("Database Error fetching comment attachment:", dbError);
		return {
			success: false,
			error: "Failed to retrieve attachment details",
		} as const;
	}
};
