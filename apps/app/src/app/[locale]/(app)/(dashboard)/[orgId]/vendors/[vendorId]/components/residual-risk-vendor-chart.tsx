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
import { ResidualRiskSheet } from "./residual-risk";
import { useCallback } from "react";

interface ResidualRiskChartProps {
	vendor: Vendor;
}

export function ResidualRiskVendorChart({ vendor }: ResidualRiskChartProps) {
	const t = useI18n();
	const [open, setOpen] = useQueryState("residual-risk-sheet");

	// Log when the sheet open state changes for debugging
	console.log("Residual risk sheet query state:", { open });

	// Log the vendor data to check the structure and values
	console.log("Vendor residual risk data:", {
		id: vendor.id,
		residualRisk: vendor.residualProbability,
	});

	// Create a stable callback function for onSuccess
	const handleSuccess = useCallback(() => {
		console.log("Closing residual risk sheet");
		setOpen(null);
	}, [setOpen]);

	// Convert the enum values to numeric scores for display
	const getRiskScore = (risk: string) => {
		switch (risk) {
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

	const residualRiskScore = getRiskScore(vendor.residualProbability);

	const data = [
		{
			metric: t("vendors.risks.residual_risk"),
			value: residualRiskScore,
			fullMark: 100,
		},
	];

	const chartConfig = {
		risk: {
			label: t("vendors.risks.residual_risk"),
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
								{t("vendors.risks.residual_risk")}
								<Button
									onClick={() => {
										console.log("Residual risk edit button clicked");
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
							{t("vendors.risks.update_residual_risk_description")}
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
				<ResidualRiskSheet
					vendorId={vendor.id}
					initialRisk={vendor.residualProbability}
					onSuccess={handleSuccess}
				/>
			</CardContent>
		</Card>
	);
}
