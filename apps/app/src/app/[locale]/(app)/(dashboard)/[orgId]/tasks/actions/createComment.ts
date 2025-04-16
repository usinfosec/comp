"use server";

import { authActionClient } from "@/actions/safe-action";
import { db } from "@comp/db";
import { CommentEntityType } from "@comp/db/types"; // Assuming CommentEntityType is exported from @comp/db/types
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Define the input schema
const createCommentSchema = z.object({
	content: z.string().min(1, "Comment cannot be empty."),
	taskId: z.string(), // This is the entityId for the task comment
});

export const createComment = authActionClient
	.schema(createCommentSchema)
	.metadata({
		// Add metadata if needed (e.g., for tracking)
		name: "createComment",
		track: {
			event: "create-comment",
			channel: "server",
		},
	})
	.action(async ({ ctx, parsedInput }) => {
		const { session, user } = ctx; // user might contain id needed for member lookup
		const { content, taskId } = parsedInput;

		if (!session.activeOrganizationId) {
			return {
				success: false,
				error: "Not authorized - no active organization found.",
			};
		}

		try {
			// Find the Member ID associated with the user and organization
			const member = await db.member.findFirst({
				where: {
					userId: user.id, // Assuming user.id is available from authActionClient context
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

			// Create the comment
			const comment = await db.comment.create({
				data: {
					content,
					entityId: taskId,
					entityType: CommentEntityType.task, // Use the enum value
					authorId: member.id, // Link to the member who authored it
					organizationId: session.activeOrganizationId,
				},
			});

			// Revalidate the path for the task page to show the new comment
			// Removed locale from path for now
			// const locale = session.activeLocale ?? "en"; // Get locale from session or default
			revalidatePath(`/${session.activeOrganizationId}/tasks/${taskId}`);

			return {
				success: true,
				comment, // Return the created comment
			};
		} catch (error) {
			console.error("Failed to create comment:", error);
			// Consider more specific error handling/logging
			return {
				success: false,
				error: "Failed to create comment.",
			};
		}
	});
