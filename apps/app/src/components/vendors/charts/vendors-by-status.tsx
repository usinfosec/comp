import { db } from "@bubba/db";
import { StatusChart } from "./status-chart";
import { unstable_cache } from "next/cache";
import { Card, CardHeader, CardTitle, CardContent } from "@bubba/ui/card";
import { getI18n } from "@/locales/server";
interface Props {
	organizationId: string;
}

export async function VendorsByStatus({ organizationId }: Props) {
	const t = await getI18n();

	const vendors = await getVendorsByStatus(organizationId);

	const data = vendors.map((vendor) => ({
		name: vendor.status,
		value: vendor._count,
	}));

	return (
		<Card className="w-full h-full">
			<CardHeader>
				<CardTitle>{t("vendors.dashboard.status")}</CardTitle>
			</CardHeader>
			<CardContent className="w-full">
				<StatusChart data={data} />
			</CardContent>
		</Card>
	);
}

const getVendorsByStatus = unstable_cache(
	async (organizationId: string) => {
		return await db.vendor.groupBy({
			by: ["status"],
			where: { organizationId },
			_count: true,
		});
	},
	["vendors-by-status"],
	{ tags: ["vendors", "status"] },
);
