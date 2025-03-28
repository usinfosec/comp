"use client";

import { useI18n } from "@/locales/client";
import type { Vendor } from "@bubba/db/types";
import { Button } from "@bubba/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@bubba/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@bubba/ui/chart";
import { PencilIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";
import { InherentRiskSheet } from "./inherent-risk";
import { useCallback } from "react";

interface InherentRiskChartProps {
  vendor: Vendor;
}

export function InherentRiskVendorChart({ vendor }: InherentRiskChartProps) {
  const t = useI18n();
  const [open, setOpen] = useQueryState("inherent-risk-sheet");

  // Create a stable callback function for onSuccess
  const handleSuccess = useCallback(() => {
    console.log("Closing inherent risk sheet");
    setOpen(null);
  }, [setOpen]);

  // Convert the enum values to numeric scores for display
  const getRiskScore = (risk: string) => {
    switch (risk) {
      case "unknown":
        return 10;
      case "low":
        return 30;
      case "medium":
        return 60;
      case "high":
        return 90;
      default:
        return 0;
    }
  };

  // Log the vendor data to check the structure and values
  console.log("Vendor data for inherent risk chart:", {
    id: vendor.id,
    inherentRisk: vendor.inherentRisk,
  });

  const inherentRiskScore = getRiskScore(vendor.inherentRisk);

  const data = [
    {
      metric: t("vendors.risks.inherent_risk"),
      value: inherentRiskScore,
      fullMark: 100,
    }
  ];

  const chartConfig = {
    risk: {
      label: t("vendors.risks.inherent_risk"),
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
              <div className="flex items-center justify-between gap-2">
                {t("vendors.risks.inherent_risk")}
                <Button
                  onClick={() => {
                    console.log("Inherent risk edit button clicked");
                    setOpen("true");
                  }}
                  size="icon"
                  variant="ghost"
                  className="p-0 m-0 size-auto"
                >
                  <PencilIcon className="h-3 w-3" />
                </Button>
              </div>
            </CardTitle>
            <CardDescription className="text-xs">
              {t("vendors.risks.update_inherent_risk_description")}
            </CardDescription>
          </div>
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
        <InherentRiskSheet
          vendorId={vendor.id}
          initialRisk={vendor.inherentRisk}
          onSuccess={handleSuccess}
        />
      </CardContent>
    </Card>
  );
}
