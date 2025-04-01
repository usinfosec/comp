import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  organizationClient,
} from "better-auth/client/plugins";
import { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [inferAdditionalFields<typeof auth>(), organizationClient()],
});

export const { signIn, signOut, useSession, useActiveOrganization } =
  authClient;

export type Session = typeof authClient.$Infer.Session;
