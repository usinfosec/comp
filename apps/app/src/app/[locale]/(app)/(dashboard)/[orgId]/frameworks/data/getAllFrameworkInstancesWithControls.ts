"use server";

import { db } from "@comp/db";
import type { FrameworkInstanceWithControls } from "../types";

export async function getAllFrameworkInstancesWithControls({
	organizationId,
}: {
	organizationId: string;
}): Promise<FrameworkInstanceWithControls[]> {
	const frameworksWithControls = await db.frameworkInstance.findMany({
		where: {
			organizationId,
		},
		include: {
			framework: true,
			controls: {
				include: {
					policies: {
						select: {
							id: true,
							name: true,
							status: true,
						},
					},
					requirementsMapped: true,
				},
			},
		},
	});

	return frameworksWithControls;
}
