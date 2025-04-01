import { auth } from "@/auth";
import { getI18n } from "@/locales/server";
import { SecondaryMenu } from "@bubba/ui/secondary-menu";
import { headers } from "next/headers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getI18n();
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;
  const orgId = user?.organizationId;

  return (
    <div className="max-w-[1200px] m-auto">
      <SecondaryMenu
        items={[
          { path: `/${orgId}/policies`, label: t("policies.dashboard.title") },
          { path: `/${orgId}/policies/all`, label: t("policies.dashboard.all") },
        ]}
      />

      <main className="mt-8">{children}</main>
    </div>
  );
}
