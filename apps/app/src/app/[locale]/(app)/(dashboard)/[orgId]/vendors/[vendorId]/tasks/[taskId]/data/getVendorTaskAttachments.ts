"use server";

import { auth } from "@/auth";
import { db } from "@bubba/db";

export const getVendorTaskAttachments = async (taskId: string) => {
	const session = await auth();

	if (!session || !session.user.organizationId) {
		return {
			error: "Unauthorized",
		};
	}

	const attachments = await db.vendorTaskAttachment.findMany({
		where: {
			taskId: taskId,
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