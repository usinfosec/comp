"use client";

import { useI18n } from "@/locales/client";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import type { ChartConfig } from "@bubba/ui/chart";
import { ChartTooltip } from "@bubba/ui/chart";
import { DonutChart } from "./donut-chart";

interface StatusChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

export function StatusChart({ data }: StatusChartProps) {
  const t = useI18n();

  const config: ChartConfig = {
    open: {
      label: t("common.status.open"),
      color: "var(--chart-open)",
    },
    pending: {
      label: t("common.status.pending"),
      color: "var(--chart-pending)",
    },
    closed: {
      label: t("common.status.closed"),
      color: "var(--chart-closed)",
    },
    archived: {
      label: t("common.status.archived"),
      color: "var(--chart-archived)",
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
      name: config[key as keyof typeof config].label as string,
      value: dataMap[key] ?? 0,
      status: key,
    }))
    .filter((item) => item.value > 0);

  const colors = Object.values(config).map((item) => item.color as string);

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
        <DonutChart data={formattedData} colors={colors} />
      </CardContent>
    </Card>
  );
}
