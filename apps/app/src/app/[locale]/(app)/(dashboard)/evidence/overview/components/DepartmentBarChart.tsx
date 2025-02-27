"use client";

import React from "react";
import type { OrganizationEvidence } from "@prisma/client";
import { HorizontalBarChart, type ChartDataItem } from "./HorizontalBarChart";

interface DepartmentBarChartProps {
  byDepartment?: Record<string, OrganizationEvidence[]>;
}

export function DepartmentBarChart({ byDepartment }: DepartmentBarChartProps) {
  if (!byDepartment) {
    return <div>No department data available</div>;
  }

  // Create chart data
  const chartData: ChartDataItem<string>[] = Object.entries(byDepartment).map(
    ([department, items]) => ({
      key: department,
      label: department || "Uncategorized",
      value: items.length,
    })
  );

  // Sort by count in descending order
  chartData.sort((a, b) => b.value - a.value);

  return (
    <HorizontalBarChart
      data={chartData}
      title="Evidence by Department"
      showZeroValues={false}
      valueFormatter={(value) => `${value} item${value !== 1 ? "s" : ""}`}
      height={320}
      colors={["#ef4444"]}
    />
  );
}
