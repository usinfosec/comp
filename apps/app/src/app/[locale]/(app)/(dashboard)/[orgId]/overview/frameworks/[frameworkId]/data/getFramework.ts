import { db } from "@bubba/db";

export const getFramework = async (
	frameworkId: string,
	organizationId: string,
) => {
	const framework = await db.frameworkInstance.findUnique({
		where: {
			organizationId_frameworkId: {
				organizationId,
				frameworkId,
			},
		},
	});

	return framework;
};
