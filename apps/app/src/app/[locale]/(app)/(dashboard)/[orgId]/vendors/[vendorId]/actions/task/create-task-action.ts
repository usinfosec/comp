// create-task-action.ts

"use server";

import { db } from "@bubba/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { authActionClient } from "@/actions/safe-action";
import { createVendorTaskSchema } from "../schema";

export const createVendorTaskAction = authActionClient
  .schema(createVendorTaskSchema)
  .metadata({
    name: "create-task",
    track: {
      event: "create-task",
      channel: "server",
    },
  })
  .action(async ({ parsedInput, ctx }) => {
    const { vendorId, title, description, dueDate, ownerId } = parsedInput;
    const { user } = ctx;

    if (!user.id || !user.organizationId) {
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
          organizationId: user.organizationId,
        },
      });

      revalidatePath(`/${user.organizationId}/vendor/${vendorId}`);
      revalidateTag(`vendor_${user.organizationId}`);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
      };
    }
  });
