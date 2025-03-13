"use client";

import React from "react";
import type { EvidenceWithStatus } from "../../actions/getEvidenceDashboard";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import { useAssigneeData } from "../../hooks/useAssigneeData";
import { AssigneeChartRow } from "./AssigneeChartRow";

interface AssigneeBarChartProps {
	byAssignee?: Record<string, EvidenceWithStatus[]>;
	unassigned?: EvidenceWithStatus[];
}

/**
 * Chart component that displays evidence data by assignee
 * with horizontal bar charts for each status
 */
export function AssigneeBarChart({
	byAssignee,
	unassigned = [],
}: AssigneeBarChartProps) {
	const { containerRef, canScrollDown, canScrollUp } = useScrollPosition();
	const { prepareAssigneeData } = useAssigneeData();

	// Handle empty state
	if (!byAssignee && unassigned.length === 0) {
		return (
			<div className="flex justify-center items-center h-full">
				<p className="text-muted-foreground text-sm">
					No assignee data available
				</p>
			</div>
		);
	}

	// Transform data for the chart
	const assigneeData = prepareAssigneeData(byAssignee, unassigned);

	return (
		<div className="relative">
			<div ref={containerRef} className="h-[300px] overflow-y-auto pr-2">
				<div className="space-y-8">
					{assigneeData.map((assignee) => (
						<AssigneeChartRow key={assignee.id} assignee={assignee} />
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
