"use server";

import { auth } from "@/utils/auth";
import { db } from "@comp/db";
import { headers } from "next/headers";

export const getRelatedTasks = async ({
	controlId,
}: {
	controlId: string;
}) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const orgId = session?.session.activeOrganizationId;

	if (!orgId) {
		return [];
	}

	const tasks = await db.task.findMany({
		where: {
			organizationId: orgId,
			entityId: controlId,
			entityType: "control",
		},
	});

	return tasks;
};
