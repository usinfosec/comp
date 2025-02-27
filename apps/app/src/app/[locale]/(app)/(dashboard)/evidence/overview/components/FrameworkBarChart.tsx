"use client";

import React from "react";
import type { OrganizationEvidence } from "@prisma/client";
import { HorizontalBarChart, type ChartDataItem } from "./HorizontalBarChart";

interface FrameworkBarChartProps {
  byFramework?: Record<string, OrganizationEvidence[]>;
}

export function FrameworkBarChart({ byFramework }: FrameworkBarChartProps) {
  if (!byFramework) {
    return <div>No framework data available</div>;
  }

  // Create chart data
  const chartData: ChartDataItem<string>[] = Object.entries(byFramework).map(
    ([framework, items]) => ({
      key: framework,
      label: framework || "Uncategorized",
      value: items.length,
    })
  );

  // Sort by count in descending order
  chartData.sort((a, b) => b.value - a.value);

  return (
    <HorizontalBarChart
      data={chartData}
      title="Evidence by Framework"
      showZeroValues={false}
      valueFormatter={(value) => `${value} item${value !== 1 ? "s" : ""}`}
      height={240}
      colors={["#10b981"]}
    />
  );
}
