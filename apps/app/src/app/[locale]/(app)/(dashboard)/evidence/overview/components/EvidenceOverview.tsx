"use client";

import { useI18n } from "@/locales/client";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { EvidenceSummaryCards } from "../../list/components/EvidenceSummaryCards";
import type { EvidenceDashboardData } from "../data/getEvidenceDashboard";
import { AssigneeBarChart } from "./AssigneeChart/AssigneeBarChart";
import { DepartmentBarChart } from "./DepartmentChart/DepartmentBarChart";
import { EvidenceEmptyState } from "./EvidenceUIStates";
import { FrameworkBarChart } from "./FrameworkChart/FrameworkBarChart";

export const EvidenceOverview = ({
	evidence,
}: {
	evidence: EvidenceDashboardData | null;
}) => {
	const t = useI18n();

	if (!evidence) {
		return <EvidenceEmptyState />;
	}

	const { byDepartment, byAssignee, byFramework, unassigned } = evidence;

	return (
		<div className="space-y-8">
			{/* Evidence summary statistics cards */}
			<EvidenceSummaryCards />

			{/* Charts */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<Card>
					<CardHeader>
						<CardTitle>{t("evidence.dashboard.by_department")}</CardTitle>
					</CardHeader>
					<CardContent>
						<DepartmentBarChart byDepartment={byDepartment} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>{t("evidence.dashboard.by_assignee")}</CardTitle>
					</CardHeader>
					<CardContent>
						<AssigneeBarChart byAssignee={byAssignee} unassigned={unassigned} />
					</CardContent>
				</Card>

				<Card className="md:col-span-2">
					<CardHeader>
						<CardTitle>{t("evidence.dashboard.by_framework")}</CardTitle>
					</CardHeader>
					<CardContent>
						<FrameworkBarChart byFramework={byFramework} />
					</CardContent>
				</Card>
			</div>
		</div>
	);
};
