"use server";

import { db } from "@bubba/db";
import { auth } from "@bubba/auth";
import { headers } from "next/headers";

export async function getOrganizations() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user) {
    throw new Error("Not authenticated");
  }

  const memberOrganizations = await db.member.findMany({
    where: {
      userId: user.id,
      OR: [
        {
          isActive: true,
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
