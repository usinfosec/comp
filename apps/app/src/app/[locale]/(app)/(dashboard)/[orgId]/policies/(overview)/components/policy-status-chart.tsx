"use client";

import * as React from "react";
import { Pie, PieChart, Label, Tooltip, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@bubba/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@bubba/ui/chart";
import { useI18n } from "@/locales/client";

interface PolicyOverviewData {
  totalPolicies: number;
  publishedPolicies: number;
  draftPolicies: number;
  archivedPolicies: number;
  needsReviewPolicies: number;
}

interface PolicyStatusChartProps {
  data?: PolicyOverviewData | null;
}

const CHART_COLORS = {
  published: "hsl(var(--chart-positive))", // green
  draft: "hsl(var(--chart-neutral))",    // yellow
  archived: "hsl(var(--chart-warning))", // gray
  needs_review: "hsl(var(--chart-destructive))", // red
};

// Custom tooltip component for the pie chart
const StatusTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-md border bg-background p-2 shadow-md">
        <p className="text-xs font-medium">{data.name}</p>
        <p className="text-xs">
          Count: <span className="font-medium">{data.value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export function PolicyStatusChart({ data }: PolicyStatusChartProps) {
  const t = useI18n();

  if (!data) {
    return (
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>{t("policies.dashboard.policy_status") || "Policy Status"}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <p className="text-center text-sm text-muted-foreground">
            No policy data available
          </p>
        </CardContent>
        <CardFooter>
          <div className="flex flex-wrap gap-4 py-2" />
        </CardFooter>
      </Card>
    );
  }

  const chartData = React.useMemo(() => {
    const items = [
      {
        name: t("policies.status.published"),
        value: data.publishedPolicies,
        fill: CHART_COLORS.published,
      },
      {
        name: t("policies.status.draft"),
        value: data.draftPolicies,
        fill: CHART_COLORS.draft,
      },
      {
        name: t("policies.status.archived"),
        value: data.archivedPolicies,
        fill: CHART_COLORS.archived,
      },
      {
        name: t("policies.status.needs_review"),
        value: data.needsReviewPolicies,
        fill: CHART_COLORS.needs_review,
      },
    ];

    return items.filter(item => item.value);
  }, [data, t]);

  const chartConfig = {
    value: {
      label: "Count",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{t("policies.dashboard.policy_status") || "Policy Status"}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto h-[300px] max-w-[250px]"
        >
          <PieChart
            width={250}
            height={300}
            margin={{
              top: 16,
              right: 16,
              bottom: 16,
              left: 16,
            }}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              strokeWidth={5}
              stroke="bg-accent"
              cursor="pointer"
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {data.totalPolicies}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex flex-wrap gap-4 py-2">
          {chartData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div
                className="h-3 w-3"
                style={{ backgroundColor: entry.fill }}
              />
              <span className="text-xs">
                {entry.name}
                <span className="ml-1 text-muted-foreground">
                  ({entry.value})
                </span>
              </span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
