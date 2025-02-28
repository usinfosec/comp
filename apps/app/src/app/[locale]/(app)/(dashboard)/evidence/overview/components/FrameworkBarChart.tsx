"use client";

import React, { useEffect, useRef, useState } from "react";
import { HorizontalBarChart, type ChartDataItem } from "./HorizontalBarChart";
import type { EvidenceWithStatus } from "../actions/getEvidenceDashboard";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FrameworkBarChartProps {
  byFramework?: Record<string, EvidenceWithStatus[]>;
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

export function FrameworkBarChart({ byFramework }: FrameworkBarChartProps) {
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
  }, [byFramework]);

  // Recheck on window resize
  useEffect(() => {
    window.addEventListener("resize", checkScrollPosition);
    return () => window.removeEventListener("resize", checkScrollPosition);
  }, []);

  // Debug: Log the incoming data
  useEffect(() => {
    console.log("FrameworkBarChart - byFramework:", byFramework);

    // Check if status is present in the data
    if (byFramework) {
      const firstFramework = Object.values(byFramework)[0];
      if (firstFramework && firstFramework.length > 0) {
        console.log(
          "First framework's first item status:",
          firstFramework[0].status
        );
      }
    }
  }, [byFramework]);

  if (!byFramework || Object.keys(byFramework).length === 0) {
    return <div>No framework data available</div>;
  }

  // Create chart data for each framework
  const frameworkData = Object.entries(byFramework).map(
    ([frameworkId, items]) => {
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

      // Debug: Log status counts for each framework
      console.log(`Status counts for framework ${frameworkId}:`, statusCounts);

      return {
        id: frameworkId,
        name: `${frameworkId}`,
        totalItems: items.length,
        items,
        statusCounts,
      };
    }
  );

  // Sort by count in descending order
  frameworkData.sort((a, b) => b.totalItems - a.totalItems);

  return (
    <div className="relative">
      <div ref={containerRef} className="h-[300px] overflow-y-auto pr-2">
        <div className="space-y-8">
          {frameworkData.map((framework) => {
            // Create chart data for this framework with status breakdown
            const chartData: ChartDataItem[] = [];

            // Add statuses in priority order
            for (const status of STATUS_PRIORITY) {
              if (framework.statusCounts[status] > 0) {
                chartData.push({
                  key: status,
                  label:
                    status === "upToDate"
                      ? "Up to Date"
                      : status === "needsReview"
                        ? "Needs Review"
                        : status.charAt(0).toUpperCase() + status.slice(1),
                  value: framework.statusCounts[status],
                  color: STATUS_COLORS[status],
                });
              }
            }

            return (
              <div key={framework.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm">{framework.name}</p>
                  <span className="text-sm text-muted-foreground">
                    {framework.totalItems} items
                  </span>
                </div>

                {/* Bar chart for this framework with status breakdown */}
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
