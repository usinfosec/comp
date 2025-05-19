"use server";

import { db } from "@comp/db";
import type { FrameworkInstanceWithControls } from "../types";
import type { Control, PolicyStatus, RequirementMap } from "@comp/db/types";

export async function getAllFrameworkInstancesWithControls({
	organizationId,
}: {
	organizationId: string;
}): Promise<FrameworkInstanceWithControls[]> {
	const frameworkInstancesFromDb = await db.frameworkInstance.findMany({
		where: {
			organizationId,
		},
		include: {
			framework: true,
			requirementsMapped: {
				include: {
					control: {
						include: {
							policies: {
								select: {
									id: true,
									name: true,
									status: true,
								},
							},
							// We need to re-fetch requirementsMapped for each control
							// as the type FrameworkInstanceWithControls expects requirementsMapped under each control
							requirementsMapped: true,
						},
					},
				},
			},
		},
	});

	const frameworksWithControls: FrameworkInstanceWithControls[] =
		frameworkInstancesFromDb.map((fi) => {
			const controlsMap = new Map<
				string,
				Control & {
					policies: Array<{ id: string; name: string; status: PolicyStatus }>;
					requirementsMapped: RequirementMap[];
				}
			>();

			fi.requirementsMapped.forEach((rm) => {
				if (rm.control) {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const { requirementsMapped: _, ...controlData } = rm.control; // Exclude control.requirementsMapped from initial spread to avoid deep nesting issues if any
					if (!controlsMap.has(rm.control.id)) {
						controlsMap.set(rm.control.id, {
							...controlData,
							// Ensure policies and requirementsMapped are correctly structured
							// The Prisma query already selects policies in the desired format.
							// For requirementsMapped on control, it's fetched by the include.
							policies: rm.control.policies || [],
							requirementsMapped: rm.control.requirementsMapped || [],
						});
					}
				}
			});
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { requirementsMapped, ...restOfFi } = fi;
			return {
				...restOfFi,
				controls: Array.from(controlsMap.values()),
			};
		});

	return frameworksWithControls;
}
