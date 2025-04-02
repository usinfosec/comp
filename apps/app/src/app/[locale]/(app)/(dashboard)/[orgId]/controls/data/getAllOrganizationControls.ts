"use server";

import { auth } from "@bubba/auth";
import { db } from "@bubba/db";
import { headers } from "next/headers";

export async function getAllOrganizationControls(params: {
	organizationId: string;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (
		!session ||
		session.session.activeOrganizationId !== params.organizationId
	) {
		throw new Error("Unauthorized");
	}

	const controls = await db.control.findMany({
		where: {
			organizationId: params.organizationId,
		},
		include: {
			artifacts: {
				include: {
					policy: {
						select: {
							status: true,
						},
					},
					evidence: {
						select: {
							published: true,
						},
					},
				},
			},
			requirementsMapped: true,
		},
	});

	return controls;
}
