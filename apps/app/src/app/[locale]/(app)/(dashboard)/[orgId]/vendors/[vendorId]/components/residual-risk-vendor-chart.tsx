"use client";

import { useI18n } from "@/locales/client";
import type { Vendor } from "@comp/db/types";
import { Impact, Likelihood } from "@prisma/client";
import { Button } from "@comp/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@comp/ui/card";
import { PencilIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { ResidualRiskSheet } from "./residual-risk";

interface ResidualRiskChartProps {
	vendor: Vendor;
}

// Map enum values to numeric scores (1-5)
const LIKELIHOOD_SCORES: Record<Likelihood, number> = {
	very_unlikely: 1,
	unlikely: 2,
	possible: 3,
	likely: 4,
	very_likely: 5,
};

const IMPACT_SCORES: Record<Impact, number> = {
	insignificant: 1,
	minor: 2,
	moderate: 3,
	major: 4,
	severe: 5,
};

// Risk level colors
const RISK_COLORS = {
	low: "#22c55e", // green
	medium: "#f59e0b", // amber
	high: "#f97316", // orange
	critical: "#ef4444", // red
};

export function ResidualRiskVendorChart({ vendor }: ResidualRiskChartProps) {
	const t = useI18n();
	const [, setOpen] = useQueryState("residual-risk-sheet");

	// Calculate risk score from probability and impact
	const riskScore =
		LIKELIHOOD_SCORES[vendor.residualProbability] *
		IMPACT_SCORES[vendor.residualImpact];

	// Determine risk level
	let riskLevel = "low";
	if (riskScore > 16) riskLevel = "critical";
	else if (riskScore > 9) riskLevel = "high";
	else if (riskScore > 4) riskLevel = "medium";

	// Define the visual order for rows and columns
	const VISUAL_LIKELIHOOD_ORDER: Likelihood[] = [
		Likelihood.very_likely,
		Likelihood.likely,
		Likelihood.possible,
		Likelihood.unlikely,
		Likelihood.very_unlikely,
	];
	const VISUAL_IMPACT_ORDER: Impact[] = [
		Impact.insignificant,
		Impact.minor,
		Impact.moderate,
		Impact.major,
		Impact.severe,
	];

	const yAxisLabels = [
		"Very Likely", // Corresponds to VISUAL_LIKELIHOOD_ORDER[0]
		"Likely",
		"Possible",
		"Unlikely",
		"Very Unlikely", // Corresponds to VISUAL_LIKELIHOOD_ORDER[4]
	];
	const xAxisLabels = ["Insignificant", "Minor", "Moderate", "Major", "Severe"];

	// Store the active cell position values
	const activeProbability = vendor.residualProbability;
	const activeImpact = vendor.residualImpact;

	return (
		<>
			<Card>
				<CardHeader>
					<div className="flex justify-between items-center">
						<div className="w-full">
							<CardTitle>
								<div className="flex items-center justify-between gap-2">
									{t("vendors.risks.residual_risk")}
									<Button
										onClick={() => setOpen("true")}
										size="icon"
										variant="ghost"
										className="p-0 m-0 size-auto"
									>
										<PencilIcon className="h-4 w-4" />
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
					<div
						className="grid w-full max-h-[350px] aspect-[1.5/1] gap-1 
								   grid-cols-1 grid-rows-1 
								   lg:grid-cols-[auto_auto_1fr] lg:grid-rows-[1fr_auto_auto]"
					>
						{/* Y-axis Title - Hidden on small/medium screens */}
						<div className="hidden lg:grid place-items-center lg:row-start-1 lg:col-start-1">
							<span className="-rotate-90 font-semibold text-sm text-muted-foreground whitespace-nowrap">
								Probability
							</span>
						</div>

						{/* Y-axis Labels Area - Hidden on small/medium screens */}
						<div className="hidden lg:grid grid-rows-5 lg:row-start-1 lg:col-start-2 pr-2">
							{yAxisLabels.map((label, i) => (
								<div
									key={`y-label-${i}`}
									className="grid place-items-center justify-end text-sm"
								>
									{label}
								</div>
							))}
						</div>

						{/* 5x5 Matrix Grid - Spans full area on small/medium screens */}
						<div className="grid grid-cols-5 grid-rows-5 border-l border-b row-start-1 col-start-1 lg:col-start-3 lg:row-start-1">
							{VISUAL_LIKELIHOOD_ORDER.map((rowLikelihood, rowIndex) =>
								VISUAL_IMPACT_ORDER.map((colImpact, colIndex) => {
									const likelihoodScore = LIKELIHOOD_SCORES[rowLikelihood];
									const impactScore = IMPACT_SCORES[colImpact];
									const cellScore = likelihoodScore * impactScore;

									let cellColor = RISK_COLORS.low;
									if (cellScore > 16) cellColor = RISK_COLORS.critical;
									else if (cellScore > 9) cellColor = RISK_COLORS.high;
									else if (cellScore > 4) cellColor = RISK_COLORS.medium;

									const isActive =
										rowLikelihood === activeProbability &&
										colImpact === activeImpact;

									return (
										<div
											key={`cell-${rowIndex}-${colIndex}`}
											className="border-t border-r relative"
											style={{ backgroundColor: `${cellColor}25` }}
										>
											{isActive && (
												<div
													className="absolute inset-0 z-10 border"
													style={{
														backgroundColor: cellColor,
														borderColor: cellColor,
														opacity: 0.9,
													}}
												/>
											)}
										</div>
									);
								}),
							)}
						</div>

						{/* X-axis Labels Area - Hidden on small/medium screens */}
						<div className="hidden lg:grid grid-cols-5 lg:col-start-3 lg:row-start-2 pt-1">
							{xAxisLabels.map((label, i) => (
								<div
									key={`x-label-${i}`}
									className="grid place-items-center text-sm"
								>
									{label}
								</div>
							))}
						</div>

						{/* X-axis Title - Hidden on small/medium screens */}
						<div className="hidden lg:grid place-items-center lg:col-start-3 lg:row-start-3 pt-1">
							<span className="font-semibold text-sm text-muted-foreground">
								Impact
							</span>
						</div>
					</div>
				</CardContent>
			</Card>
			<ResidualRiskSheet vendorId={vendor.id} initialRisk={vendor} />
		</>
	);
}
