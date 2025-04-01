"use server";

import { auth } from "@bubba/auth";
import { db } from "@bubba/db";
import { headers } from "next/headers";

export const getVendorTaskAttachments = async (taskId: string) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session || !session.session.activeOrganizationId) {
		return {
			error: "Unauthorized",
		};
	}

	const attachments = await db.vendorTaskAttachment.findMany({
		where: {
			taskId: taskId,
			organizationId: session.session.activeOrganizationId,
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
