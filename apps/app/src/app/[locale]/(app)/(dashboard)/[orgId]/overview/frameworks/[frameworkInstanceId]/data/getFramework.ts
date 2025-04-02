import { db } from "@bubba/db";

export const getFrameworkInstance = async (frameworkInstanceId: string) => {
	const frameworkInstance = await db.frameworkInstance.findUnique({
		where: {
			id: frameworkInstanceId,
		},
	});

	return frameworkInstance;
};
