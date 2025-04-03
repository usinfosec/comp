"use server";

import { db } from "@bubba/db";
import type { FrameworkInstanceWithControls } from "../types";

export async function getSingleFrameworkInstanceWithControls({
	organizationId,
	frameworkInstanceId,
}: {
	organizationId: string;
	frameworkInstanceId: string;
}): Promise<FrameworkInstanceWithControls | null> {
	const frameworkInstance = await db.frameworkInstance.findUnique({
		where: {
			organizationId,
			id: frameworkInstanceId,
		},
		include: {
			controls: {
				include: {
					artifacts: {
						include: {
							policy: true,
							evidence: true,
						},
					},
					requirementsMapped: true,
				},
			},
		},
	});

	return frameworkInstance;
}
