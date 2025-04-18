"use server";

import { authActionClient } from "@/actions/safe-action";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { db } from "@comp/db";
import { AttachmentEntityType, Comment } from "@comp/db/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// --- S3 Client (Should be shared or refactored) ---
if (
	!process.env.AWS_REGION ||
	!process.env.AWS_ACCESS_KEY_ID ||
	!process.env.AWS_SECRET_ACCESS_KEY ||
	!process.env.AWS_BUCKET_NAME
) {
	console.error("AWS S3 environment variables missing for updateComment");
}
const s3Client = new S3Client({
	region: process.env.AWS_REGION!,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	},
});
// --- End S3 Client ---

// --- Helper to extract S3 key (Should be shared) ---
function extractS3KeyFromUrl(url: string): string {
	const fullUrlMatch = url.match(/amazonaws\.com\/(.+)$/);
	if (fullUrlMatch?.[1]) {
		return decodeURIComponent(fullUrlMatch[1]);
	}
	if (!url.includes("amazonaws.com") && url.split("/").length > 1) {
		return url;
	}
	console.error("Invalid S3 URL format for update/delete:", url);
	throw new Error("Invalid S3 URL format");
}
// --- End Helper ---

const schema = z
	.object({
		commentId: z.string(),
		content: z.string().optional(), // Optional: content might not change
		attachmentIdsToAdd: z.array(z.string()).optional(),
		attachmentIdsToRemove: z.array(z.string()).optional(),
	})
	.refine(
		(data) =>
			data.content !== undefined ||
			data.attachmentIdsToAdd?.length ||
			data.attachmentIdsToRemove?.length,
		{ message: "No changes provided for update." },
	);

export const updateComment = authActionClient
	.schema(schema)
	.metadata({
		name: "updateComment",
		track: { event: "update-comment", channel: "server" },
	})
	.action(async ({ ctx, parsedInput }) => {
		const { session, user } = ctx;
		const {
			commentId,
			content,
			attachmentIdsToAdd,
			attachmentIdsToRemove,
		} = parsedInput;
		const organizationId = session.activeOrganizationId;
		const userId = user.id; // For permission check

		if (!organizationId) {
			return {
				success: false,
				error: "Not authorized: No active organization",
			};
		}

		try {
			// 1. Fetch comment, include ID for return value consistency
			const comment = await db.comment.findUnique({
				where: { id: commentId, organizationId },
				select: { id: true, authorId: true, entityId: true }, // Added id
			});

			if (!comment) {
				return {
					success: false,
					error: "Comment not found or access denied",
				};
			}

			// 2. Authorization Check (Placeholder - implement proper logic)
			const currentMember = await db.member.findFirst({
				where: { userId, organizationId },
				select: { id: true },
			});
			if (!currentMember || comment.authorId !== currentMember.id) {
				// TODO: Add role-based check for admins
				return {
					success: false,
					error: "Not authorized to update this comment",
				};
			}

			// --- Start Transaction ---
			const updatedCommentResult = await db.$transaction(async (tx) => {
				let updatedCommentData: Comment | null = null;
				if (content !== undefined) {
					// update returns the full comment object including id
					updatedCommentData = await tx.comment.update({
						where: { id: commentId },
						data: { content },
					});
				}

				// 4. Handle Attachments to Remove
				if (attachmentIdsToRemove && attachmentIdsToRemove.length > 0) {
					const attachments = await tx.attachment.findMany({
						where: {
							id: { in: attachmentIdsToRemove },
							organizationId,
							entityId: commentId,
						},
						select: { id: true, url: true },
					});

					// Delete from S3 (best effort)
					for (const attachmentRecord of attachments) {
						// Ensure type for internal usage
						const att: { id: string; url: string } =
							attachmentRecord;
						try {
							const key = extractS3KeyFromUrl(att.url);
							await s3Client.send(
								new DeleteObjectCommand({
									Bucket: process.env.AWS_BUCKET_NAME!,
									Key: key,
								}),
							);
						} catch (s3Error: unknown) {
							console.error(
								`Failed to delete attachment ${att.id} from S3:`,
								s3Error,
							);
							// Continue even if S3 delete fails
						}
					}

					// Delete from DB
					await tx.attachment.deleteMany({
						where: {
							id: { in: attachments.map((a) => a.id) },
							organizationId,
							entityId: commentId,
						},
					});
				}

				// 5. Handle Attachments to Add
				if (attachmentIdsToAdd && attachmentIdsToAdd.length > 0) {
					// Link attachments that were temporarily uploaded linked to the TASK
					await tx.attachment.updateMany({
						where: {
							id: { in: attachmentIdsToAdd },
							organizationId: organizationId,
							entityType: AttachmentEntityType.comment, // Ensure they were uploaded for a comment
							// IMPORTANT: Assuming upload linked them to the *TASK* ID temporarily
							entityId: comment.entityId, // Check they are linked to the parent task
						},
						data: {
							entityId: commentId, // Link to the actual comment ID
						},
					});
					// TODO: Check update count matches length of attachmentIdsToAdd?
				}

				// Return the newly updated comment data or the original fetched comment
				return updatedCommentData || comment;
			}); // --- End Transaction ---

			// Revalidate Task path using the result from the transaction
			// Both updatedCommentData and the original comment fetch include entityId
			if (updatedCommentResult?.entityId) {
				revalidatePath(
					`/${organizationId}/tasks/${updatedCommentResult.entityId}`,
				);
			}

			// Return the ID from the transaction result
			return {
				success: true,
				data: { commentId: updatedCommentResult.id },
			};
		} catch (error: unknown) {
			// Use unknown for outer catch block
			console.error("Failed to update comment:", error);
			// Type checking before accessing message
			const errorMessage =
				error instanceof Error
					? error.message
					: "Could not update comment.";
			return { success: false, error: errorMessage };
		}
	});
