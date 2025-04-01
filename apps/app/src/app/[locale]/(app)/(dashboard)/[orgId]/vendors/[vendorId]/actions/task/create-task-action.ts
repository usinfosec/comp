// create-task-action.ts

"use server";

import { db } from "@bubba/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { authActionClient } from "@/actions/safe-action";
import { createVendorTaskSchema } from "../schema";

export const createVendorTaskAction = authActionClient
	.schema(createVendorTaskSchema)
	.metadata({
		name: "create-vendor-task",
		track: {
			event: "create-vendor-task",
			channel: "server",
		},
	})
	.action(async ({ parsedInput, ctx }) => {
		const { vendorId, title, description, dueDate, ownerId } = parsedInput;
		const {
			session: { activeOrganizationId },
			user,
		} = ctx;

		if (!user.id || !activeOrganizationId) {
			throw new Error("Invalid user input");
		}

		try {
			await db.vendorTask.create({
				data: {
					vendorId,
					title,
					description,
					dueDate,
					ownerId,
					organizationId: activeOrganizationId,
				},
			});

			revalidatePath(`/${activeOrganizationId}/vendor/${vendorId}`);
			revalidateTag(`vendor_${activeOrganizationId}`);

			return {
				success: true,
			};
		} catch (error) {
			return {
				success: false,
			};
		}
	});
