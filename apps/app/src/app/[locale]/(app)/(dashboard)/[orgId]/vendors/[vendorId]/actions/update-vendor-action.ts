// update-risk-action.ts

"use server";

import { db } from "@bubba/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { authActionClient } from "@/actions/safe-action";
import { updateVendorSchema } from "./schema";

export const updateVendorAction = authActionClient
  .schema(updateVendorSchema)
  .metadata({
    name: "update-vendor",
    track: {
      event: "update-vendor",
      channel: "server",
    },
  })
  .action(async ({ parsedInput, ctx }) => {
    const { id, name, description, category, ownerId, status } =
      parsedInput;
    const { user } = ctx;

    if (!user.id || !user.organizationId) {
      throw new Error("Invalid user input");
    }

    try {
      await db.vendor.update({
        where: {
          id,
          organizationId: user.organizationId,
        },
        data: {
          name: name,
          description: description,
          ownerId: ownerId,
          category: category,
          status: status,
        },
      });

      revalidatePath(`/${user.organizationId}/vendors`);
      revalidatePath(`/${user.organizationId}/vendors/register`);
      revalidatePath(`/${user.organizationId}/vendors/${id}`);
      revalidateTag("vendors");

      return {
        success: true,
      };
    } catch (error) {
      console.error("Error updating vendor:", error);

      return {
        success: false,
      };
    }
  });
