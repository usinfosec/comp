"use server";

import { authActionClient } from "@/actions/safe-action";
import { db } from "@comp/db";
import { Departments, TaskFrequency, TaskStatus } from "@comp/db/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const updateTask = authActionClient
	.schema(
		z.object({
			id: z.string(),
			title: z.string().optional(),
			description: z.string().optional(),
			status: z.nativeEnum(TaskStatus).optional(),
			assigneeId: z.string().optional(),
			order: z.number().optional(),
			frequency: z.nativeEnum(TaskFrequency).optional().nullable(),
			department: z.nativeEnum(Departments).optional(),
		}),
	)
	.metadata({
		name: "updateTask",
		track: {
			event: "update-task",
			channel: "server",
		},
	})
	.action(async ({ ctx, parsedInput }) => {
		const { session } = ctx;
		const { id, ...rest } = parsedInput;

		if (!session.activeOrganizationId) {
			return {
				success: false,
				error: "Not authorized - no organization found",
			};
		}

		try {
			const task = await db.task.update({
				where: {
					id,
					organizationId: session.activeOrganizationId,
				},
				data: { ...rest, updatedAt: new Date() },
			});

			const orgId = session.activeOrganizationId;

			revalidatePath(`/${orgId}/tasks`);

			return {
				success: true,
				task,
			};
		} catch (error) {
			console.error("Failed to update task:", error);
			return {
				success: false,
				error: "Failed to update task",
			};
		}
	});
