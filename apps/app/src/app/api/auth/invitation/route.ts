import { completeInvitation } from "@/actions/organization/accept-invitation";
import { auth } from "@/auth";
import { db } from "@bubba/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const inviteCode = searchParams.get("code");

	if (!inviteCode) {
		return redirect("/");
	}

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		return redirect(`/auth?inviteCode=${encodeURIComponent(inviteCode)}`);
	}

	const signedInUserEmail = session.user.email;
	const orgMember = await db.organizationMember.findFirst({
		where: {
			userId: session.user.id,
			inviteCode,
		},
	});

	if (!orgMember) {
		return redirect(
			`/auth/invite/error?message=${encodeURIComponent("You are not a member of this organization")}`,
		);
	}

	if (orgMember.invitedEmail !== signedInUserEmail) {
		return redirect(
			`/auth/invite/error?message=${encodeURIComponent(`Incorrect email. Please sign out and sign in with the email you were invited with, you used the email: ${signedInUserEmail}`)}`,
		);
	}

	try {
		const result = await completeInvitation({
			inviteCode,
		});

		if (result?.serverError) {
			throw new Error(result?.serverError);
		}

		return NextResponse.redirect(new URL("/", request.url));
	} catch (error) {
		console.error("Error accepting invitation:", error);

		return redirect(
			`/auth/invite/error?message=${encodeURIComponent(
				(error as Error).message,
			)}`,
		);
	}
}
