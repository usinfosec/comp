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
		// 1. For each control, create a new artifact that is linked to the policy.
		const artifacts = await db.$transaction(
			controlIds.map((controlId) =>
				db.artifact.create({
					data: {
						organizationId,
						policyId,
						type: "policy",
						controls: {
							connect: { id: controlId },
						},
					},
				}),
			),
		);

		console.log("Artifacts:", artifacts);
		console.log(`Controls mapped successfully to policy ${policyId}`);

		revalidatePath(`/${organizationId}/policies/${policyId}`);
	} catch (error) {
		console.error(error);
		throw error;
	}
}
