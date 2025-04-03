"use client";

import { useI18n } from "@/locales/client";
import type { FrameworkInstance } from "@bubba/db/types";
import { Card, CardContent } from "@bubba/ui/card";
import { cn } from "@bubba/ui/cn";
import { Progress } from "@bubba/ui/progress";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getFrameworkName } from "../lib/getFrameworkName";
import { FrameworkInstanceWithControls } from "../types";

interface FrameworkCardProps {
	frameworkInstance: FrameworkInstanceWithControls;
	complianceScore: number;
}

export function FrameworkCard({
	frameworkInstance,
	complianceScore,
}: FrameworkCardProps) {
	const { orgId } = useParams<{ orgId: string }>();
	const t = useI18n();

	const getComplianceColor = (score: number) => {
		if (score >= 80) return "text-green-500";
		if (score >= 50) return "text-yellow-500";
		return "text-red-500";
	};

	const controlsCount = frameworkInstance.controls?.length || 0;
	const compliantControlsCount = Math.round(
		(complianceScore / 100) * controlsCount,
	);

	return (
		<Card className="select-none hover:bg-muted/40 transition-colors duration-200">
			<CardContent className="pt-6">
				<Link
					href={`/${orgId}/frameworks/${frameworkInstance.id}`}
					className="flex flex-col gap-4 rounded-lg p-4 "
				>
					<div className="flex items-start gap-4">
						<div className="flex-1">
							<div className="flex items-center justify-between">
								<h2 className="font-medium text-2xl">
									{getFrameworkName(frameworkInstance.frameworkId)}
								</h2>
								<span
									className={cn(
										"text-sm font-medium",
										getComplianceColor(complianceScore),
									)}
								>
									{complianceScore}% {t("common.status.compliant")}
								</span>
							</div>
							<Progress
								value={complianceScore}
								className="h-2 mt-2 bg-secondary [&>div]:bg-primary"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4 text-sm">
						<div className="space-y-1">
							<p className="text-muted-foreground">
								{t("frameworks.controls.title")}
							</p>
							<p className="font-medium">
								{controlsCount} {t("evidence.items")}
							</p>
						</div>
						<div className="space-y-1">
							<p className="text-muted-foreground">
								{t("frameworks.controls.statuses.completed")}
							</p>
							<p className="font-medium">
								{compliantControlsCount} {t("common.status.compliant")}
							</p>
						</div>
					</div>
				</Link>
			</CardContent>
		</Card>
	);
}
