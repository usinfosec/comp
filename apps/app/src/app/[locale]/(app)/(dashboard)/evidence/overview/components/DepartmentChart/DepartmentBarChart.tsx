"use client";

import type { Departments } from "@prisma/client";
import type { EvidenceWithStatus } from "../../data/getEvidenceDashboard";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import { useEvidenceData } from "../../hooks/useEvidenceData";
import { DepartmentChartRow } from "./DepartmentChartRow";

interface DepartmentBarChartProps {
	byDepartment?: Record<Departments, EvidenceWithStatus[]>;
}

/**
 * Chart component that displays evidence data by department
 * with horizontal bar charts for each status
 */
export function DepartmentBarChart({ byDepartment }: DepartmentBarChartProps) {
	const { containerRef, canScrollDown, canScrollUp } = useScrollPosition();
	const { prepareDepartmentData } = useEvidenceData();

	// Handle empty state
	if (!byDepartment || Object.keys(byDepartment).length === 0) {
		return (
			<div className="flex justify-center items-center h-full">
				<p className="text-muted-foreground text-sm">
					No department data available
				</p>
			</div>
		);
	}

	// Transform data for the chart
	const departmentData = prepareDepartmentData(byDepartment);

	return (
		<div className="relative">
			<div ref={containerRef} className="h-[300px] overflow-y-auto pr-2">
				<div className="space-y-8">
					{departmentData.map((department) => (
						<DepartmentChartRow key={department.id} department={department} />
					))}
				</div>
			</div>

			{/* Scroll indicators */}
			{canScrollUp && (
				<div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-background to-transparent flex justify-center items-center pointer-events-none">
					<ChevronUp className="h-4 w-4 text-muted-foreground" />
				</div>
			)}

			{canScrollDown && (
				<div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-background to-transparent flex justify-center items-center pointer-events-none">
					<ChevronDown className="h-4 w-4 text-muted-foreground" />
				</div>
			)}
		</div>
	);
}
