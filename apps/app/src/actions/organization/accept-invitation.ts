"use server";

import { db } from "@bubba/db";
import { authActionClient } from "../safe-action";
import { z } from "zod";
import type { ActionResponse } from "../types";
import { createSafeActionClient } from "next-safe-action";
import { revalidatePath, revalidateTag } from "next/cache";

const inviteCodeSchema = z.object({
	inviteCode: z.string(),
});

async function findMemberByInviteCode(inviteCode: string) {
	const pendingInvitation = await db.organizationMember.findFirst({
		where: {
			accepted: false,
			invitedEmail: { not: null },
			inviteCode: inviteCode,
		},
		include: {
			organization: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	});

	return pendingInvitation;
}

const publicActionClient = createSafeActionClient();

export const acceptInvitation = publicActionClient
	.schema(inviteCodeSchema)
	.action(
		async ({
			parsedInput,
		}): Promise<
			ActionResponse<{ accepted: boolean; organizationId: string | null }>
		> => {
			const { inviteCode } = parsedInput;

			try {
				const invitation = await findMemberByInviteCode(inviteCode);

				if (!invitation) {
					return {
						success: false,
						error: "Invitation not found or has already been accepted",
					};
				}

				return {
					success: true,
					data: {
						accepted: false,
						organizationId: invitation.organization.id,
					},
				};
			} catch (error) {
				console.error("Error validating invitation:", error);
				return {
					success: false,
					error: "Failed to validate invitation",
				};
			}
		},
	);

const completeInvitationSchema = z.object({
	inviteCode: z.string(),
	userId: z.string(),
});

export const completeInvitation = authActionClient
	.metadata({
		name: "complete-invitation",
		track: {
			event: "complete_invitation",
			channel: "organization",
		},
	})
	.schema(completeInvitationSchema)
	.action(
		async ({
			parsedInput,
			ctx,
		}): Promise<
			ActionResponse<{ accepted: boolean; organizationId: string }>
		> => {
			const { inviteCode, userId } = parsedInput;

			try {
				const invitation = await findMemberByInviteCode(inviteCode);

				if (!invitation) {
					return {
						success: false,
						error: "Invitation not found or has already been accepted",
					};
				}

				const existingMembership = await db.organizationMember.findFirst({
					where: {
						userId,
						organizationId: invitation.organizationId,
					},
				});

				if (existingMembership) {
					const user = await db.user.findUnique({ where: { id: userId } });
					if (!user?.organizationId) {
						await db.user.update({
							where: { id: userId },
							data: {
								organizationId: invitation.organizationId,
							},
						});

						await db.organizationMember.update({
							where: { id: existingMembership.id },
							data: {
								accepted: true,
							},
						});
					}

					return {
						success: true,
						data: {
							accepted: true,
							organizationId: invitation.organizationId,
						},
					};
				}

				await db.organizationMember.update({
					where: {
						id: invitation.id,
					},
					data: {
						accepted: true,
						userId,
						invitedEmail: null,
					},
				});

				await db.user.update({
					where: {
						id: userId,
					},
					data: {
						organizationId: invitation.organizationId,
					},
				});

				revalidatePath("/settings/members");
				revalidateTag(`user_${userId}`);

				return {
					success: true,
					data: {
						accepted: true,
						organizationId: invitation.organizationId,
					},
				};
			} catch (error) {
				console.error("Error accepting invitation:", error);
				return {
					success: false,
					error: "Failed to accept invitation",
				};
			}
		},
	);
