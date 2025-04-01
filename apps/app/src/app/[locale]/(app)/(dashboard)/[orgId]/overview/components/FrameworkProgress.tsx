"use client";

import { useI18n } from "@/locales/client";
import type { Control, FrameworkInstance } from "@bubba/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import type { ComplianceScoresProps } from "./types";

interface FrameworkProgressProps {
	frameworks: FrameworkInstance[];
	complianceScores: ComplianceScoresProps;
}

export function FrameworkProgress({
	frameworks,
	complianceScores,
}: FrameworkProgressProps) {
	const t = useI18n();
	const {
		policiesCompliance,
		evidenceTasksCompliance,
		cloudTestsCompliance,
		overallCompliance,
	} = complianceScores;

	const { orgId } = useParams<{ orgId: string }>();

	const CircleProgress = ({
		percentage,
		label,
		href,
	}: {
		percentage: number;
		label: ReactNode;
		href: string;
	}) => (
		<Link
			href={href}
			className="flex flex-col items-center hover:opacity-80 transition-opacity select-none"
		>
			<div className="relative h-24 w-24">
				<svg className="h-24 w-24" viewBox="0 0 100 100">
					{/* Background circle */}
					<circle
						className="stroke-muted"
						strokeWidth="8"
						fill="transparent"
						r="46"
						cx="50"
						cy="50"
					/>
					{/* Progress circle */}
					<circle
						className="stroke-primary transition-all duration-300 ease-in-out"
						strokeWidth="8"
						strokeLinecap="round"
						fill="transparent"
						r="46"
						cx="50"
						cy="50"
						strokeDasharray={`${percentage * 2.89}, 1000`}
						transform="rotate(-90 50 50)"
					/>
				</svg>
				<div className="absolute inset-0 flex flex-col items-center justify-center">
					<div className="text-xl font-semibold">{percentage}%</div>
				</div>
			</div>
			<div className="mt-2 text-center">
				<span className="text-sm font-medium leading-tight">{label}</span>
			</div>
		</Link>
	);

	if (!frameworks.length) return null;

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>{t("frameworks.overview.progress.title")}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col space-y-8">
					{/* Main compliance circle */}
					<div className="flex justify-center">
						<div className="relative h-32 w-32">
							<svg className="h-32 w-32" viewBox="0 0 100 100">
								{/* Background circle */}
								<circle
									className="stroke-muted"
									strokeWidth="8"
									fill="transparent"
									r="46"
									cx="50"
									cy="50"
								/>
								{/* Progress circle */}
								<circle
									className="stroke-primary transition-all duration-300 ease-in-out"
									strokeWidth="8"
									strokeLinecap="round"
									fill="transparent"
									r="46"
									cx="50"
									cy="50"
									strokeDasharray={`${overallCompliance * 2.89}, 1000`}
									transform="rotate(-90 50 50)"
								/>
							</svg>
							<div className="absolute inset-0 flex flex-col items-center justify-center">
								<div className="text-2xl font-semibold">
									{overallCompliance}%
								</div>
								<div className="text-xs text-muted-foreground">Compliant</div>
							</div>
						</div>
					</div>

					{/* Three smaller circles */}
					<div className="grid grid-cols-3 gap-4">
						<CircleProgress
							percentage={policiesCompliance}
							label="Policies"
							href={`/${orgId}/policies/all`}
						/>
						<CircleProgress
							percentage={evidenceTasksCompliance}
							label={
								<>
									<span className="sm:hidden">Evidence</span>
									<span className="hidden sm:inline">Evidence Tasks</span>
								</>
							}
							href={`/${orgId}/evidence/list`}
						/>
						<CircleProgress
							percentage={cloudTestsCompliance}
							label={
								<>
									<span className="sm:hidden">Tests</span>
									<span className="hidden sm:inline">Cloud Tests</span>
								</>
							}
							href={`/${orgId}/tests`}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
