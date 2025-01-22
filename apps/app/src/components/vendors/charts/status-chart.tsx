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

  const config: ChartConfig = {
    assessed: {
      label: t("common.status.assessed"),
      color: "hsl(var(--chart-1))",
    },
    in_progress: {
      label: t("common.status.in_progress"),
      color: "hsl(var(--chart-2))",
    },
    not_assessed: {
      label: t("common.status.not_assessed"),
      color: "hsl(var(--chart-3))",
    },
  };

  const defaultData = {
    assessed: 0,
    in_progress: 0,
    not_assessed: 0,
  };

  const dataMap = Object.fromEntries(
    data.map((item) => [item.name.toLowerCase(), item.value]),
  );

  const formattedData = Object.entries(defaultData)
    .map(([key]) => ({
      name: config[key as keyof typeof config].label,
      value: dataMap[key] ?? 0,
      status: key,
    }))
    .filter((item) => item.value > 0);

  if (formattedData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("vendor.dashboard.vendor_status")}</CardTitle>
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
        <CardTitle>{t("vendor.dashboard.vendor_status")}</CardTitle>
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
