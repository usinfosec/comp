"use server";

import { auth } from "@bubba/auth";
import { db } from "@bubba/db";
import { headers } from "next/headers";

export const getVendorTaskAttachments = async (taskId: string) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

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
