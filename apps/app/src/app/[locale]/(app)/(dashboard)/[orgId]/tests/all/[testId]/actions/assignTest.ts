"use server";

import { authActionClient } from "@/actions/safe-action";
import { db } from "@bubba/db";
import { Role } from "@prisma/client";
import { z } from "zod";

export const assignTest = authActionClient
	.schema(
		z.object({
			id: z.string(),
			assigneeId: z.string().nullable(),
		}),
	)
	.metadata({
		name: "assignTest",
		track: {
			event: "assign-test",
			channel: "server",
		},
	})
	.action(async ({ ctx, parsedInput }) => {
		const { session } = ctx;
		const { id, assigneeId } = parsedInput;

		if (!session.activeOrganizationId) {
			return {
				success: false,
				error: "Not authorized - no organization found",
			};
		}

		try {
			// Verify the evidence exists and belongs to the organization
			const test = await db.integrationResult.findFirst({
				where: {
					id,
					organizationId: session.activeOrganizationId,
				},
			});

			if (!test) {
				return {
					success: false,
					error: "test not found",
				};
			}

			// If assigneeId is provided, verify the user exists and has admin privileges
			if (assigneeId) {
				const adminMember = await db.member.findFirst({
					where: {
						userId: assigneeId,
						organizationId: session.activeOrganizationId,
						role: {
							in: [Role.admin],
						},
					},
				});

				if (!adminMember) {
					return {
						success: false,
						error: "User not found or does not have admin privileges",
					};
				}
			}

			// Update the evidence with the new assignee
			const updatedTest = await db.integrationResult.update({
				where: {
					id,
				},
				data: {
					assignedUserId: assigneeId,
				},
			});

			return {
				success: true,
				data: updatedTest,
			};
		} catch (error) {
			console.error("Error assigning test:", error);
			return {
				success: false,
				error: "Failed to assign Cloud Test",
			};
		}
	});
