import { getI18n } from "@/locales/server";
import { SecondaryMenu } from "@bubba/ui/secondary-menu";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getI18n();

  return (
    <div className="max-w-[1200px]">
      <SecondaryMenu
        items={[
          {
            path: "/evidence-tasks",
            label: t("evidence_tasks.evidence_tasks"),
          },
          {
            path: "/evidence-tasks/overview",
            label: t("evidence_tasks.overview"),
          },
        ]}
      />

      <main className="mt-8">{children}</main>
    </div>
  );
}
