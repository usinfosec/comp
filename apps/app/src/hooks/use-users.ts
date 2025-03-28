import { auth } from "@/auth";
import { db } from "@bubba/db";
import { cache } from "react";

export const useUsers = cache(async () => {
	const session = await auth();

	if (!session || !session.user.organizationId) {
		return [];
	}

	const users = await db.user.findMany({
		where: { organizationId: session.user.organizationId },
	});

	return users;
});
