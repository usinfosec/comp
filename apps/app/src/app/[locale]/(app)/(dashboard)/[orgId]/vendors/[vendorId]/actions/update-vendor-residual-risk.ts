"use server";

import { appErrors } from "@/lib/errors";
import type { ActionResponse } from "@/types/actions";
import { db } from "@bubba/db";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

const schema = z.object({
	vendorId: z.string(),
	residualRisk: z.enum(["low", "medium", "high"] as const),
});

export const updateVendorResidualRisk = createSafeActionClient()
	.schema(schema)
	.action(async ({ parsedInput }): Promise<ActionResponse> => {
		try {
			await db.vendor.update({
				where: { id: parsedInput.vendorId },
				data: { residualRisk: parsedInput.residualRisk },
			});

			return { success: true };
		} catch (error) {
			return {
				success: false,
				error:
					error instanceof Error ? error.message : appErrors.UNEXPECTED_ERROR,
			};
		}
	});
