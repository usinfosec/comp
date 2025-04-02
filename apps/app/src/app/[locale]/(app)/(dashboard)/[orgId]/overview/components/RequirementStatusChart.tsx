"use client";

import { useI18n } from "@/locales/client";
import type { FrameworkInstance } from "@bubba/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { Progress } from "@bubba/ui/progress";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { FrameworkInstanceWithComplianceScore } from "./types";

// Individual FrameworkCard component
function FrameworkCard({
	frameworkInstance,
	complianceScore,
}: {
	frameworkInstance: FrameworkInstance;
	complianceScore: number;
}) {
	const { orgId } = useParams<{ orgId: string }>();

	return (
		<Link
			href={`/${orgId}/overview/frameworks/${frameworkInstance.id}`}
			className="flex items-start gap-4 rounded-lg p-4 hover:bg-muted/40 transition-colors duration-200"
		>
			<div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden bg-muted flex items-center justify-center">
				<div className="text-lg font-bold text-muted-foreground">
					{frameworkInstance.id.substring(0, 2).toUpperCase()}
				</div>
			</div>
			<div className="flex-1 space-y-2">
				<div className="flex items-center justify-between">
					<h3 className="font-medium">{frameworkInstance.id}</h3>
					<span className="text-sm font-medium text-muted-foreground">
						{complianceScore}% Compliant
					</span>
				</div>
				<Progress
					value={complianceScore}
					className="h-2 bg-secondary [&>div]:bg-primary"
				/>
			</div>
		</Link>
	);
}

// Main component
export function RequirementStatus({
	frameworksWithComplianceScores,
}: {
	frameworksWithComplianceScores: FrameworkInstanceWithComplianceScore[];
}) {
	const t = useI18n();

	if (!frameworksWithComplianceScores.length) return null;

	return (
		<Card className="select-none">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>{t("frameworks.title")}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-8">
					{/* Framework List */}
					<div className="space-y-6">
						{frameworksWithComplianceScores.map(
							({ frameworkInstance, complianceScore }) => (
								<FrameworkCard
									key={frameworkInstance.id}
									frameworkInstance={frameworkInstance}
									complianceScore={complianceScore}
								/>
							),
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
