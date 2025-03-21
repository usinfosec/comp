"use server";

import { auth } from "@/auth";
import { db } from "@bubba/db";

export const getTaskAttachments = async (taskId: string) => {
	const session = await auth();

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
