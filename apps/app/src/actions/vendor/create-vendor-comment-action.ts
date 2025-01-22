"use server";

import { auth } from "@/auth";
import { db } from "@bubba/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { authActionClient } from "../safe-action";

const schema = z.object({
  vendorId: z.string(),
  content: z.string().min(1),
});

export const createVendorCommentAction = authActionClient
  .schema(schema)
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

    try {
      const session = await auth();
      const organizationId = session?.user.organizationId;

      if (!organizationId) {
        return {
          success: false,
          error: "Not authorized",
        };
      }

      await db.vendorComment.create({
        data: {
          content,
          vendorId,
          ownerId: user.id,
          organizationId,
        },
      });

      revalidatePath("/vendors/register");
      revalidatePath(`/vendors/${vendorId}`);

      return {
        success: true,
        data: null,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to create vendor comment",
      };
    }
  });
