"use server";

import { db } from "@bubba/db";
import { authActionClient } from "../safe-action";
import { z } from "zod";
import { MembershipRole, Departments } from "@prisma/client";
import { sendEmail } from "@bubba/email/lib/resend";
import { InviteEmail } from "@bubba/email/emails/invite";
import { createHash } from "node:crypto";
import type { ActionResponse } from "../types";
import { revalidatePath, revalidateTag } from "next/cache";

const generateInviteCode = (email: string, organizationId: string) => {
	const randomSalt = crypto.randomUUID();

	return createHash("sha256")
		.update(`${email}:${organizationId}:${randomSalt}:${Date.now()}`)
		.digest("hex")
		.substring(0, 32);
};

const inviteMemberSchema = z.object({
	email: z.string().email(),
	role: z.nativeEnum(MembershipRole).default(MembershipRole.member),
	department: z.nativeEnum(Departments).default(Departments.none),
});

export const inviteMember = authActionClient
	.metadata({
		name: "invite-member",
		track: {
			event: "invite_member",
			channel: "organization",
		},
	})
	.schema(inviteMemberSchema)
	.action(
		async ({
			parsedInput,
			ctx,
		}): Promise<ActionResponse<{ invited: boolean }>> => {
			if (!ctx.user.organizationId) {
				return {
					success: false,
					error: "User does not have an organization",
				};
			}

			const { email, role, department } = parsedInput;

			try {
				// Check if user already exists in the system
				const existingUser = await db.user.findUnique({
					where: {
						email,
					},
				});

				// Check if the user is already a member of the organization
				const existingMember = await db.organizationMember.findFirst({
					where: {
						organizationId: ctx.user.organizationId,
						OR: [{ user: { email } }, { invitedEmail: email }],
					},
				});

				const inviteCode = generateInviteCode(email, ctx.user.organizationId);

				if (existingMember) {
					if (existingMember.accepted) {
						return {
							success: false,
							error: "User is already a member of this organization",
						};
					}

					// If the user is invited but hasn't accepted yet, we can update the invitation
					await db.organizationMember.update({
						where: {
							id: existingMember.id,
						},
						data: {
							role,
							department,
							joinedAt: new Date(),
						},
					});
				} else {
					// Create new invitation
					// We need to create a user record if one doesn't exist yet
					let userId = existingUser?.id;

					if (!userId) {
						// Create a temporary user record
						const newUser = await db.user.create({
							data: {
								email,
								name: email.split("@")[0],
							},
						});
						userId = newUser.id;
					}

					// Create the organization member record
					await db.organizationMember.create({
						data: {
							role,
							department,
							invitedEmail: email,
							inviteCode,
							accepted: false,
							organizationId: ctx.user.organizationId,
							joinedAt: new Date(),
							userId,
						},
					});
				}

				const organization = await db.organization.findUnique({
					where: {
						id: ctx.user.organizationId,
					},
					select: {
						name: true,
					},
				});

				await sendEmail({
					to: email,
					subject: `You've been invited to join ${organization?.name || "an organization"} on Comp AI`,
					react: InviteEmail({
						email,
						teamName: organization?.name || "Team",
						inviteCode,
						invitedByEmail: ctx.user.email || undefined,
						invitedByName: ctx.user.name || undefined,
					}),
				});

				revalidatePath("/settings/members");
				revalidateTag(`user_${ctx.user.id}`);

				return {
					success: true,
					data: { invited: true },
				};
			} catch (error) {
				console.error("Error inviting member:", error);
				return {
					success: false,
					error: "Failed to invite member",
				};
			}
		},
	);
