"use server";

import { auth } from "@/utils/auth";
import { db } from "@comp/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function mapPolicyToControls({
	policyId,
	controlIds,
}: {
	policyId: string;
	controlIds: string[];
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const organizationId = session?.session.activeOrganizationId;

	if (!organizationId) {
		throw new Error("Unauthorized");
	}

	try {
		console.log(`Mapping controls ${controlIds} to policy ${policyId}`);
		
		// Update the policy to connect it to the specified controls
		const updatedPolicy = await db.policy.update({
			where: { id: policyId, organizationId: organizationId }, // Ensure policy belongs to the org
			data: {
				controls: {
					connect: controlIds.map((id) => ({ id })),
				},
			},
			include: { // Optional: include controls to verify or log
				controls: true,
			}
		});

		console.log("Policy updated with controls:", updatedPolicy.controls);
		console.log(`Controls mapped successfully to policy ${policyId}`);

		revalidatePath(`/${organizationId}/policies/${policyId}`);
		// Consider revalidating paths for the affected controls as well, if necessary
		controlIds.forEach(controlId => {
			revalidatePath(`/${organizationId}/controls/${controlId}`);
		});

	} catch (error) {
		console.error("Error mapping controls to policy:", error);
		throw error;
	}
}
