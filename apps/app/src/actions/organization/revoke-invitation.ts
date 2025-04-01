"use server";

import { db } from "@bubba/db";
import { authActionClient } from "../safe-action";
import { z } from "zod";
import { MembershipRole } from "@prisma/client";
import type { ActionResponse } from "../types";
import { revalidatePath, revalidateTag } from "next/cache";

const revokeInvitationSchema = z.object({
	invitationId: z.string(),
});

export const revokeInvitation = authActionClient
	.metadata({
		name: "revoke-invitation",
		track: {
			event: "revoke_invitation",
			channel: "organization",
		},
	})
	.schema(revokeInvitationSchema)
	.action(
		async ({
			parsedInput,
			ctx,
		}): Promise<ActionResponse<{ revoked: boolean }>> => {
			if (!ctx.session.activeOrganizationId) {
				return {
					success: false,
					error: "User does not have an organization",
				};
			}

			const { invitationId } = parsedInput;

			try {
				// Check if user has admin permissions
				const currentUserMember = await db.organizationMember.findFirst({
					where: {
						organizationId: ctx.session.activeOrganizationId,
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
						error: "You don't have permission to revoke invitations",
					};
				}

				// Check if the invitation exists in the organization
				const invitation = await db.organizationMember.findFirst({
					where: {
						id: invitationId,
						organizationId: ctx.session.activeOrganizationId,
						accepted: false,
					},
				});

				if (!invitation) {
					return {
						success: false,
						error: "Invitation not found or already accepted",
					};
				}

				// Revoke the invitation by deleting the organization member record
				await db.organizationMember.delete({
					where: {
						id: invitationId,
					},
				});

				revalidatePath("/settings/members");
				revalidateTag(`user_${ctx.user.id}`);

				return {
					success: true,
					data: { revoked: true },
				};
			} catch (error) {
				console.error("Error revoking invitation:", error);
				return {
					success: false,
					error: "Failed to revoke invitation",
				};
			}
		},
	);
