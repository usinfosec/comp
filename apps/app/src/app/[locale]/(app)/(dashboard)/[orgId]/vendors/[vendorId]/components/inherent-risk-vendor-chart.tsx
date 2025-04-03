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
import { InherentRiskSheet } from "./inherent-risk";

interface InherentRiskChartProps {
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

export function InherentRiskVendorChart({ vendor }: InherentRiskChartProps) {
	const t = useI18n();
	const [open, setOpen] = useQueryState("inherent-risk-sheet");

	// Debug information
	console.log("VENDOR DATA:", {
		inherentProbability: vendor.inherentProbability,
		inherentImpact: vendor.inherentImpact,
		probabilityScore: LIKELIHOOD_SCORES[vendor.inherentProbability],
		impactScore: IMPACT_SCORES[vendor.inherentImpact],
	});

	// Calculate risk score from probability and impact
	const riskScore =
		LIKELIHOOD_SCORES[vendor.inherentProbability] *
		IMPACT_SCORES[vendor.inherentImpact];

	// Determine risk level
	let riskLevel = "low";
	if (riskScore > 16) riskLevel = "critical";
	else if (riskScore > 9) riskLevel = "high";
	else if (riskScore > 4) riskLevel = "medium";

	// Get color based on risk level
	const riskColor = RISK_COLORS[riskLevel as keyof typeof RISK_COLORS];

	// Define the visual order of likelihood for rendering
	const VISUAL_LIKELIHOOD_ORDER: Likelihood[] = [
		Likelihood.very_likely,
		Likelihood.likely,
		Likelihood.possible,
		Likelihood.unlikely,
		Likelihood.very_unlikely,
	];

	// We'll determine the active cell while building the grid
	const yAxisLabels = [
		"V.Likely", // Corresponds to VISUAL_LIKELIHOOD_ORDER[0]
		"Likely",
		"Possible",
		"Unlikely",
		"V.Unlikely", // Corresponds to VISUAL_LIKELIHOOD_ORDER[4]
	];
	const xAxisLabels = ["Insig", "Minor", "Mod", "Major", "Severe"];

	// Store the active cell position values
	const activeProbability = vendor.inherentProbability;
	const activeImpact = vendor.inherentImpact;

	return (
		<>
			<Card>
				<CardHeader>
					<div className="flex justify-between items-center">
						<div className="w-full">
							<CardTitle>
								<div className="flex items-center justify-between gap-2">
									{t("vendors.risks.inherent_risk")}
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
								{t("vendors.risks.update_inherent_risk_description")}
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="mb-8">
						{/* 5x5 Risk Matrix */}
						<div className="relative w-full aspect-[1.5/1] max-h-[300px]">
							{/* Y-axis label */}
							<div className="absolute left-[-30px] top-1/2 -translate-y-1/2 -rotate-90 font-semibold text-sm text-muted-foreground z-10">
								Probability
							</div>

							{/* Main grid container */}
							<div className="absolute top-0 left-[90px] right-[10px] bottom-[35px]">
								<div className="relative w-full h-full border-l border-b">
									{/* Grid rows */}
									{[...Array(5)].map((_, rowIndex) => {
										// Map row index to likelihood enum based on visual order
										const rowLikelihood = VISUAL_LIKELIHOOD_ORDER[rowIndex];

										return (
											<div
												key={`row-${rowIndex}`}
												className="h-[20%] flex border-t"
											>
												{/* Grid cells for this row */}
												{[...Array(5)].map((_, colIndex) => {
													// Map column index to impact enum
													const colImpact = Object.keys(IMPACT_SCORES)[
														colIndex
													] as Impact;

													// Calculate cell score and color
													const likelihoodScore =
														LIKELIHOOD_SCORES[rowLikelihood];
													const impactScore = IMPACT_SCORES[colImpact];
													const cellScore = likelihoodScore * impactScore;

													let cellColor = RISK_COLORS.low;
													if (cellScore > 16) cellColor = RISK_COLORS.critical;
													else if (cellScore > 9) cellColor = RISK_COLORS.high;
													else if (cellScore > 4)
														cellColor = RISK_COLORS.medium;

													// Check if this is the active cell
													const isActive =
														rowLikelihood === activeProbability &&
														colImpact === activeImpact;

													return (
														<div
															key={`cell-${rowIndex}-${colIndex}`}
															className="w-[20%] border-r relative"
															style={{ backgroundColor: `${cellColor}25` }}
														>
															{isActive && (
																<div className="absolute inset-0 flex items-center justify-center">
																	<div
																		className="absolute inset-0 z-10 border-2"
																		style={{
																			backgroundColor: cellColor,
																			borderColor: cellColor,
																			opacity: 0.9,
																		}}
																	/>
																</div>
															)}
														</div>
													);
												})}
											</div>
										);
									})}

									{/* Y-axis labels - positioned outside the grid */}
									{yAxisLabels.map((label, i) => (
										<div
											key={`y-label-${i}`}
											className="absolute text-sm text-right"
											style={{
												left: "-75px",
												top: `${i * 20 + 10}%`,
												transform: "translateY(-50%)",
												width: "65px",
											}}
										>
											{label}
										</div>
									))}

									{/* X-axis labels */}
									{xAxisLabels.map((label, i) => (
										<div
											key={`x-label-${i}`}
											className="absolute text-sm text-center"
											style={{
												left: `${i * 20 + 10}%`,
												bottom: "-25px",
												transform: "translateX(-50%)",
												width: "40px",
											}}
										>
											{label}
										</div>
									))}

									{/* X-axis title */}
									<div
										className="absolute font-semibold text-sm text-muted-foreground"
										style={{
											bottom: "-45px",
											left: "50%",
											transform: "translateX(-50%)",
										}}
									>
										Impact
									</div>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
			<InherentRiskSheet
				vendorId={vendor.id}
				initialProbability={vendor.inherentProbability}
				initialImpact={vendor.inherentImpact}
			/>
		</>
	);
}
