"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "@/types/actions";
import { VendorStatus, VendorCategory, type Vendor } from "@bubba/db/types";
import { revalidatePath } from "next/cache";
import { auth } from "@bubba/auth";
import { db } from "@bubba/db";
import { headers } from "next/headers";

const schema = z.object({
	name: z.string().min(1, "Name is required"),
	website: z.string().url("Must be a valid URL").optional(),
	description: z.string().optional(),
	category: z.nativeEnum(VendorCategory),
	status: z.nativeEnum(VendorStatus).default(VendorStatus.not_assessed),
	ownerId: z.string().optional(),
});

export const createVendorAction = createSafeActionClient()
	.schema(schema)
	.action(async (input): Promise<ActionResponse<Vendor>> => {
		try {
			const session = await auth.api.getSession({
				headers: await headers(),
			});

			if (!session?.user?.organizationId) {
				throw new Error("Unauthorized");
			}

			const vendor = await db.vendor.create({
				data: {
					name: input.parsedInput.name,
					description: input.parsedInput.description || "",
					category: input.parsedInput.category,
					status: input.parsedInput.status,
					ownerId: input.parsedInput.ownerId,
					organizationId: session.session.activeOrganizationId,
				},
			});

			revalidatePath(`/${session.session.activeOrganizationId}/vendors`);

			return { success: true, data: vendor };
		} catch (error) {
			return {
				success: false,
				error:
					error instanceof Error ? error.message : "Failed to create vendor",
			};
		}
	});
