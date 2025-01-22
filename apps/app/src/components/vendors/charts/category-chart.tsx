"use client";

import { useI18n } from "@/locales/client";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@bubba/ui/chart";
import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from "recharts";

interface CategoryChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

export function CategoryChart({ data }: CategoryChartProps) {
  const t = useI18n();

  const config: ChartConfig = {
    cloud: {
      label: t("vendor.category.cloud"),
      color: "hsl(var(--chart-1))",
    },
    infrastructure: {
      label: t("vendor.category.infrastructure"),
      color: "hsl(var(--chart-2))",
    },
    software_as_a_service: {
      label: t("vendor.category.software_as_a_service"),
      color: "hsl(var(--chart-3))",
    },
    finance: {
      label: t("vendor.category.finance"),
      color: "hsl(var(--chart-4))",
    },
    marketing: {
      label: t("vendor.category.marketing"),
      color: "hsl(var(--chart-4))",
    },
    sales: {
      label: t("vendor.category.sales"),
      color: "hsl(var(--chart-4))",
    },
    hr: {
      label: t("vendor.category.hr"),
      color: "hsl(var(--chart-4))",
    },
    other: {
      label: t("vendor.category.other"),
      color: "hsl(var(--chart-4))",
    },
  } satisfies ChartConfig;

  const defaultData = {
    cloud: 0,
    infrastructure: 0,
    software_as_a_service: 0,
    finance: 0,
    marketing: 0,
    sales: 0,
    hr: 0,
    other: 0,
  };

  const dataMap = Object.fromEntries(
    data.map((item) => [item.name.toLowerCase(), item.value]),
  );

  const formattedData = Object.entries(defaultData).map(([key]) => ({
    name: config[key as keyof typeof config].label,
    value: dataMap[key] ?? 0,
    category: key,
  }));

  // Calculate the maximum label width to set left margin
  const maxLabelLength = Math.max(
    ...formattedData.map((item) => item.name?.toLocaleString.length ?? 0),
  );

  const leftMargin = Math.max(maxLabelLength * 8, 50); // 8px per character, minimum 100px

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("vendor.dashboard.vendor_category")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <BarChart
            accessibilityLayer
            data={formattedData}
            layout="vertical"
            margin={{
              left: 45,
              right: 16,
            }}
          >
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={leftMargin}
              style={{
                fontSize: "12px",
              }}
            />
            <XAxis dataKey="value" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="value"
              layout="vertical"
              fill="hsl(var(--chart-1))"
              maxBarSize={30}
            >
              <LabelList
                dataKey="value"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
              {formattedData.map((entry, index) => (
                <Cell
                  name="Total"
                  key={entry.category}
                  fill={config[entry.category as keyof typeof config].color}
                  radius={8}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
