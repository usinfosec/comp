"use client";

import React, { type CSSProperties } from "react";
import { scaleBand, scaleLinear, max, format } from "d3";
import { ClientTooltip } from "@bubba/ui/chart-tooltip";
import { COLORS } from "@/constants/colors";

const DEPARTMENT_COLORS = {
  none: `bg-[${COLORS.open}]`,
  admin: `bg-[${COLORS.admin}]`,
  gov: `bg-[${COLORS.gov}]`,
  hr: `bg-[${COLORS.hr}]`,
  it: `bg-[${COLORS.it}]`,
  itsm: `bg-[${COLORS.itsm}]`,
  qms: `bg-[${COLORS.qms}]`,
};

interface DepartmentData {
  name: string;
  value: number;
}

interface DepartmentChartProps {
  data: DepartmentData[];
}

export function DepartmentChart({ data }: DepartmentChartProps) {
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  // Scales
  const yScale = scaleBand()
    .domain(sortedData.map((d) => d.name))
    .range([0, 100])
    .padding(0.25);

  const xScale = scaleLinear()
    .domain([0, max(sortedData.map((d) => d.value)) ?? 1])
    .range([0, 100]);

  const marginLeft = 70;
  const marginRight = 20;
  const marginBottom = 20;

  const getBarKey = (item: DepartmentData) => `bar-${item.name}-${item.value}`;
  const getTickKey = (value: number) => `tick-${value}`;
  const getLabelKey = (item: DepartmentData) => `label-${item.name}`;

  const getDepartmentColor = (deptName: string) => {
    const normalizedName = deptName.toLowerCase();
    return (
      DEPARTMENT_COLORS[normalizedName as keyof typeof DEPARTMENT_COLORS] ||
      "bg-gray-400"
    );
  };

  return (
    <ClientTooltip>
      <div
        className="relative w-full h-[300px] sm:h-[320px] md:h-[360px]"
        style={
          {
            "--marginTop": "0px",
            "--marginRight": `${marginRight}px`,
            "--marginBottom": `${marginBottom}px`,
            "--marginLeft": `${marginLeft}px`,
          } as CSSProperties
        }
      >
        <div
          className="absolute inset-0
            z-10
            h-[calc(100%-var(--marginTop)-var(--marginBottom))]
            w-[calc(100%-var(--marginLeft)-var(--marginRight))]
            translate-x-[var(--marginLeft)]
            translate-y-[var(--marginTop)]
            overflow-visible"
        >
          {sortedData.map((d) => {
            const barWidth = d.value === 0 ? 3 : xScale(d.value);
            const barHeight = yScale.bandwidth();

            return (
              <div
                key={getBarKey(d)}
                style={{
                  left: "0",
                  top: `${yScale(d.name)}%`,
                  width: `${barWidth}%`,
                  height: `${barHeight}%`,
                }}
                className={`absolute ${getDepartmentColor(d.name)} ${d.value === 0 ? "opacity-40" : ""} dark:opacity-90`}
              />
            );
          })}
          <svg
            className="h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {xScale
              .ticks(5)
              .map(xScale.tickFormat(5, "d"))
              .map((tickValue) => {
                const value = +tickValue;
                return (
                  <g
                    key={`grid-${value}`}
                    transform={`translate(${xScale(value)},0)`}
                    className="text-muted"
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
                );
              })}
          </svg>

          {xScale.ticks(5).map((value) => (
            <div
              key={getTickKey(value)}
              style={{
                left: `${xScale(value)}%`,
                top: "100%",
              }}
              className="absolute text-xs -translate-x-1/2 tabular-nums text-muted-foreground"
            >
              {format(",d")(value)}
            </div>
          ))}
        </div>

        <div className="h-[calc(100%-var(--marginTop)-var(--marginBottom))] w-[var(--marginLeft)] translate-y-[var(--marginTop)] overflow-visible">
          {sortedData.map((entry) => (
            <span
              key={getLabelKey(entry)}
              style={{
                left: "0",
                top: `${yScale(entry.name)! + yScale.bandwidth() / 2}%`,
                width: `${marginLeft - 2}px`,
              }}
              className="absolute text-xs font-medium text-muted-foreground -translate-y-1/2 text-right pr-1 truncate"
            >
              {entry.name}
            </span>
          ))}
        </div>
      </div>
    </ClientTooltip>
  );
}
