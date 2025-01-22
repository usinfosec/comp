"use client";

import { useI18n } from "@/locales/client";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@bubba/ui/chart";
import { Cell, Pie, PieChart } from "recharts";

interface StatusChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

export function StatusChart({ data }: StatusChartProps) {
  const t = useI18n();

  // Map status keys to their translations
  const config: ChartConfig = {
    open: {
      label: t("common.status.open"),
      color: "hsl(var(--chart-1))",
    },
    pending: {
      label: t("common.status.pending"),
      color: "hsl(var(--chart-2))",
    },
    closed: {
      label: t("common.status.closed"),
      color: "hsl(var(--chart-3))",
    },
    archived: {
      label: t("common.status.archived"),
      color: "hsl(var(--chart-4))",
    },
  } satisfies ChartConfig;

  // Initialize with all possible statuses
  const defaultData = {
    open: 0,
    pending: 0,
    closed: 0,
    archived: 0,
  };

  const dataMap = Object.fromEntries(
    data.map((item) => [item.name.toLowerCase(), item.value]),
  );

  // Filter out zero values from the formatted data
  const formattedData = Object.entries(defaultData)
    .map(([key]) => ({
      name: config[key as keyof typeof config].label,
      value: dataMap[key] ?? 0,
      status: key,
    }))
    .filter((item) => item.value > 0);

  // If all values are 0, show a message or empty state
  if (formattedData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("risk.dashboard.risk_status")}</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center text-muted-foreground">
          No data
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("risk.dashboard.risk_status")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <PieChart
            margin={{
              top: 20,
              right: 80,
              bottom: 20,
              left: 80,
            }}
            width={400}
            height={300}
          >
            <Pie
              data={formattedData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={4}
              label={({ name, value, x, y, cx, cy }) => (
                <text
                  x={x}
                  y={y}
                  dy={y > cy ? 15 : -5}
                  fill="currentColor"
                  textAnchor={x > cx ? "start" : "end"}
                  className="text-xs"
                  dx={x > cx ? 5 : -5}
                >
                  {`${name}: ${value}`}
                </text>
              )}
              labelLine={{
                strokeWidth: 1,
              }}
            >
              {formattedData.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={config[entry.status as keyof typeof config].color}
                  radius={8}
                />
              ))}
            </Pie>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
