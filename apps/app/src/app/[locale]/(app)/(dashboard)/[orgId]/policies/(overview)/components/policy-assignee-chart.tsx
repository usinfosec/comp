"use client";

import * as React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@bubba/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@bubba/ui/chart";
import { useI18n } from "@/locales/client";
import { Bar, BarChart, XAxis, YAxis, Legend, ResponsiveContainer, LabelList } from "recharts"

interface AssigneeData {
  id: string;
  name: string;
  total: number;
  published: number;
  draft: number;
  archived: number;
  needs_review: number;
}

interface PolicyAssigneeChartProps {
  data?: AssigneeData[] | null;
}

const CHART_COLORS = {
  published: "hsl(var(--chart-positive))", // green
  draft: "hsl(var(--chart-neutral))", // yellow
  archived: "hsl(var(--chart-warning))", // gray
  needs_review: "hsl(var(--chart-destructive))", // red
};

export function PolicyAssigneeChart({ data }: PolicyAssigneeChartProps) {
  const t = useI18n();

  if (!data || data.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>
            {t("policies.dashboard.policies_by_assignee") ||
              "Policies by Assignee"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <p className="text-center text-sm text-muted-foreground">
            No policies assigned to users
          </p>
        </CardContent>
        <CardFooter>
          <div className="flex flex-wrap gap-4 py-2" />
        </CardFooter>
      </Card>
    );
  }

  // Sort assignees by total policies (descending)
  const sortedData = React.useMemo(() => {
    return [...data].sort((a, b) => b.total - a.total).slice(0, 4).reverse();
  }, [data]);

  const chartData = sortedData.map((item) => ({
    name: item.name,
    published: item.published,
    draft: item.draft,
    archived: item.archived,
    needs_review: item.needs_review,
  }));

  const chartConfig = {
    published: {
      label: t("policies.status.published"),
      color: CHART_COLORS.published,
    },
    draft: {
      label: t("policies.status.draft"),
      color: CHART_COLORS.draft,
    },
    archived: {
      label: t("policies.status.archived"),
      color: CHART_COLORS.archived,
    },
    needs_review: {
      label: t("policies.status.needs_review"),
      color: CHART_COLORS.needs_review,
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>
          {t("policies.dashboard.policies_by_assignee") ||
            "Policies by Assignee"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              barSize={30}
              barGap={8}
              margin={{
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
              }}
            >
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.split(' ')[0]}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar dataKey="published" stackId="a" fill={CHART_COLORS.published} />
              <Bar dataKey="draft" stackId="a" fill={CHART_COLORS.draft} />
              <Bar dataKey="archived" stackId="a" fill={CHART_COLORS.archived} />
              <Bar dataKey="needs_review" stackId="a" fill={CHART_COLORS.needs_review} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex flex-wrap gap-4 py-2">
          {Object.entries(chartConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="h-3 w-3"
                style={{ backgroundColor: config.color }}
              />
              <span className="text-xs">{config.label}</span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
