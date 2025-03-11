"use server";

import { db } from "@bubba/db";
import { authActionClient } from "../safe-action";
import { z } from "zod";
import { MembershipRole, Departments } from "@prisma/client";
import type { ActionResponse } from "../types";
import { revalidatePath, revalidateTag } from "next/cache";

const updateMemberRoleSchema = z.object({
	memberId: z.string(),
	role: z.nativeEnum(MembershipRole),
	department: z.nativeEnum(Departments).optional(),
});

export const updateMemberRole = authActionClient
	.metadata({
		name: "update-member-role",
		track: {
			event: "update_member_role",
			channel: "organization",
		},
	})
	.schema(updateMemberRoleSchema)
	.action(
		async ({
			parsedInput,
			ctx,
		}): Promise<ActionResponse<{ updated: boolean }>> => {
			if (!ctx.user.organizationId) {
				return {
					success: false,
					error: "User does not have an organization",
				};
			}

			const { memberId, role, department } = parsedInput;

			try {
				// Check if user has admin permissions
				const currentUserMember = await db.organizationMember.findFirst({
					where: {
						organizationId: ctx.user.organizationId,
						userId: ctx.user.id,
					},
				});

				if (
					!currentUserMember ||
					(currentUserMember.role !== MembershipRole.admin &&
						currentUserMember.role !== MembershipRole.owner)
				) {
					return {
						success: false,
						error: "You don't have permission to update member roles",
					};
				}

				// Check if the target member exists in the organization
				const targetMember = await db.organizationMember.findFirst({
					where: {
						id: memberId,
						organizationId: ctx.user.organizationId,
					},
				});

				if (!targetMember) {
					return {
						success: false,
						error: "Member not found in this organization",
					};
				}

				// Prevent changing the role of the owner
				if (targetMember.role === MembershipRole.owner) {
					return {
						success: false,
						error: "Cannot change the role of the organization owner",
					};
				}

				// Update the member's role
				await db.organizationMember.update({
					where: {
						id: memberId,
					},
					data: {
						role,
						...(department ? { department } : {}),
					},
				});

				revalidatePath("/settings/members");
				revalidateTag(`user_${ctx.user.id}`);

				return {
					success: true,
					data: { updated: true },
				};
			} catch (error) {
				console.error("Error updating member role:", error);
				return {
					success: false,
					error: "Failed to update member role",
				};
			}
		},
	);
