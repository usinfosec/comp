import { AppOnboarding } from "@/components/app-onboarding";
import PageWithBreadcrumb from "@/components/pages/PageWithBreadcrumb";
import type { SearchParams } from "@/types";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { CreateVendorSheet } from "../components/create-vendor-sheet";
import { VendorsTable } from "./components/VendorsTable";
import { getAssignees, getVendors } from "./data/queries";
import { vendorsSearchParamsCache } from "./data/validations";
import type { GetVendorsSchema } from "./data/validations";

export default async function Page({
	searchParams,
	params,
}: {
	searchParams: SearchParams;
	params: Promise<{ orgId: string; locale: string }>;
}) {
	const { orgId, locale } = await params;
	setStaticParamsLocale(locale);

	const parsedSearchParams =
		await vendorsSearchParamsCache.parse(searchParams);

	const [vendorsResult, assignees] = await Promise.all([
		getVendors(orgId, parsedSearchParams),
		getAssignees(orgId),
	]);

	// Helper function to check if the current view is the default, unfiltered one
	function isDefaultView(params: GetVendorsSchema): boolean {
		return (
			params.filters.length === 0 &&
			!params.status &&
			!params.department &&
			!params.assigneeId &&
			params.page === 1 &&
			!params.name
		);
	}

	// Show onboarding only if the view is default/unfiltered and there's no data
	if (vendorsResult.data.length === 0 && isDefaultView(parsedSearchParams)) {
		return (
			<div className="py-4">
				<AppOnboarding
					title={"Vendor Management"}
					description={"Manage your vendors and ensure your organization is protected."}
					cta={"Add vendor"}
					imageSrcLight="/onboarding/vendor-light.webp"
					imageSrcDark="/onboarding/vendor-dark.webp"
					imageAlt="Vendor Management"
					sheetName="createVendorSheet"
					faqs={[
						{
							questionKey: t(
								"app_onboarding.vendors.faqs.question_1",
							),
							answerKey: t(
								"app_onboarding.vendors.faqs.answer_1",
							),
						},
						{
							questionKey: t(
								"app_onboarding.vendors.faqs.question_2",
							),
							answerKey: t(
								"app_onboarding.vendors.faqs.answer_2",
							),
						},
						{
							questionKey: t(
								"app_onboarding.vendors.faqs.question_3",
							),
							answerKey: t(
								"app_onboarding.vendors.faqs.answer_3",
							),
						},
					]}
				/>
				<CreateVendorSheet assignees={assignees} />
			</div>
		);
	}

	return (
		<PageWithBreadcrumb
			breadcrumbs={[
				{ label: "Vendors", href: `/${orgId}/vendors`, current: true },
			]}
		>
			<VendorsTable
				promises={Promise.all([
					getVendors(orgId, parsedSearchParams),
					getAssignees(orgId),
				])}
			/>
		</PageWithBreadcrumb>
	);
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	setStaticParamsLocale(locale);
	return {
		title: "Vendors",
	};
}
