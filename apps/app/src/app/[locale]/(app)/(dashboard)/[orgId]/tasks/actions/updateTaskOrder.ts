"use server";

import { authActionClient } from "@/actions/safe-action";
import { db } from "@comp/db";
import { z } from "zod";
import { TaskStatus, TaskEntityType } from "@comp/db/types";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "@/types/actions";

const updateTaskOrderSchema = z.array(
	z.object({
		id: z.string(),
		order: z.number(),
		status: z.nativeEnum(TaskStatus),
		entityType: z.nativeEnum(TaskEntityType),
	}),
);

export const updateTaskOrder = authActionClient
	.schema(updateTaskOrderSchema)
	.metadata({
		name: "updateTaskOrder",
		track: {
			event: "update-task-order",
			channel: "server",
		},
	})
	.action(async ({ ctx, parsedInput }): Promise<ActionResponse> => {
		const { session } = ctx;
		if (!session.activeOrganizationId) {
			return {
				success: false,
				error: "Not authorized - no organization found",
			};
		}
		try {
			for (const { id, order, status, entityType } of parsedInput) {
				await db.task.update({
					where: {
						id,
						organizationId: session.activeOrganizationId,
					},
					data: { order, status, entityType },
				});
			}
			const orgId = session.activeOrganizationId;
			revalidatePath(`/${orgId}/tasks`);
			return { success: true, data: null };
		} catch (error) {
			console.error("Failed to update task order:", error);
			return {
				success: false,
				error: "Failed to update task order",
			};
		}
	});
