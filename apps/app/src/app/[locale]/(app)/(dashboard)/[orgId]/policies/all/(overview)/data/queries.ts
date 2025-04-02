import "server-only";

import { db } from "@bubba/db";
import { auth } from "@bubba/auth";
import type { GetPolicySchema } from "@/lib/validations";
import { cache } from "react";
import { headers } from "next/headers";
import { getValidFilters } from "@/lib/data-table";
import { Prisma } from "@prisma/client";

export async function getPolicies(input: GetPolicySchema) {
	return await cache(async () => {
		try {
			const session = await auth.api.getSession({ headers: await headers() });
			const organizationId = session?.session.activeOrganizationId;

			if (!organizationId) {
				throw new Error("Organization not found");
			}

			const orderBy = input.sort.map((sort) => ({
				[sort.id]: sort.desc ? "desc" : "asc",
			}));

			const where: Prisma.PolicyWhereInput = {
				organizationId,
				...(input.name && {
					name: {
						contains: input.name,
						mode: Prisma.QueryMode.insensitive,
					},
				}),
			};

			const policies = await db.policy.findMany({
				where,
				orderBy: orderBy.length > 0 ? orderBy : [{ createdAt: "desc" }],
				skip: (input.page - 1) * input.perPage,
				take: input.perPage,
			});

			const total = await db.policy.count({
				where,
			});

			const pageCount = Math.ceil(total / input.perPage);
			return { data: policies, pageCount };
		} catch (_err) {
			return { data: [], pageCount: 0 };
		}
	})();
}
