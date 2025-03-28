"use server";

import { db } from "@bubba/db";
import { appErrors } from "@/lib/errors";
import type { ActionResponse } from "@/types/actions";
import { createSafeActionClient } from "next-safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";
const schema = z.object({
  vendorId: z.string(),
  inherentRisk: z.enum(["unknown", "low", "medium", "high"] as const),
});

export const updateVendorInherentRisk = createSafeActionClient()
  .schema(schema)
  .action(async ({ parsedInput }): Promise<ActionResponse> => {
    try {
      await db.vendor.update({
        where: { id: parsedInput.vendorId },
        data: { inherentRisk: parsedInput.inherentRisk },
      });

      revalidatePath(`/vendors/${parsedInput.vendorId}`);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : appErrors.UNEXPECTED_ERROR,
      };
    }
  });
