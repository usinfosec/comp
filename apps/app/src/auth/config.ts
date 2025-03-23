import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@bubba/db";
import type { OrganizationMember } from "@bubba/db/types";
import { sendMagicLinkEmail } from "@bubba/email/lib/magic-link";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

declare module "next-auth" {
  interface User {
    organizationId?: string;
    full_name?: string;
    avatar_url?: string;
    role?: OrganizationMember["role"];
    isAdmin?: boolean;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      organizationId?: string;
      full_name?: string;
      avatar_url?: string;
      role?: OrganizationMember["role"];
      isAdmin?: boolean;
    } & DefaultSession["user"];
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY!,
      from: "noreply@mail.trycomp.ai",
      async sendVerificationRequest(params) {
        await sendMagicLinkEmail({
          email: params.identifier,
          url: params.url,
        });
      },
    }),
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
    session: async ({ session, user }) => {
      // Default to false for isAdmin
      let isAdmin = false;

      // Only check for admin status if user has an organizationId
      if (user.id && user.organizationId) {
        const organizationMemberCount = await db.organizationMember.count({
          where: {
            userId: user.id,
            organizationId: user.organizationId,
            OR: [{ role: "admin" }, { role: "owner" }],
          },
        });

        isAdmin = organizationMemberCount > 0;
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          organizationId: user.organizationId,
          role: user.role,
          isAdmin,
        },
      };
    },
  },
  events: {
    signIn: async ({ user }) => {
      if (user?.id) {
        await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            lastLogin: new Date(),
            organizationId: user.organizationId,
          },
        });
      }
    },
  },
} satisfies NextAuthConfig;
