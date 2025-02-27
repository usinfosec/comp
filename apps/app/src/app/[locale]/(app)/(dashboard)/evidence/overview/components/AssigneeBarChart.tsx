"use client";

import React from "react";
import type { OrganizationEvidence, User } from "@prisma/client";
import { HorizontalBarChart, type ChartDataItem } from "./HorizontalBarChart";

interface AssigneeBarChartProps {
  byAssignee?: Record<string, OrganizationEvidence[]>;
  allEvidence?: OrganizationEvidence[];
}

export function AssigneeBarChart({
  byAssignee,
  allEvidence = [],
}: AssigneeBarChartProps) {
  if (!byAssignee) {
    return <div>No assignee data available</div>;
  }

  // Calculate total assigned evidence items
  const totalAssignedItems = Object.values(byAssignee).reduce(
    (sum, items) => sum + items.length,
    0
  );

  // Calculate unassigned items
  const totalEvidenceItems = allEvidence.length;
  const unassignedCount = Math.max(0, totalEvidenceItems - totalAssignedItems);

  // Create chart data
  const chartData: ChartDataItem<string>[] = Object.entries(byAssignee).map(
    ([assigneeId, items]) => {
      // Get first evidence item to access assignee name
      const displayName = assigneeId || "Unassigned";

      return {
        key: assigneeId,
        label: displayName,
        value: items.length,
      };
    }
  );

  // Add "Unassigned" category with the calculated count
  chartData.push({
    key: "unassigned",
    label: "Unassigned",
    value: unassignedCount,
  });

  // Sort by count in descending order
  chartData.sort((a, b) => b.value - a.value);

  return (
    <HorizontalBarChart
      data={chartData}
      title="Evidence by Assignee"
      showZeroValues={true}
      valueFormatter={(value) => `${value} item${value !== 1 ? "s" : ""}`}
      height={320}
      colors={["#8b5cf6"]}
    />
  );
}
