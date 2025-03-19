import { db } from "@bubba/db";
import { auth } from "@/auth";

export async function getOrganizations() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    throw new Error("Not authenticated");
  }

  const organizations = await db.organization.findMany({
    where: {
      users: {
        some: {
          id: user.id,
        },
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  const currentOrganization =
    organizations.find((org) => org.id === user.organizationId) ||
    organizations[0];

  return {
    organizations,
    currentOrganization,
  };
}
