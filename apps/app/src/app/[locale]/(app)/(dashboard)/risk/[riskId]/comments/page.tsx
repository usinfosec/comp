import { auth } from "@/auth";
import { RiskComments } from "@/components/risks/risk-comments";
import { db } from "@bubba/db";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ riskId: string }>;
}

export default async function RiskPage({ params }: PageProps) {
  const session = await auth();
  const { riskId } = await params;

  if (!session) {
    redirect("/login");
  }

  if (!session.user.organizationId || !riskId) {
    redirect("/");
  }

  const risk = await getRisk(riskId, session.user.organizationId);

  if (!risk) {
    redirect("/risk");
  }

  const users = await getUsers(session.user.organizationId);

  return (
    <div className="flex flex-col gap-4">
      <RiskComments risk={risk} users={users} />
    </div>
  );
}

const getRisk = unstable_cache(
  async (riskId: string, organizationId: string) => {
    const risk = await db.risk.findUnique({
      where: {
        id: riskId,
        organizationId: organizationId,
      },
      include: {
        owner: true,
        comments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return risk;
  },
  ["risk-cache"],
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
