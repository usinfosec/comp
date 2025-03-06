import { db } from "@bubba/db";
import { VendorCategory } from "@bubba/db";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { VendorCategoryChart } from "./category-chart";
import { unstable_cache } from "next/cache";
import { getI18n } from "@/locales/server";

const VENDOR_CATEGORIES = Object.values(VendorCategory);

interface Props {
	organizationId: string;
}

export async function VendorsByCategory({ organizationId }: Props) {
	const t = await getI18n();

	const vendors = await getVendorsByCategory(organizationId);

	const data = VENDOR_CATEGORIES.map((category) => {
		const found = vendors.find(
			(vendor) =>
				(vendor.category || "other").toLowerCase() === category.toLowerCase(),
		);

		return {
			name: category === "other" ? "Other" : category.toUpperCase(),
			value: found ? found._count : 0,
		};
	}).sort((a, b) => b.value - a.value);

	// Separate departments with values > 0 and departments with values = 0
	const categoriesWithValues = data.filter((dept) => dept.value > 0);
	const categoriesWithoutValues = data.filter((dept) => dept.value === 0);

	// Determine which departments to show
	let categoriesToShow = [...categoriesWithValues];

	// If we have fewer than 4 departments with values, show up to 2 departments with no values
	if (categoriesWithValues.length < 4 && categoriesWithoutValues.length > 0) {
		categoriesToShow = [
			...categoriesWithValues,
			...categoriesWithoutValues.slice(0, 2),
		];
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("dashboard.vendors_by_category")}</CardTitle>
			</CardHeader>
			<CardContent>
				<VendorCategoryChart
					data={categoriesToShow}
					showEmptyDepartments={true}
				/>
			</CardContent>
		</Card>
	);
}

const getVendorsByCategory = unstable_cache(
	async (organizationId: string) => {
		const vendorsByCategory = await db.vendor.groupBy({
			by: ["category"],
			where: { organizationId },
			_count: true,
		});

		return vendorsByCategory;
	},
	["vendors-by-category"],
	{ tags: ["vendors", "categories"] },
);
