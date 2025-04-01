"use server";

import { auth } from "@bubba/auth";
import { db } from "@bubba/db";
import { type Departments, Prisma, type RiskStatus } from "@bubba/db/types";
import { headers } from "next/headers";

export async function getRisks({
	search,
	page,
	pageSize,
	status,
	department,
	assigneeId,
}: {
	search?: string;
	page?: number;
	pageSize?: number;
	status?: RiskStatus | null;
	department?: Departments | null;
	assigneeId?: string | null;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session || !session.session.activeOrganizationId) {
		return {
			success: false,
			error: "Unauthorized",
		};
	}

	const where = {
		organizationId: session.session.activeOrganizationId,
		...(search && {
			title: {
				contains: search,
				mode: Prisma.QueryMode.insensitive,
			},
		}),
		...(status ? { status } : {}),
		...(department ? { department } : {}),
		...(assigneeId ? { ownerId: assigneeId } : {}),
	};

	const skip = ((page ?? 1) - 1) * (pageSize ?? 10);

	const risks = await db.risk.findMany({
		where,
		skip,
		take: pageSize,
		include: {
			owner: true,
		},
	});

	return {
		risks,
	};
}
