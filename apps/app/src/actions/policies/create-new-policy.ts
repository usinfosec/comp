"use server";

import { db, Departments, Frequency } from "@bubba/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { authActionClient } from "../safe-action";
import { createPolicySchema } from "../schema";

export const createPolicyAction = authActionClient
	.schema(createPolicySchema)
	.metadata({
		name: "create-policy",
		track: {
			event: "create-policy",
			channel: "server",
		},
	})
	.action(async ({ parsedInput, ctx }) => {
		const { title, description, frameworkIds, controlIds } = parsedInput;
		const { user } = ctx;

		if (!user || !user.organizationId) {
			return {
				success: false,
				error: "Not authorized",
			};
		}

		try {
			const policy = await db.policy.create({
				data: {
					slug: title,
					name: title,
					description,
					content: [
						{ type: "paragraph", content: [{ type: "text", text: "" }] },
					],
					usedBy: JSON.stringify([]),
					policyFrameworks: {
						create: frameworkIds.map((id) => ({ frameworkId: id })),
					},
					PolicyControl: {
						create: controlIds.map((id) => ({ controlId: id })),
					},
				},
			});

			await db.organizationPolicy.create({
				data: {
					organizationId: user.organizationId,
					policyId: policy.id,
					ownerId: user.id,
					department: Departments.none,
					frequency: Frequency.monthly,
				},
			});

			revalidatePath("/policies");
			revalidateTag("policies");

			return {
				success: true,
				policyId: policy.id,
			};
		} catch (error) {
			console.error(error);

			return {
				success: false,
				error: "Failed to create policy",
			};
		}
	});
