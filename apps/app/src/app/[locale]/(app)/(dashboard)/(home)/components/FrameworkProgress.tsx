"use client";

import { useComplianceScores } from "@/hooks/use-compliance-scores";
import { useI18n } from "@/locales/client";
import type {
	Framework,
	OrganizationControl,
	OrganizationFramework,
} from "@bubba/db";
import { Button } from "@bubba/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { FileStack } from "lucide-react";
import Link from "next/link";
import { useMediaQuery } from "@bubba/ui/hooks";
import type { ReactNode } from "react";

interface Props {
	frameworks: (OrganizationFramework & {
		organizationControl: OrganizationControl[];
		framework: Framework;
	})[];
}

export function FrameworkProgress({ frameworks }: Props) {
	const t = useI18n();
	const {
		policiesCompliance,
		evidenceTasksCompliance,
		cloudTestsCompliance,
		overallCompliance,
		isLoading,
	} = useComplianceScores({ frameworks });

	const isMobile = useMediaQuery("(max-width: 640px)");

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
			className="flex flex-col items-center hover:opacity-80 transition-opacity"
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

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>{t("frameworks.overview.progress.title")}</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="flex flex-col items-center justify-center py-8 text-center">
						<div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
						<p className="mt-4 text-sm text-muted-foreground">
							Loading compliance data...
						</p>
					</div>
				) : frameworks.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-8 text-center">
						<FileStack className="h-12 w-12 text-muted-foreground/50" />
						<h3 className="mt-4 text-lg font-semibold">
							{t("frameworks.overview.progress.empty.title")}
						</h3>
						<p className="mt-2 text-sm text-muted-foreground">
							{t("frameworks.overview.progress.empty.description")}
						</p>
						<Button asChild className="mt-4">
							<Link href="/overview/frameworks">
								{t("frameworks.overview.progress.empty.action")}
							</Link>
						</Button>
					</div>
				) : (
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
								href="/policies/all"
							/>
							<CircleProgress
								percentage={evidenceTasksCompliance}
								label={
									<>
										<span className="sm:hidden">Evidence</span>
										<span className="hidden sm:inline">Evidence Tasks</span>
									</>
								}
								href="/evidence/list"
							/>
							<CircleProgress
								percentage={cloudTestsCompliance}
								label={
									<>
										<span className="sm:hidden">Tests</span>
										<span className="hidden sm:inline">Cloud Tests</span>
									</>
								}
								href="/tests"
							/>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
