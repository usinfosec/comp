import { betterAuth } from "better-auth";
import { db } from "@comp/db";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP, organization } from "better-auth/plugins";
import { ac, owner, admin, auditor, member, employee } from "./permissions";
import { sendInviteMemberEmail } from "@comp/email/lib/invite-member";
import { sendEmail } from "@comp/email/lib/resend";
import { nextCookies } from "better-auth/next-js";
import { OTPVerificationEmail } from "@comp/email";

export interface AuthConfig {
	/**
	 * The secret used for encryption, signing, and hashing.
	 * If not provided, it will look for environment variables:
	 * - process.env.BETTER_AUTH_SECRET
	 * - process.env.AUTH_SECRET
	 *
	 * In production, if no secret is found, an error will be thrown.
	 */
	secret?: string;
	/**
	 * Google OAuth credentials
	 */
	googleAuth?: {
		clientId: string;
		clientSecret: string;
	};
}

const DEFAULT_SECRET = "better-auth-secret-123456789";

export function createAuth(config?: AuthConfig) {
	let secret = config?.secret;

	// Try to get secret from env vars if not provided
	if (!secret) {
		secret = process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET;
	}

	// In production, throw error if no secret is provided
	if (!secret && process.env.NODE_ENV === "production") {
		throw new Error(
			"No authentication secret provided. Please set BETTER_AUTH_SECRET or AUTH_SECRET environment variable, or pass a secret in the config.",
		);
	}

	// Use default secret in non-production environments as fallback
	if (!secret) {
		secret = DEFAULT_SECRET;
	}

	return betterAuth({
		database: prismaAdapter(db, {
			provider: "postgresql",
		}),
		secret,
		advanced: {
			// This will enable us to fall back to DB for ID generation.
			// It's important so we can use customs ID's specified in Prisma Schema.
			generateId: false,
		},
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
				schema: {
					organization: {
						modelName: "Organization",
					},
				},
			}),
			emailOTP({
				otpLength: 6,
				expiresIn: 10 * 60,
				async sendVerificationOTP({ email, otp }) {
					await sendEmail({
						to: email,
						subject: "One-Time Password for Comp AI",
						react: OTPVerificationEmail({ email, otp }),
					});
				},
			}),
			nextCookies(),
		],
		socialProviders: {
			google: config?.googleAuth || {
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
}

// Export type definitions
export type {
	Session,
	ActiveOrganization,
	Member,
	Organization,
	Invitation,
} from "./auth";
