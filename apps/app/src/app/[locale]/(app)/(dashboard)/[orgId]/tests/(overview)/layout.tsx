import { getI18n } from "@/locales/server";
import { SecondaryMenu } from "@bubba/ui/secondary-menu";
import { auth } from "@bubba/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getI18n();

  const organization = await auth.api.getFullOrganization({
    headers: await headers(),
  });

  if (!organization) {
    redirect("/");
  }

  const organizationId = organization.id;

  return (
    <div className="max-w-[1200px] m-auto">
      <SecondaryMenu
        items={[
          {
            path: `/${organizationId}/tests`,
            label: t("tests.dashboard.overview"),
          },
          {
            path: `/${organizationId}/tests/all`,
            label: t("tests.dashboard.all"),
          },
        ]}
      />

      <main className="mt-8">{children}</main>
    </div>
  );
}
