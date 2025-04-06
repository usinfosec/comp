"use server";

import { cache } from "react";
import { db } from "@comp/db";
import type { FrameworkInstanceWithControls } from "../types";

export const getAllFrameworkInstancesWithControls = cache(
	async ({
		organizationId,
	}: {
		organizationId: string;
	}): Promise<FrameworkInstanceWithControls[]> => {
		const frameworksWithControls = await db.frameworkInstance.findMany({
			where: {
				organizationId,
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

		return frameworksWithControls;
	},
);
