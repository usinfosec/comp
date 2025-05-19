"use server";

import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@comp/db";

export async function unmapPolicyFromControl({
	policyId,
	controlId,
}: {
	policyId: string;
	controlId: string;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const organizationId = session?.session.activeOrganizationId;

	if (!organizationId) {
		throw new Error("Unauthorized");
	}

	try {
		console.log(`Unmapping control ${controlId} from policy ${policyId}`);
		
		// Update the policy to disconnect it from the specified control
		await db.policy.update({
			where: { id: policyId, organizationId: organizationId }, // Ensure policy belongs to the org
			data: {
				controls: {
					disconnect: { id: controlId },
				},
			},
		});

		console.log(`Control ${controlId} unmapped from policy ${policyId}`);
		revalidatePath(`/${organizationId}/policies/${policyId}`);
		revalidatePath(`/${organizationId}/controls/${controlId}`);
	} catch (error) {
		console.error("Error unmapping control from policy:", error);
		throw error;
	}
}
