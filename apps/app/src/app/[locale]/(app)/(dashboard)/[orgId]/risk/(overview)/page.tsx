import { RiskRegisterTable } from "./RiskRegisterTable";
import type { Metadata } from "next";
import { getI18n } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";
import type { RiskStatus, Departments } from "@comp/db/types";
import { getRisks } from "./data/getRisks";
import { auth } from "@comp/auth";
import { cache } from "react";
import { db } from "@comp/db";
import { headers } from "next/headers";
import PageWithBreadcrumb from "@/components/pages/PageWithBreadcrumb";

export default async function RiskRegisterPage({
	params,
}: {
	params: Promise<{
		locale: string;
		search: string;
		page: number;
		pageSize: number;
		status: RiskStatus | null;
		department: Departments | null;
		assigneeId: string | null;
	}>;
}) {
	const { search, page, pageSize, status, department, assigneeId } =
		await params;

	const risks = await getRisks({
		search: search || "",
		page: page || 1,
		pageSize: pageSize || 10,
		status: status || null,
		department: department || null,
		assigneeId: assigneeId || null,
	});

	const assignees = await getAssignees();

	return (
		<PageWithBreadcrumb breadcrumbs={[{ label: "Risk", current: true }]}>
			<RiskRegisterTable
				risks={risks?.risks || []}
				isLoading={false}
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
	const t = await getI18n();

	return {
		title: t("risk.register.title"),
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
