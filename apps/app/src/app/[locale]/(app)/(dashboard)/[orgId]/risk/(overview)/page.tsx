import { AppOnboarding } from "@/components/app-onboarding";
import PageWithBreadcrumb from "@/components/pages/PageWithBreadcrumb";
import { CreateRiskSheet } from "@/components/sheets/create-risk-sheet";
import { auth } from "@/utils/auth";
import { db } from "@comp/db";
import type { Departments, RiskStatus } from "@comp/db/types";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { headers } from "next/headers";
import { cache } from "react";
import { RisksTable } from "./RisksTable";
import { getRisks } from "./data/getRisks";
import { searchParamsCache } from "./data/validations";
import { getValidFilters } from "@/lib/data-table";

export default async function RiskRegisterPage(props: {
	params: Promise<{ locale: string; orgId: string }>;
	searchParams: Promise<{
		search: string;
		page: string;
		perPage: string;
		status: string;
		department: string;
		assigneeId: string;
	}>;
}) {
	const { params } = props;
	const { orgId, locale } = await params;

	const searchParams = await props.searchParams;
	const search = searchParamsCache.parse(searchParams);
	const validFilters = getValidFilters(search.filters);

	setStaticParamsLocale(locale);
	const risksResult = await getRisks({
		...search,
		filters: validFilters,
	});

	const assignees = await getAssignees();

	if (
		risksResult.data?.length === 0 &&
		search.page === 1 &&
		search.title === "" &&
		validFilters.length === 0
	) {
		return (
			<div className="py-4">
				<AppOnboarding
					title={"Risk Management"}
					description={t(
						"app_onboarding.risk_management.description",
					)}
					cta={"Create risk"}
					imageSrcLight="/onboarding/risk-light.webp"
					imageSrcDark="/onboarding/risk-dark.webp"
					imageAlt="Risk Management"
					sheetName="create-risk-sheet"
					faqs={[
						{
							questionKey: t(
								"app_onboarding.risk_management.faqs.question_1",
							),
							answerKey: t(
								"app_onboarding.risk_management.faqs.answer_1",
							),
						},
						{
							questionKey: t(
								"app_onboarding.risk_management.faqs.question_2",
							),
							answerKey: t(
								"app_onboarding.risk_management.faqs.answer_2",
							),
						},
						{
							questionKey: t(
								"app_onboarding.risk_management.faqs.question_3",
							),
							answerKey: t(
								"app_onboarding.risk_management.faqs.answer_3",
							),
						},
					]}
				/>
				<CreateRiskSheet assignees={assignees} />
			</div>
		);
	}

	return (
		<PageWithBreadcrumb
			breadcrumbs={[
				{ label: "Risks", href: `/${orgId}/risk`, current: true },
			]}
		>
			<RisksTable
				risks={risksResult?.data || []}
				pageCount={risksResult.pageCount}
				assignees={assignees}
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
		title: "Risks",
	};
}

const getAssignees = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session || !session.session.activeOrganizationId) {
		return [];
	}

	return await db.member.findMany({
		where: {
			organizationId: session.session.activeOrganizationId,
			isActive: true,
			role: {
				notIn: ["employee"],
			},
		},
		include: {
			user: true,
		},
	});
});
