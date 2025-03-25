// create-risk-comment.ts

"use server";

import { db } from "@bubba/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { authActionClient } from "@/actions/safe-action";
import { createVendorCommentSchema } from "./schema";

export const createVendorCommentAction = authActionClient
  .schema(createVendorCommentSchema)
  .metadata({
    name: "create-vendor-comment",
    track: {
      event: "create-vendor-comment",
      channel: "server",
    },
  })
  .action(async ({ parsedInput, ctx }) => {
    const { vendorId, content } = parsedInput;
    const { user } = ctx;

    if (!user.id || !user.organizationId) {
      throw new Error("Invalid user input");
    }

    try {
      await db.vendorComment.create({
        data: {
          vendorId,
          content,
          ownerId: user.id,
          organizationId: user.organizationId,
      },
    });

      revalidatePath(`/${user.organizationId}/vendors/${vendorId}`);
      revalidatePath(`/${user.organizationId}/vendors/${vendorId}/comments`);
      revalidateTag(`vendor_${user.organizationId}`);

      return { success: true };
    } catch (error) {
      console.error("Error creating vendor comment:", error);

      return { success: false };
    }
  });
