// update-task-action.ts

"use server";

import { db } from "@bubba/db";
import type { VendorTaskStatus } from "@bubba/db/types";
import { revalidatePath, revalidateTag } from "next/cache";
import { authActionClient } from "@/actions/safe-action";
import { updateVendorTaskSchema } from "../schema";

export const updateVendorTaskAction = authActionClient
  .schema(updateVendorTaskSchema)
  .metadata({
    name: "update-vendor-task",
    track: {
      event: "update-vendor-task",
      channel: "server",
    },
  })
  .action(async ({ parsedInput, ctx }) => {
    const { id, title, description, dueDate, status, ownerId } = parsedInput;
    const { user } = ctx;

    if (!user.id || !user.organizationId) {
      throw new Error("Invalid user input");
    }

    try {
      const task = await db.vendorTask.findUnique({
        where: {
          id: id,
        },
        select: {
          vendorId: true,
        },
      });

      if (!task) {
        throw new Error("Task not found");
      }

      await db.vendorTask.update({
        where: {
          id: id,
          organizationId: user.organizationId,
        },
        data: {
          title,
          description,
          dueDate,
          status: status as VendorTaskStatus,
          ownerId,
        },
      });

      revalidatePath(`/${user.organizationId}/vendors/${task.vendorId}`);
      revalidatePath(`/${user.organizationId}/vendors/${task.vendorId}/tasks/${id}`);
      revalidateTag(`vendor_${user.organizationId}`);

      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  });
