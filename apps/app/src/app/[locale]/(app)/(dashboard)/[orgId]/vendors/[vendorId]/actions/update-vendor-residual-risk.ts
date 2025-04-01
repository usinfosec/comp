"use server";

import { appErrors } from "@/lib/errors";
import type { ActionResponse } from "@/types/actions";
import { db } from "@bubba/db";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { Impact, Likelihood } from "@prisma/client";

const schema = z.object({
	vendorId: z.string(),
	residualProbability: z.nativeEnum(Likelihood),
	residualImpact: z.nativeEnum(Impact),
});

export const updateVendorResidualRisk = createSafeActionClient()
	.schema(schema)
	.action(async ({ parsedInput }): Promise<ActionResponse> => {
		try {
			await db.vendor.update({
				where: { id: parsedInput.vendorId },
				data: {
					residualProbability: parsedInput.residualProbability,
					residualImpact: parsedInput.residualImpact,
				},
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
