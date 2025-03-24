// create-task-comment.ts

"use server";

import { createVendorTaskCommentSchema } from "../schema";
import { authActionClient } from "@/actions/safe-action";
import { db } from "@bubba/db";
import { revalidatePath, revalidateTag } from "next/cache";

export const createTaskCommentAction = authActionClient
  .schema(createVendorTaskCommentSchema)
  .metadata({
    name: "create-task-comment",
    track: {
      event: "create-task-comment",
      channel: "server",
    },
  })
  .action(async ({ parsedInput, ctx }) => {
    const { vendorId, vendorTaskId, content } = parsedInput;
    const { user } = ctx;

    if (!user.id || !user.organizationId) {
      throw new Error("Invalid user input");
    }

    await db.vendorTaskComment.create({
      data: {
        vendorId,
        taskId: vendorTaskId,
        content,
        ownerId: user.id,
        organizationId: user.organizationId,
      },
    });

    revalidatePath(`/${user.organizationId}/vendor/${vendorId}`);
    revalidatePath(`/${user.organizationId}/vendor/${vendorId}/tasks/${vendorTaskId}`);
    revalidateTag(`vendor_${user.organizationId}`);

    return { success: true };
  });
