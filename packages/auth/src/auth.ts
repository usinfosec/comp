import { betterAuth } from "better-auth";
import { db } from "@bubba/db";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization } from "better-auth/plugins";
import { ac, owner, admin, auditor, member, employee } from "./permissions";
import { sendInviteMemberEmail } from "@bubba/email/lib/invite-member";

export const auth = betterAuth({
	database: prismaAdapter(db, {
		provider: "postgresql",
	}),
	plugins: [
		organization({
			async sendInvitationEmail(data) {
				const inviteLink = `https://app.trycomp.ai/auth?inviteCode=${data.invitation.id}`;

				await sendInviteMemberEmail({
					email: data.email,
					inviteLink,
					organizationName: data.organization.name,
				});
			},
			ac,
			roles: {
				owner,
				admin,
				member,
				auditor,
				employee,
			},
		}),
	],
	socialProviders: {
		google: {
			clientId: process.env.AUTH_GOOGLE_ID!,
			clientSecret: process.env.AUTH_GOOGLE_SECRET!,
		},
	},
	user: {
		modelName: "User",
	},
	organization: {
		modelName: "Organization",
	},
	member: {
		modelName: "Member",
	},
	invitation: {
		modelName: "Invitation",
	},
	session: {
		modelName: "Session",
	},
	account: {
		modelName: "Account",
	},
	verification: {
		modelName: "Verification",
	},
});

export type Session = typeof auth.$Infer.Session;
