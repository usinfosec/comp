"use server";

import { authClient } from "@/utils/auth-client";
import { db } from "@comp/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { authActionClient } from "../safe-action";
import type { ActionResponse } from "../types";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";

const removeMemberSchema = z.object({
	memberId: z.string(),
});

export const removeMember = authActionClient
	.metadata({
		name: "remove-member",
		track: {
			event: "remove_member",
			channel: "organization",
		},
	})
	.schema(removeMemberSchema)
	.action(
		async ({
			parsedInput,
			ctx,
		}): Promise<ActionResponse<{ removed: boolean }>> => {
			console.log("Starting remove member action", {
				userId: ctx.user.id,
			});

			if (!ctx.session.activeOrganizationId) {
				console.log("No active organization found for user", {
					userId: ctx.user.id,
				});
				return {
					success: false,
					error: "User does not have an organization",
				};
			}

			const { memberId } = parsedInput;
			console.log("Attempting to remove member", {
				memberId,
				organizationId: ctx.session.activeOrganizationId,
			});

			try {
				// Check if user has admin permissions
				console.log("Checking user permissions");
				const currentUserMember = await db.member.findFirst({
					where: {
						organizationId: ctx.session.activeOrganizationId,
						userId: ctx.user.id,
					},
				});
				console.log("Current user member details", {
					found: !!currentUserMember,
					role: currentUserMember?.role,
				});

				if (
					!currentUserMember ||
					(currentUserMember.role !== "admin" &&
						currentUserMember.role !== "owner")
				) {
					console.log(
						"Permission denied - user is not admin or owner",
						{
							role: currentUserMember?.role,
						},
					);
					return {
						success: false,
						error: "You don't have permission to remove members",
					};
				}

				// Check if the target member exists in the organization
				console.log("Checking if target member exists");
				const targetMember = await db.member.findFirst({
					where: {
						id: memberId,
						organizationId: ctx.session.activeOrganizationId,
					},
				});
				console.log("Target member details", {
					found: !!targetMember,
					role: targetMember?.role,
					userId: targetMember?.userId,
				});

				if (!targetMember) {
					console.log("Target member not found");
					return {
						success: false,
						error: "Member not found in this organization",
					};
				}

				// Prevent removing the owner
				if (targetMember.role === "owner") {
					console.log("Cannot remove owner", { memberId });
					return {
						success: false,
						error: "Cannot remove the organization owner",
					};
				}

				// Prevent self-removal
				if (targetMember.userId === ctx.user.id) {
					console.log("Self-removal attempt prevented", {
						userId: ctx.user.id,
					});
					return {
						success: false,
						error: "You cannot remove yourself from the organization",
					};
				}

				// Remove the member
				console.log("Removing member from organization", {
					memberId: targetMember.id,
					organizationId: ctx.session.activeOrganizationId,
				});
				await db.member.delete({
					where: {
						id: memberId,
					},
				});

				console.log("Deleting user sessions", {
					userId: targetMember.userId,
				});
				await db.session.deleteMany({
					where: {
						userId: targetMember.userId,
					},
				});

				console.log("Revalidating paths and tags");
				revalidatePath(
					`/${ctx.session.activeOrganizationId}/settings/members`,
				);
				revalidateTag(`user_${ctx.user.id}`);

				console.log("Member successfully removed", { memberId });
				return {
					success: true,
					data: { removed: true },
				};
			} catch (error) {
				console.error("Error removing member:", error);
				return {
					success: false,
					error: "Failed to remove member",
				};
			}
		},
	);
