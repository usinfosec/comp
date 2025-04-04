import { Onboarding } from "@/components/forms/create-organization-form";
import { auth } from "@/utils/auth";
import { db } from "@comp/db";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AcceptInvite } from "./components/accept-invite";

export const metadata: Metadata = {
	title: "Organization Setup | Comp AI",
};

export default async function Page() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const hasInvite = await db.invitation.findFirst({
		where: {
			email: session?.user.email,
			status: "pending",
		},
	});

	if (!session?.session) {
		redirect("/auth");
	}

	if (session.session.activeOrganizationId) {
		redirect("/");
	}

	if (hasInvite) {
		return <AcceptInvite inviteCode={hasInvite.id} />;
	}

	return <Onboarding />;
}
