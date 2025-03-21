import { getI18n } from "@/locales/server";
import { db } from "@bubba/db";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { StatusChart } from "./status-chart";

interface Props {
	organizationId: string;
}

export async function RisksByStatus({ organizationId }: Props) {
	const t = await getI18n();

	const risks = await getRisksByStatus(organizationId);

	const data = risks.map((risk) => ({
		name: risk.status,
		value: risk._count,
	}));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("risk.dashboard.status")}</CardTitle>
      </CardHeader>
      <CardContent>
        <StatusChart data={data} />
      </CardContent>
    </Card>
  );
}

const getRisksByStatus = async (organizationId: string) => {
	return await db.risk.groupBy({
		by: ["status"],
		where: { organizationId },
		_count: true,
	});
};
