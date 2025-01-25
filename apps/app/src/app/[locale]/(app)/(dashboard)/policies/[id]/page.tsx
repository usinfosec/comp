import { auth } from "@/auth";
import { PolicyOverview } from "@/components/policies/policy-overview";
import { db } from "@bubba/db";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PolicyPage({ params }: PageProps) {
  const session = await auth();
  const { id } = await params;

  if (!session) {
    redirect("/login");
  }

  if (!session.user.organizationId || !id) {
    redirect("/");
  }

  const policy = await getPolicy(id, session.user.organizationId);

  if (!policy) {
    redirect("/policies");
  }

  const users = await getUsers(session.user.organizationId);

  return <PolicyOverview policy={policy} />;
}

const getPolicy = unstable_cache(
  async (id: string, organizationId: string) => {
    const policy = await db.artifact.findUnique({
      where: {
        id,
        type: "policy",
        organizationId: organizationId,
      },
    });

    return policy;
  },
  ["policy-cache"],
);

const getUsers = unstable_cache(
  async (organizationId: string) => {
    const users = await db.user.findMany({
      where: { organizationId: organizationId },
    });

    return users;
  },
  ["users-cache"],
);
