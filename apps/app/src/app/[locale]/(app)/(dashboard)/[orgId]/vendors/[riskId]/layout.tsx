import { auth } from "@/auth";
import { Title } from "@/components/title";
import { getI18n } from "@/locales/server";
import { db } from "@bubba/db";
import { SecondaryMenu } from "@bubba/ui/secondary-menu";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ riskId: string }>;
}

export default async function Layout({ children, params }: LayoutProps) {
  const t = await getI18n();
  const session = await auth();
  const user = session?.user;
  const orgId = user?.organizationId;

  if (!session || !orgId) {
    redirect("/");
  }

  const riskId = await params;
  const risk = await getRisk(riskId.riskId, orgId);

  if (!risk) {
    redirect("/risk");
  }

  return (
    <div className="max-w-[1200px] m-auto">
      <SecondaryMenu
        items={[
          { path: `/${orgId}/vendors`, label: t("vendors.dashboard.title") },
          {
            path: `/${orgId}/vendors/register`,
            label: t("vendors.register.title"),
          },
        ]}
      />

      <main className="mt-8">{children}</main>
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
    });

    return risk;
  },
  ["risk-cache"],
);
