"use server";

import { auth } from "@/auth/auth";
import { db } from "@bubba/db";
import { headers } from "next/headers";

export const getTaskAttachments = async (taskId: string) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session || !session.user.organizationId) {
		return {
			error: "Unauthorized",
		};
	}

	const attachments = await db.taskAttachment.findMany({
		where: {
			riskMitigationTaskId: taskId,
			organizationId: session.user.organizationId,
		},
		select: {
			fileUrl: true,
			fileKey: true,
		},
	});

	return {
		success: true,
		data: attachments,
	};
};
