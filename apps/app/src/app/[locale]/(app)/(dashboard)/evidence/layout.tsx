import { getI18n } from "@/locales/server";
import { SecondaryMenu } from "@bubba/ui/secondary-menu";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Implement i18n, build was failing.
  const t = await getI18n();

  return (
    <div className="max-w-[1200px] m-auto">
      <main className="py-8">{children}</main>
    </div>
  );
}
