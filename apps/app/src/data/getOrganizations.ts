import { db } from "@bubba/db";
import { auth } from "@/auth";

export async function getOrganizations() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    throw new Error("Not authenticated");
  }

  const memberOrganizations = await db.organizationMember.findMany({
    where: {
      userId: user.id,
      OR: [
        {
          accepted: true,
        },
        {
          role: "owner",
        },
      ],
    },
    include: {
      organization: true,
    },
  });

  const organizations = memberOrganizations.map(
    (member) => member.organization
  );

  return {
    organizations,
  };
}
