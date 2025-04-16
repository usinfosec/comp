import "server-only";

import { auth } from "@/utils/auth";
import { db } from "@comp/db";
import { Prisma } from "@prisma/client";
import { headers } from "next/headers";
import { cache } from "react";
import type { GetEvidenceSchema } from "./validations";

export async function getEvidence(input: GetEvidenceSchema) {
	return await cache(async () => {
		try {
			const session = await auth.api.getSession({
				headers: await headers(),
			});
			const organizationId = session?.session.activeOrganizationId;

			if (!organizationId) {
				throw new Error("Organization not found");
			}

			const orderBy = input.sort.map((sort) => ({
				[sort.id]: sort.desc ? "desc" : "asc",
			}));

			const where: Prisma.TaskWhereInput = {
				organizationId,
				entityType: "control",
			};

			const evidence = await db.task.findMany({
				where,
				orderBy: orderBy.length > 0 ? orderBy : [{ createdAt: "desc" }],
				skip: (input.page - 1) * input.perPage,
				take: input.perPage,
			});

			const total = await db.task.count({
				where,
			});

			const pageCount = Math.ceil(total / input.perPage);

			console.log({
				evidence,
				total,
				pageCount,
			});
			return { data: evidence, pageCount };
		} catch (_err) {
			return { data: [], pageCount: 0 };
		}
	})();
}
