import { auth } from "@/auth";
import { VendorOverview } from "@/components/vendors/charts/vendors-overview";
import { getI18n } from "@/locales/server";
import { db } from "@bubba/db";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";

export default async function VendorOverviewPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setStaticParamsLocale(locale);

	const session = await auth();

	if (!session?.user?.organizationId) {
		redirect("/onboarding");
	}

	const overview = await getVendorOverview(session.user.organizationId);

	return (
		<div className="space-y-4 sm:space-y-8 w-full px-2 sm:px-4">
			<VendorOverview organizationId={session.user.organizationId} />
		</div>
	);
}

const getVendorOverview = unstable_cache(
	async (organizationId: string) => {
		return await db.$transaction(async (tx) => {
			const [vendors] = await Promise.all([
				tx.vendor.count({
					where: { organizationId },
				}),
			]);

			return {
				vendors,
			};
		});
	},
	["vendor-overview-cache"],
);

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	setStaticParamsLocale(locale);
	const t = await getI18n();

	return {
		title: t("sidebar.vendors"),
	};
}
