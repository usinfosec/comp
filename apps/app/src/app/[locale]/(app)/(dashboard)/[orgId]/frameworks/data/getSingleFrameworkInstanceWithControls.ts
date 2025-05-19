"use server";

import { db } from "@comp/db";
import type { FrameworkInstanceWithControls } from "../types";

export const getSingleFrameworkInstanceWithControls = async ({
	organizationId,
	frameworkInstanceId,
}: {
	organizationId: string;
	frameworkInstanceId: string;
}): Promise<FrameworkInstanceWithControls | null> => {
	const frameworkInstance = await db.frameworkInstance.findUnique({
		where: {
			organizationId,
			id: frameworkInstanceId,
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

	return frameworkInstance;
};
