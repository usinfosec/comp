import { getI18n } from "@/locales/server";

export async function getServerColumnHeaders() {
  const t = await getI18n();

  return {
    name: t("risk.vendor.table.name"),
    category: t("risk.vendor.table.category"),
    status: t("risk.vendor.table.status"),
    owner: t("risk.vendor.table.owner"),
  };
}
