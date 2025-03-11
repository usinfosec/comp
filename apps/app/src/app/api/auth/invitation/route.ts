import { completeInvitation } from "@/actions/organization/accept-invitation";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const inviteCode = searchParams.get("code");

	if (!inviteCode) {
		return redirect("/");
	}

	const session = await auth();

	if (!session?.user?.id) {
		return redirect(`/auth?inviteCode=${encodeURIComponent(inviteCode)}`);
	}

	try {
		const result = await completeInvitation({
			inviteCode,
			userId: session.user.id,
		});

		if (!result || !result.data?.success) {
			throw new Error("Failed to accept invitation");
		}

		return NextResponse.redirect(new URL("/", request.url));
	} catch (error) {
		console.error("Error accepting invitation:", error);

		return redirect(
			"/auth/invite-error?message=Failed%20to%20accept%20invitation",
		);
	}
}
