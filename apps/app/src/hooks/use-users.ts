import { auth } from "@bubba/auth";
import { db } from "@bubba/db";
import { cache } from "react";
import { headers } from "next/headers";

export const useUsers = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session || !session.user.organizationId) {
		return [];
	}

	const users = await db.user.findMany({
		where: { organizationId: session.user.organizationId },
	});

	return users;
});
