import { getI18n } from "@/locales/server";

export async function getServerColumnHeaders() {
  const t = await getI18n();

  return {
    name: t("policies.table.name"),
    lastUpdated: t("common.table.last_updated"),
    status: t("common.table.status"),
    ownerId: t("common.table.assigned_to"),
  };
}
