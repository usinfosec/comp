import { auth } from "@/auth";
import { Title } from "@/components/title";
import { getI18n } from "@/locales/server";
import { db } from "@bubba/db";
import { SecondaryMenu } from "@bubba/ui/secondary-menu";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ vendorId: string }>;
}

export default async function Layout({ children, params }: LayoutProps) {
  const t = await getI18n();
  const session = await auth();

  if (!session || !session.user.organizationId) {
    redirect("/");
  }

  const vendorId = await params;
  const vendor = await getVendor(
    vendorId.vendorId,
    session.user.organizationId,
  );

  if (!vendor) {
    redirect("/vendors");
  }

  return (
    <div className="max-w-[1200px] space-y-4">
      <Title title={vendor.name} href="/vendors" />
      <SecondaryMenu
        isChild
        items={[
          { path: `/vendors/${vendorId.vendorId}`, label: t("risk.overview") },
          {
            path: `/vendors/${vendorId.vendorId}/tasks`,
            label: t("risk.tasks.title"),
          },
        ]}
      />

      <main className="mt-8">{children}</main>
    </div>
  );
}

const getVendor = unstable_cache(
  async (vendorId: string, organizationId: string) => {
    const vendor = await db.vendors.findUnique({
      where: {
        id: vendorId,
        organizationId: organizationId,
      },
    });

    return vendor;
  },
  ["vendor-cache"],
);
