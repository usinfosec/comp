import { auth } from "@/auth";
import { Title } from "@/components/title";
import { getI18n } from "@/locales/server";
import { db } from "@bubba/db";
import { SecondaryMenu } from "@bubba/ui/secondary-menu";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { Suspense } from "react";

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
      <Title title={policy.name} href="/policies" />

      <main className="mt-8">{children}</main>
    </div>
  );
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
