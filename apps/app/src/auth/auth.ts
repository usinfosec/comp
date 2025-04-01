import { betterAuth } from "better-auth";
import { db } from "@bubba/db";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization } from "better-auth/plugins";

export const auth = betterAuth({
	database: prismaAdapter(db, {
		provider: "postgresql",
	}),
	plugins: [organization()],

	socialProviders: {
		google: {
			clientId: process.env.AUTH_GOOGLE_ID!,
			clientSecret: process.env.AUTH_GOOGLE_SECRET!,
		},
	},
});

export type Session = typeof auth.$Infer.Session;
