import { auth } from "@/auth";
import { db } from "@bubba/db";
import { Departments, RiskStatus, RiskCategory } from "@bubba/db/types";
import { tool } from "ai";
import { z } from "zod";

export function getRiskTools() {
	return {
		getRisks,
		getRiskById,
	};
}

export const getRisks = tool({
	description: "Get risks for the organization",
	parameters: z.object({
		status: z
			.enum(Object.values(RiskStatus) as [RiskStatus, ...RiskStatus[]])
			.optional(),
		department: z
			.enum(Object.values(Departments) as [Departments, ...Departments[]])
			.optional(),
		category: z
			.enum(Object.values(RiskCategory) as [RiskCategory, ...RiskCategory[]])
			.optional(),
	}),
	execute: async ({ status, department, category }) => {
		const session = await auth();

		if (!session?.user.organizationId) {
			return { error: "Unauthorized" };
		}

		const risks = await db.risk.findMany({
			where: {
				organizationId: session.user.organizationId,
				status,
				department,
				category,
			},
			select: {
				id: true,
				title: true,
				status: true,
			},
		});

		return risks;
	},
});

export const getRiskById = tool({
	description: "Get a risk by id",
	parameters: z.object({
		id: z.string(),
	}),
	execute: async ({ id }) => {
		const session = await auth();

		if (!session?.user.organizationId) {
			return { error: "Unauthorized" };
		}

		const risk = await db.risk.findUnique({
			where: { id, organizationId: session.user.organizationId },
			select: {
				id: true,
				title: true,
				status: true,
				department: true,
				impact: true,
				probability: true,
				residual_impact: true,
				residual_probability: true,
				owner: {
					select: {
						name: true,
					},
				},
				mitigationTasks: {
					select: {
						title: true,
						status: true,
						dueDate: true,
						completedAt: true,
						TaskComments: {
							select: {
								id: true,
								content: true,
								createdAt: true,
								updatedAt: true,
								owner: {
									select: {
										name: true,
									},
								},
							},
						},
						owner: {
							select: {
								name: true,
							},
						},
					},
				},
				comments: {
					select: {
						id: true,
						content: true,
						createdAt: true,
						updatedAt: true,
						owner: {
							select: {
								name: true,
							},
						},
					},
				},
			},
		});

		return risk;
	},
});
