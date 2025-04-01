import { betterAuth } from "better-auth";
import { db } from "@bubba/db";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
	database: prismaAdapter(db, {
		provider: "postgresql",
	}),
	user: {
		additionalFields: {
			organizationId: {
				type: "string",
			},
		},
	},
	socialProviders: {
		google: {
			clientId: process.env.AUTH_GOOGLE_ID!,
			clientSecret: process.env.AUTH_GOOGLE_SECRET!,
		},
	},
});

export type Session = typeof auth.$Infer.Session;
