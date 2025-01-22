"use server";

import { auth } from "@/auth";
import { db } from "@bubba/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { authActionClient } from "../safe-action";

const schema = z.object({
  id: z.string(),
  inherent_risk: z.enum(["low", "medium", "high", "unknown"]).optional(),
  residual_risk: z.enum(["low", "medium", "high", "unknown"]).optional(),
});

export const updateVendorRiskAction = authActionClient
  .schema(schema)
  .metadata({
    name: "update-vendor-risk",
    track: {
      event: "update-vendor-risk",
      channel: "server",
    },
  })
  .action(async ({ parsedInput, ctx }) => {
    const { id, inherent_risk, residual_risk } = parsedInput;
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

      await db.vendors.update({
        where: {
          id,
          organizationId,
        },
        data: {
          inherent_risk,
          residual_risk,
        },
      });

      revalidatePath("/vendors/register");
      revalidatePath(`/vendors/${id}`);

      return {
        success: true,
        data: null,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to update vendor risk",
      };
    }
  });
