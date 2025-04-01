import { completeInvitation } from "@/actions/organization/accept-invitation";
import { auth } from "@bubba/auth";
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

  // Check the invitation table for the invite code
  const invitation = await db.invitation.findFirst({
    where: {
      id: inviteCode,
      email: signedInUserEmail,
      status: "pending",
    },
  });

  if (!invitation) {
    return redirect(
      `/auth/invite/error?message=${encodeURIComponent("Invitation not found or already accepted")}`
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
        (error as Error).message
      )}`
    );
  }
}
