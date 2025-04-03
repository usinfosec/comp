"use client";

import { ResidualRiskSheet } from "@/components/sheets/residual-risk";
import { useI18n } from "@/locales/client";
import type { Risk, Likelihood, Impact } from "@comp/db/types";
import { Button } from "@comp/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@comp/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@comp/ui/chart";
import { PencilIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";

const likelihoodToNumber: Record<Likelihood, number> = {
  very_unlikely: 1,
  unlikely: 3,
  possible: 5,
  likely: 7,
  very_likely: 10,
};

const impactToNumber: Record<Impact, number> = {
  insignificant: 1,
  minor: 3,
  moderate: 5,
  major: 7,
  severe: 10,
};

interface ResidualRiskChartProps {
  risk: Risk;
}

export function ResidualRiskChart({ risk }: ResidualRiskChartProps) {
  const t = useI18n();
  const [open, setOpen] = useQueryState("residual-risk-sheet");

  const probabilityScore = likelihoodToNumber[risk.residualLikelihood] * 10;
  const impactScore = impactToNumber[risk.residualImpact] * 10;
  const residualRisk = (probabilityScore * impactScore) / 100;

  const data = [
    {
      metric: t("risk.metrics.probability"),
      value: probabilityScore,
      fullMark: 100,
    },
    {
      metric: t("risk.metrics.impact"),
      value: impactScore,
      fullMark: 100,
    },
    {
      metric: t("risk.metrics.residualRisk"),
      value: residualRisk,
      fullMark: 100,
    },
  ];

  const chartConfig = {
    risk: {
      label: t("risk.metrics.residualRisk"),
      theme: {
        light: "#ef4444",
        dark: "#dc2626",
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>
              {t("risk.metrics.residualRisk")}
            </CardTitle>
            <CardDescription className="text-xs">
              {t("risk.dashboard.residual_risk_description")}
            </CardDescription>
          </div>
          <Button
            onClick={() => setOpen("true")}
            size="icon"
            variant="ghost"
            className="p-0 m-0 size-auto"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <RadarChart data={data}>
            <PolarGrid gridType="polygon" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: "currentColor", fontSize: 12 }}
            />
            <PolarRadiusAxis
              domain={[0, 100]}
              tick={{ fill: "currentColor", fontSize: 12 }}
            />
            <Radar
              name="risk"
              dataKey="value"
              stroke="var(--color-risk)"
              fill="var(--color-risk)"
              fillOpacity={0.5}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
          </RadarChart>
        </ChartContainer>
        <ResidualRiskSheet
          riskId={risk.id}
          initialProbability={likelihoodToNumber[risk.residualLikelihood]}
          initialImpact={impactToNumber[risk.residualImpact]}
        />
      </CardContent>
    </Card>
  );
}
