import { completeInvitation } from "@/actions/organization/accept-invitation";
import { db } from "@bubba/db";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const inviteCode = searchParams.get("code");

  if (!inviteCode) {
    return redirect("/");
  }

  try {
    const invitationResult = await completeInvitation({
      inviteCode,
    });

    if (!invitationResult || !invitationResult.data?.success) {
      throw new Error("Invalid invitation");
    }

    const organizationId = invitationResult.data?.data?.organizationId;

    if (!organizationId) {
      throw new Error("Organization not found");
    }

    const organization = await db.organization.findUnique({
      where: {
        id: organizationId,
      },
      select: {
        name: true,
      },
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    redirect(`/auth?inviteCode=${inviteCode}`);
  } catch (error) {
    console.error("Error accepting invitation:", error);
    redirect("/auth?error=invalid-invitation");
  }
}
