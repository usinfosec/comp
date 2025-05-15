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
		await db.artifact.deleteMany({
			where: {
				organizationId,
				policyId,
				controls: {
					some: {
						id: controlId,
					},
				},
			},
		});

		console.log(`Control ${controlId} unmapped from policy ${policyId}`);
		revalidatePath(`/${organizationId}/policies/${policyId}`);
		revalidatePath(`/${organizationId}/controls/${controlId}`);
	} catch (error) {
		console.error(error);
		throw error;
	}
}
