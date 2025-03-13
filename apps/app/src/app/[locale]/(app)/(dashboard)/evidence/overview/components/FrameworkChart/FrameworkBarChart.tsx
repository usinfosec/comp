"use client";

import React from "react";
import type { EvidenceWithStatus } from "../../actions/getEvidenceDashboard";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import { useFrameworkData } from "../../hooks/useFrameworkData";
import { FrameworkChartRow } from "./FrameworkChartRow";

interface FrameworkBarChartProps {
	byFramework?: Record<string, EvidenceWithStatus[]>;
}

/**
 * Chart component that displays evidence data by framework
 * with horizontal bar charts for each status
 */
export function FrameworkBarChart({ byFramework }: FrameworkBarChartProps) {
	const { containerRef, canScrollDown, canScrollUp } = useScrollPosition();
	const { prepareFrameworkData } = useFrameworkData();

	// Handle empty state
	if (!byFramework || Object.keys(byFramework).length === 0) {
		return (
			<div className="flex justify-center items-center h-full">
				<p className="text-muted-foreground text-sm">
					No framework data available
				</p>
			</div>
		);
	}

	// Transform data for the chart
	const frameworkData = prepareFrameworkData(byFramework);

	return (
		<div className="relative">
			<div ref={containerRef} className="h-[300px] overflow-y-auto pr-2">
				<div className="space-y-8">
					{frameworkData.map((framework) => (
						<FrameworkChartRow key={framework.id} framework={framework} />
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
