"use client";

import React from "react";
import { HorizontalBarChart, type ChartDataItem } from "../HorizontalBarChart";
import { useI18n } from "@/locales/client";
import type { DepartmentData } from "../../hooks/useEvidenceData";
import {
	STATUS_COLORS,
	STATUS_PRIORITY,
	STATUS_HEX_COLORS,
} from "../../constants/evidence-status";
import { useStatusTranslation } from "../../hooks/useStatusTranslation";

interface DepartmentChartRowProps {
	department: DepartmentData;
}

/**
 * Component for rendering an individual department row with chart and legend
 */
export function DepartmentChartRow({ department }: DepartmentChartRowProps) {
	const t = useI18n();
	const { getStatusLabel } = useStatusTranslation();

	// Create chart data from department status counts
	const chartData: ChartDataItem[] = STATUS_PRIORITY.filter(
		(status) => department.statusCounts[status] > 0,
	).map((status) => ({
		key: status,
		label: getStatusLabel(status),
		value: department.statusCounts[status],
		color: STATUS_HEX_COLORS[status],
	}));

	return (
		<div className="space-y-2">
			<div className="flex justify-between items-center">
				<p className="text-sm">{department.name}</p>
				<span className="text-sm text-muted-foreground">
					{department.totalItems} {t("evidence.items")}
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
						department.statusCounts[status] > 0 && (
							<div key={status} className="flex items-center gap-1">
								<div className={`size-2 ${STATUS_COLORS[status]}`} />
								<span>
									{getStatusLabel(status)} ({department.statusCounts[status]})
								</span>
							</div>
						),
				)}
			</div>
		</div>
	);
}
