"use server";

import { authActionClient } from "@/actions/safe-action";
import { db } from "@comp/db";
import {
	CommentEntityType,
	AttachmentEntityType,
	AttachmentType,
} from "@comp/db/types"; // Import AttachmentEntityType
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Define the input schema
const createCommentSchema = z
	.object({
		content: z.string().min(1, "Comment cannot be empty.").optional(), // Allow empty comment if attachments exist
		taskId: z.string(), // This is the entityId for the task comment
		attachmentIds: z.array(z.string()).optional(), // Add optional array of attachment IDs
	})
	.refine(
		(data) =>
			data.content ||
			(data.attachmentIds && data.attachmentIds.length > 0),
		{
			message: "Comment cannot be empty unless attachments are provided.",
			path: ["content"], // You can associate the error with a specific field if desired
		},
	);

export const createComment = authActionClient
	.schema(createCommentSchema)
	.metadata({
		name: "createComment",
		track: {
			event: "create-comment",
			channel: "server",
		},
	})
	.action(async ({ ctx, parsedInput }) => {
		const { session, user } = ctx;
		const { content, taskId, attachmentIds } = parsedInput;

		if (!session) {
			return {
				success: false,
				error: "Not authorized - no session found.",
			};
		}

		if (!session.activeOrganizationId) {
			return {
				success: false,
				error: "Not authorized - no active organization found.",
			};
		}

		if (!taskId) {
			console.error("Task ID missing after validation in createComment");
			return {
				success: false,
				error: "Internal error: Task ID missing.",
			};
		}

		try {
			// Find the Member ID associated with the user and organization
			const member = await db.member.findFirst({
				where: {
					userId: user.id,
					organizationId: session.activeOrganizationId,
				},
				select: { id: true },
			});

			if (!member) {
				return {
					success: false,
					error: "Not authorized - member not found in organization.",
				};
			}

			// Wrap create and update in a transaction
			const result = await db.$transaction(async (tx) => {
				// 1. Create the comment within the transaction
				const comment = await tx.comment.create({
					data: {
						content: content ?? "",
						entityId: taskId, // Use validated const
						entityType: CommentEntityType.task,
						authorId: member.id,
						organizationId: session.activeOrganizationId!,
					},
				});

				// 2. Link attachments if provided (using updateMany)
				if (attachmentIds && attachmentIds.length > 0) {
					await tx.attachment.updateMany({
						where: {
							id: { in: attachmentIds },
							organizationId: session.activeOrganizationId!,
							entityType: AttachmentEntityType.comment,
							entityId: taskId,
						},
						data: {
							entityId: comment.id,
							entityType: AttachmentEntityType.comment,
						},
					});
				}

				return comment;
			}); // End of transaction

			// Revalidate outside the transaction
			revalidatePath(`/${session.activeOrganizationId}/tasks/${taskId}`);

			return {
				success: true,
				comment: result, // Use the result from the transaction
			};
		} catch (error) {
			console.error(
				"Failed to create comment with attachments transaction:",
				error,
			);
			return {
				success: false,
				error: "Failed to save comment and link attachments.", // More specific error
			};
		}
	});
