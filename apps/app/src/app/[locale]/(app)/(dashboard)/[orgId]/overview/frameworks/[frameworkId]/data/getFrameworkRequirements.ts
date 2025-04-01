import { Requirement } from "@bubba/data";
import { db } from "@bubba/db";
import type { Control, Policy, Artifact, Evidence } from "@bubba/db/types";

export type FrameworkRequirements = (Requirement & {
	name: string;
	controls: (Control & {
		id: string;
		artifacts: (Artifact & {
			policy: Policy | null;
			evidence: Evidence | null;
		})[];
	})[];
})[];

export const getFrameworkRequirements = async (
	frameworkId: string,
	organizationId: string,
) => {
	const requirements = await db.frameworkInstance.findMany({
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
				},
			},
		},
	});

	return requirements;
};
