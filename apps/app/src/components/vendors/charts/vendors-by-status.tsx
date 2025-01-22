import { db } from "@bubba/db";
import { StatusChart } from "./status-chart";

interface Props {
  organizationId: string;
}

export async function VendorsByStatus({ organizationId }: Props) {
  const vendors = await getVendorsByStatus(organizationId);

  const data = vendors.map((vendor) => ({
    name: vendor.status,
    value: vendor._count,
  }));

  return <StatusChart data={data} />;
}

async function getVendorsByStatus(organizationId: string) {
  return await db.vendors.groupBy({
    by: ["status"],
    where: { organizationId },
    _count: true,
  });
}
