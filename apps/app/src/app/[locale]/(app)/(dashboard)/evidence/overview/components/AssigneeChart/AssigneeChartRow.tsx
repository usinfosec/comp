"use client";

import { useI18n } from "@/locales/client";
import {
	STATUS_COLORS,
	STATUS_HEX_COLORS,
	STATUS_PRIORITY,
} from "../../constants/evidence-status";
import type { AssigneeData } from "../../hooks/useAssigneeData";
import { useStatusTranslation } from "../../hooks/useStatusTranslation";
import { HorizontalBarChart, type ChartDataItem } from "../HorizontalBarChart";

interface AssigneeChartRowProps {
	assignee: AssigneeData;
}

/**
 * Component for rendering an individual assignee row with chart and legend
 */
export function AssigneeChartRow({ assignee }: AssigneeChartRowProps) {
	const t = useI18n();
	const { getStatusLabel } = useStatusTranslation();

	// Create chart data from assignee status counts
	const chartData: ChartDataItem[] = STATUS_PRIORITY.filter(
		(status) => assignee.statusCounts[status] > 0,
	).map((status) => ({
		key: status,
		label: getStatusLabel(status),
		value: assignee.statusCounts[status],
		color: STATUS_HEX_COLORS[status],
	}));

	return (
		<div className="space-y-2">
			<div className="flex justify-between items-center">
				<p className="text-sm">{assignee.name}</p>
				<span className="text-sm text-muted-foreground">
					{assignee.totalItems} {t("evidence.items")}
				</span>
			</div>

			<HorizontalBarChart
				data={chartData}
				showZeroValues={false}
				valueFormatter={(value) => `${value}`}
				height={12}
			/>

			<div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
				{STATUS_PRIORITY.map(
					(status) =>
						assignee.statusCounts[status] > 0 && (
							<div key={status} className="flex items-center gap-1">
								<div className={`size-2 ${STATUS_COLORS[status]}`} />
								<span>
									{getStatusLabel(status)} ({assignee.statusCounts[status]})
								</span>
							</div>
						),
				)}
			</div>
		</div>
	);
}
