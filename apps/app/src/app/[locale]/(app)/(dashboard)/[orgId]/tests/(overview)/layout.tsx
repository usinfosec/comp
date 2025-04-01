import { getI18n } from "@/locales/server";
import { SecondaryMenu } from "@bubba/ui/secondary-menu";
import { auth } from "@/auth/auth";
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
  const organizationId = user?.organizationId;

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
