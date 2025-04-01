import { auth } from "@/auth";
import { db } from "@bubba/db";

export const getControl = async (id: string) => {
	const session = await auth();

	if (!session) {
		return {
			error: "Unauthorized",
		};
	}

	const control = await db.control.findUnique({
		where: {
			organizationId: session.user.organizationId,
			id,
		},
	});

	return control;
};
