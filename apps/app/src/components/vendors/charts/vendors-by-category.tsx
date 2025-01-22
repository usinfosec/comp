import { db } from "@bubba/db";
import { CategoryChart } from "./category-chart";

interface Props {
  organizationId: string;
}

export async function VendorsByCategory({ organizationId }: Props) {
  const vendors = await getVendorsByCategory(organizationId);

  const data = vendors.map((vendor) => ({
    name: vendor.category,
    value: vendor._count,
  }));

  return <CategoryChart data={data} />;
}

async function getVendorsByCategory(organizationId: string) {
  return await db.vendors.groupBy({
    by: ["category"],
    where: { organizationId },
    _count: true,
  });
}
