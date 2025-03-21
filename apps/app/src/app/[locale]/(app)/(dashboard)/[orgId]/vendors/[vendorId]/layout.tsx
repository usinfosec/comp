import { auth } from "@/auth";
import { getI18n } from "@/locales/server";
import { db } from "@bubba/db";
import { SecondaryMenu } from "@bubba/ui/secondary-menu";
import { redirect } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ vendorId: string }>;
}

export default async function Layout({ children, params }: LayoutProps) {
  const t = await getI18n();
  const session = await auth();
  const user = session?.user;
  const orgId = user?.organizationId;

  if (!session || !orgId) {
    redirect("/");
  }

  const vendorId = await params;
  const vendor = await db.vendor.findUnique({
    where: {
      id: vendorId.vendorId,
      organizationId: orgId,
    },
  });

  if (!vendor) {
    redirect("/vendors/register");
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
