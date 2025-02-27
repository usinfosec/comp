"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { scaleBand, scaleLinear, max } from "d3";
import { AnimatedBar } from "./AnimatedBar";

export interface ChartDataItem<K = string> {
  key: K;
  label: string;
  value: number;
  color?: string;
}

interface HorizontalBarChartProps<K = string> {
  data: ChartDataItem<K>[];
  title?: string;
  height?: number;
  showZeroValues?: boolean;
  colors?: string[];
  valueFormatter?: (value: number) => string;
}

// Default array of colors using Tailwind's HSL color palette
const defaultColors = [
  "#8b5cf6", // Purple (primary)
  "#06b6d4", // Cyan (secondary)
  "#10b981", // Emerald (accent)
  "#ef4444", // Red (destructive)
  "#6b7280", // Gray (muted)
];

export function HorizontalBarChart<K = string>({
  data,
  title,
  height = 288,
  showZeroValues = true,
  colors = defaultColors,
  valueFormatter = (value) => `${value}`,
}: HorizontalBarChartProps<K>) {
  const [hoveredItem, setHoveredItem] = useState<ChartDataItem<K> | null>(null);

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  // Sort data by value in descending order
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  // Assign colors if not provided
  const chartData = sortedData.map((item, index) => {
    // For single color arrays, use that color for all bars
    const color =
      colors.length === 1
        ? colors[0]
        : item.color || colors[index % colors.length];

    return {
      ...item,
      color,
    };
  });

  // Filter out zero values if not showing them
  const filteredData = showZeroValues
    ? chartData
    : chartData.filter((d) => d.value > 0);

  // Scales
  const yScale = scaleBand()
    .domain(filteredData.map((d) => d.label))
    .range([0, 100])
    .padding(0.175);

  const xScale = scaleLinear()
    .domain([0, max(filteredData.map((d) => d.value)) ?? 0])
    .range([0, 100]);

  const longestWord = max(filteredData.map((d) => d.label.length)) || 1;

  return (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-medium">{title}</h3>}
      <div
        className="relative w-full"
        style={{
          height: `${height}px`,
          ...({
            "--marginTop": "20px",
            "--marginRight": "8px",
            "--marginBottom": "25px",
            "--marginLeft": `${longestWord * 7}px`,
          } as CSSProperties),
        }}
      >
        {/* Chart Area */}
        <div
          className="absolute inset-0
            z-10
            h-[calc(100%-var(--marginTop)-var(--marginBottom))]
            w-[calc(100%-var(--marginLeft)-var(--marginRight))]
            translate-x-[var(--marginLeft)]
            translate-y-[var(--marginTop)]
            overflow-visible"
        >
          {/* Bars with Rounded Right Corners */}
          {filteredData.map((d, index) => {
            const barWidth = xScale(d.value);
            const barHeight = yScale.bandwidth();
            const barTop = yScale(d.label) || 0;
            const isHovered = hoveredItem?.key === d.key;

            return (
              <AnimatedBar key={`bar-${String(d.key)}`} index={index}>
                <div
                  style={{
                    position: "absolute",
                    left: "0",
                    top: `${barTop}%`,
                    width: `${Math.max(barWidth, 5)}%`,
                    height: `${barHeight}%`,
                    backgroundColor: d.color,
                    borderRadius: "0 6px 6px 0", // Rounded right corners
                  }}
                  onMouseEnter={() => setHoveredItem(d)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div
                      className="absolute z-[9999] px-3 py-2 text-sm font-medium text-white bg-black/90 rounded shadow-md pointer-events-none whitespace-nowrap"
                      style={{
                        left: "50%",
                        bottom: "calc(100% + 8px)",
                        transform: "translateX(-50%)",
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-semibold">{d.label}</span>
                        <span>{valueFormatter(d.value)}</span>
                      </div>
                      <div
                        className="absolute w-2 h-2 bg-black/90 rotate-45"
                        style={{
                          bottom: "-4px",
                          left: "50%",
                          transform: "translateX(-50%)",
                        }}
                      />
                    </div>
                  )}
                </div>
              </AnimatedBar>
            );
          })}

          {/* Grid lines */}
          <svg
            className="h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {xScale.ticks(4).map((value) => (
              <g
                key={`grid-line-${value}`}
                transform={`translate(${xScale(value)},0)`}
                className="text-gray-300/80 dark:text-gray-800/80"
              >
                <line
                  y1={0}
                  y2={100}
                  stroke="currentColor"
                  strokeDasharray="6,5"
                  strokeWidth={0.5}
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Y Axis (Labels) */}
        <svg
          className="absolute inset-0
            h-[calc(100%-var(--marginTop)-var(--marginBottom))]
            translate-y-[var(--marginTop)]
            overflow-visible"
        >
          <g className="translate-x-[calc(var(--marginLeft)-8px)]">
            {filteredData.map((entry, i) => (
              <text
                key={`y-axis-${String(entry.key)}`}
                x="0"
                y={`${yScale(entry.label)! + yScale.bandwidth() / 2}%`}
                dy=".35em"
                textAnchor="end"
                fill="currentColor"
                className="text-xs text-zinc-400"
              >
                {entry.label}
                {entry.value === 0 && showZeroValues && (
                  <tspan className="text-zinc-400/70"> (0)</tspan>
                )}
              </text>
            ))}
          </g>
        </svg>

        {/* X Axis (Values) */}
        <svg
          className="absolute inset-0
            w-[calc(100%-var(--marginLeft)-var(--marginRight))]
            translate-x-[var(--marginLeft)]
            h-[calc(100%-var(--marginBottom))]
            translate-y-4
            overflow-visible"
        >
          <g className="overflow-visible">
            {xScale.ticks(4).map((value, i) => (
              <text
                key={`x-axis-${value}`}
                x={`${xScale(value)}%`}
                y="100%"
                textAnchor="middle"
                fill="currentColor"
                className="text-xs tabular-nums text-gray-400"
              >
                {value}
              </text>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
