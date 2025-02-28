"use client";

import React, { useEffect, useRef, useState } from "react";
import { HorizontalBarChart, type ChartDataItem } from "./HorizontalBarChart";
import type { EvidenceWithStatus } from "../actions/getEvidenceDashboard";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AssigneeBarChartProps {
  byAssignee?: Record<string, EvidenceWithStatus[]>;
  unassigned?: EvidenceWithStatus[];
}

// Status colors matching the EvidenceSummaryCards
const STATUS_COLORS = {
  empty: "#6b7280", // Gray for empty
  draft: "#f59e0b", // Amber for draft
  needsReview: "#ef4444", // Red for needs review
  upToDate: "#10b981", // Green for up to date
};

// Status priority order for display (determines the order in the bar)
const STATUS_PRIORITY = ["upToDate", "draft", "needsReview", "empty"] as const;
type StatusType = (typeof STATUS_PRIORITY)[number];

export function AssigneeBarChart({
  byAssignee,
  unassigned = [],
}: AssigneeBarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);

  // Check scroll position and update indicators
  const checkScrollPosition = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      setCanScrollDown(scrollTop + clientHeight < scrollHeight - 10);
      setCanScrollUp(scrollTop > 10);
    }
  };

  // Set up scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollPosition);
      // Initial check
      checkScrollPosition();

      // Check again after content might have changed
      const timer = setTimeout(checkScrollPosition, 100);

      return () => {
        container.removeEventListener("scroll", checkScrollPosition);
        clearTimeout(timer);
      };
    }
  }, [byAssignee, unassigned]);

  // Recheck on window resize
  useEffect(() => {
    window.addEventListener("resize", checkScrollPosition);
    return () => window.removeEventListener("resize", checkScrollPosition);
  }, []);

  // Debug: Log the incoming data
  useEffect(() => {
    console.log("AssigneeBarChart - byAssignee:", byAssignee);
    console.log("AssigneeBarChart - unassigned:", unassigned);

    // Check if status is present in the data
    if (byAssignee) {
      const firstAssignee = Object.values(byAssignee)[0];
      if (firstAssignee && firstAssignee.length > 0) {
        console.log(
          "First assignee's first item status:",
          firstAssignee[0].status,
        );
      }
    }
  }, [byAssignee, unassigned]);

  if (!byAssignee && unassigned.length === 0) {
    return <div>No assignee data available</div>;
  }

  // Create chart data for each assignee
  const assigneeData = Object.entries(byAssignee || {}).map(
    ([assigneeId, items]) => {
      // Count items by status
      const statusCounts = {
        empty: 0,
        draft: 0,
        needsReview: 0,
        upToDate: 0,
      };

      // Use for...of instead of forEach
      for (const item of items) {
        statusCounts[item.status]++;
      }

      // Debug: Log status counts for each assignee
      console.log(`Status counts for ${assigneeId}:`, statusCounts);

      return {
        id: assigneeId,
        name: assigneeId || "Unassigned",
        totalItems: items.length,
        items,
        statusCounts,
      };
    },
  );

  // Add unassigned items if any
  if (unassigned.length > 0) {
    // Count unassigned items by status
    const statusCounts = {
      empty: 0,
      draft: 0,
      needsReview: 0,
      upToDate: 0,
    };

    // Use for...of instead of forEach
    for (const item of unassigned) {
      statusCounts[item.status]++;
    }

    // Debug: Log status counts for unassigned
    console.log("Status counts for unassigned:", statusCounts);

    assigneeData.push({
      id: "unassigned",
      name: "Unassigned",
      totalItems: unassigned.length,
      items: unassigned,
      statusCounts,
    });
  }

  // Sort by count in descending order
  assigneeData.sort((a, b) => b.totalItems - a.totalItems);

  return (
    <div className="relative">
      <div ref={containerRef} className="h-[300px] overflow-y-auto pr-2">
        <div className="space-y-8">
          {assigneeData.map((assignee) => {
            // Create chart data for this assignee with status breakdown
            const chartData: ChartDataItem[] = [];

            // Add statuses in priority order
            for (const status of STATUS_PRIORITY) {
              if (assignee.statusCounts[status] > 0) {
                chartData.push({
                  key: status,
                  label:
                    status === "upToDate"
                      ? "Up to Date"
                      : status === "needsReview"
                        ? "Needs Review"
                        : status.charAt(0).toUpperCase() + status.slice(1),
                  value: assignee.statusCounts[status],
                  color: STATUS_COLORS[status],
                });
              }
            }

            return (
              <div key={assignee.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm">{assignee.name}</p>
                  <span className="text-sm text-muted-foreground">
                    {assignee.totalItems} items
                  </span>
                </div>

                {/* Bar chart for this assignee with status breakdown */}
                <HorizontalBarChart
                  data={chartData}
                  showZeroValues={false}
                  valueFormatter={(value) => `${value}`}
                  height={12}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll up indicator */}
      {canScrollUp && (
        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-background to-transparent flex justify-center items-center pointer-events-none">
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        </div>
      )}

      {/* Scroll down indicator */}
      {canScrollDown && (
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-background to-transparent flex justify-center items-center pointer-events-none">
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
