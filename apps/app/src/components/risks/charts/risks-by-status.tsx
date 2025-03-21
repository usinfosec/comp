import { db } from "@bubba/db";
import { StatusChart } from "./status-chart";
import { unstable_cache } from "next/cache";
import { Card, CardHeader, CardTitle, CardContent } from "@bubba/ui/card";
import { getI18n } from "@/locales/server";
import { auth } from "@/auth";
import { cache } from "react";

export async function RisksByStatus() {
  const t = await getI18n();

  const risks = await getRisksByStatus();

  const data = risks.map((risk) => ({
    name: risk.status,
    value: risk._count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.risk_status")}</CardTitle>
      </CardHeader>
      <CardContent>
        <StatusChart data={data} />
      </CardContent>
    </Card>
  );
}

const getRisksByStatus = cache(
  async () => {
    const session = await auth();

    if (!session || !session.user.organizationId) {
      return [];
    }

    const risks = await db.risk.groupBy({
      by: ["status"],
      where: { organizationId: session.user.organizationId },
      _count: true,
    });

    return risks;
  },
);
