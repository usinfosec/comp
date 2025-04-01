"use server";

import { authActionClient } from "@/actions/safe-action";
import { db } from "@bubba/db";
import { appErrors, policiesInputSchema } from "../types";

export const getPolicies = authActionClient
	.schema(policiesInputSchema)
	.metadata({
		name: "get-policies",
		track: {
			event: "get-policies",
			channel: "server",
		},
	})
	.action(async ({ parsedInput, ctx }) => {
		const { search, status, page = 1, pageSize = 10, sort } = parsedInput;
		const { user } = ctx;

		if (!user.organizationId) {
			return {
				success: false,
				error: appErrors.UNAUTHORIZED.message,
			};
		}

		try {
			const skip = (page - 1) * pageSize;
			const [column, order] = sort?.split(":") ?? [];

			let orderByClause: any = { updatedAt: "desc" };

			if (column) {
				if (column === "name") {
					orderByClause = {
						policy: {
							name: order === "asc" ? "asc" : "desc",
						},
					};
				} else {
					orderByClause = {
						[column]: order === "asc" ? "asc" : "desc",
					};
				}
			}

			const [policies, total] = await Promise.all([
				db.policy.findMany({
					where: {
						organizationId: user.organizationId,
					},
					skip,
					take: pageSize,
					orderBy: orderByClause,
				}),
				db.policy.count({
					where: {
						organizationId: user.organizationId,
					},
				}),
			]);

			return {
				success: true,
				data: { policies, total },
			};
		} catch (error) {
			console.error("Error fetching policies:", error);
			return {
				success: false,
				error: appErrors.UNEXPECTED_ERROR.message,
			};
		}
	});
