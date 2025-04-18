"use server";

import { authActionClient } from "@/actions/safe-action";
import { db } from "@comp/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { Attachment } from "@comp/db/types";

// --- S3 Client (Should be shared or refactored) ---
if (
	!process.env.AWS_REGION ||
	!process.env.AWS_ACCESS_KEY_ID ||
	!process.env.AWS_SECRET_ACCESS_KEY ||
	!process.env.AWS_BUCKET_NAME
) {
	console.error("AWS S3 environment variables missing for deleteComment");
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
	console.error("Invalid S3 URL format for delete:", url);
	throw new Error("Invalid S3 URL format");
}
// --- End Helper ---

const schema = z.object({
	commentId: z.string(),
});

export const deleteComment = authActionClient
	.schema(schema)
	.metadata({
		name: "deleteComment",
		track: { event: "delete-comment", channel: "server" },
	})
	.action(async ({ ctx, parsedInput }) => {
		const { session, user } = ctx;
		const { commentId } = parsedInput;
		const organizationId = session.activeOrganizationId;
		const userId = user.id; // For permission check

		if (!organizationId) {
			return {
				success: false,
				error: "Not authorized: No active organization",
			};
		}

		try {
			// 1. Fetch the comment, its author, and its attachments
			const comment = await db.comment.findUnique({
				where: { id: commentId, organizationId },
				select: {
					id: true,
					authorId: true,
					entityId: true, // Parent task ID for revalidation
					attachments: {
						// Get attachments to delete from S3
						select: { id: true, url: true },
					},
				},
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
					error: "Not authorized to delete this comment",
				};
			}

			const parentTaskId = comment.entityId; // Store before transaction

			// --- Start Transaction ---
			await db.$transaction(async (tx) => {
				// 3. Delete Attachments from S3 (best effort)
				if (comment.attachments && comment.attachments.length > 0) {
					for (const att of comment.attachments as {
						id: string;
						url: string;
					}[]) {
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
								`Failed to delete attachment ${att.id} from S3 during comment deletion:`,
								s3Error,
							);
							// Continue even if S3 delete fails
						}
					}
					// 4. Delete Attachment records from DB
					await tx.attachment.deleteMany({
						where: { entityId: commentId, organizationId }, // Delete all linked to this comment
					});
				}

				// 5. Delete the Comment itself
				await tx.comment.delete({
					where: { id: commentId, organizationId },
				});
			}); // --- End Transaction ---

			// Revalidate Task path
			if (parentTaskId) {
				revalidatePath(`/${organizationId}/tasks/${parentTaskId}`);
			}

			return { success: true, data: { deletedCommentId: commentId } };
		} catch (error: unknown) {
			console.error("Failed to delete comment:", error);
			const errorMessage =
				error instanceof Error
					? error.message
					: "Could not delete comment.";
			return { success: false, error: errorMessage };
		}
	});
