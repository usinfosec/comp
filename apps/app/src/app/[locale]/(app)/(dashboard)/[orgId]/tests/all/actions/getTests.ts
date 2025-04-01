"use server";

import { db } from "@bubba/db";
import { authActionClient } from "@/actions/safe-action";
import { testsInputSchema } from "../types";

export const getTests = authActionClient
	.schema(testsInputSchema)
	.metadata({
		name: "get-tests",
		track: {
			event: "get-tests",
			channel: "server",
		},
	})
	.action(async ({ parsedInput, ctx }) => {
		const { search, severity, status, page = 1, pageSize = 10 } = parsedInput;
		const { session } = ctx;

		console.log("--------------------------------");
		console.log("search", search);
		console.log("severity", severity);
		console.log("status", status);
		console.log("page", page);
		console.log("pageSize", pageSize);
		console.log("--------------------------------");

		if (!session.activeOrganizationId) {
			return {
				success: false,
				error: "You are not authorized to view tests",
			};
		}

		try {
			const skip = (page - 1) * pageSize;

			// Use the prisma client with correct model
			const [integrationResults, total] = await Promise.all([
				db.integrationResult.findMany({
					where: {
						organizationId: session.activeOrganizationId,
						...(search
							? {
									OR: [
										{
											integration: {
												name: {
													contains: search,
													mode: "insensitive",
												},
											},
										},
										{
											resultDetails: {
												path: ["Title"],
												string_contains: search,
											},
										},
									],
								}
							: {}),
						...(status
							? { status: { equals: status, mode: "insensitive" } }
							: {}),
						...(severity
							? { severity: { equals: severity, mode: "insensitive" } }
							: {}),
					},
					include: {
						integration: {
							select: {
								id: true,
								name: true,
								integrationId: true,
							},
						},
						assignedUser: {
							select: {
								id: true,
								name: true,
								email: true,
								image: true,
							},
						},
					},
					skip,
					take: pageSize,
					orderBy: { completedAt: "desc" },
				}),
				db.integrationResult.count({
					where: {
						organizationId: session.activeOrganizationId,
						...(search
							? {
									OR: [
										{
											integration: {
												name: {
													contains: search,
													mode: "insensitive",
												},
											},
										},
										{
											resultDetails: {
												path: ["Title"],
												string_contains: search,
											},
										},
									],
								}
							: {}),
						...(status
							? { status: { equals: status, mode: "insensitive" } }
							: {}),
						...(severity
							? { severity: { equals: severity, mode: "insensitive" } }
							: {}),
					},
				}),
			]);

			// Transform the data to include integration info
			const transformedTests = integrationResults.map((result: any) => {
				return {
					id: result.id,
					severity: result.severity,
					result: result.status,
					title: result.title || result.integration.name,
					provider: result.integration.integrationId,
					createdAt: result.completedAt || new Date(),
					// The executedBy information is no longer available in the new schema
					assignedUser: result.assignedUser,
				};
			});

			return {
				success: true,
				data: { tests: transformedTests, total },
			};
		} catch (error) {
			console.error("Error fetching integration results:", error);
			return {
				success: false,
				error: "An unexpected error occurred",
			};
		}
	});
