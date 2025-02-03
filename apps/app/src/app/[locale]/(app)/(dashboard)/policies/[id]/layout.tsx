import { auth } from "@/auth";
import { Title } from "@/components/title";
import { getI18n } from "@/locales/server";
import { db } from "@bubba/db";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const t = await getI18n();
  const { id } = await params;
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (!session.user.organizationId || !id) {
    redirect("/policies");
  }

  const policy = await getPolicy(id, session.user.organizationId);

  if (!policy) {
    redirect("/policies");
  }

  return (
    <div className="max-w-[1200px] space-y-4">
      <Title title={policy.name} href="/policies/all" />

      <main className="h-[calc(100vh-4rem-4rem)]">{children}</main>
    </div>
  );

  /* return (
    <div className="h-[calc(100vh-4rem)] bg-background max-w-[1200px]">
      <div className="h-16 px-4 border-b flex items-center">
        <Title title={policy.name} href="/policies/all" />
      </div>
      <main className="h-[calc(100vh-4rem-4rem)]">{children}</main>
    </div>
  ); */
}

const getPolicy = unstable_cache(
  async (policyId: string, organizationId: string) => {
    const policy = await db.artifact.findUnique({
      where: {
        id: policyId,
        organizationId: organizationId,
      },
    });

    return policy;
  },
  ["policy-cache"],
);
