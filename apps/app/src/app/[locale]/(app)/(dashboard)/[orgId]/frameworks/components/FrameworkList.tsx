"use client";

import { useI18n } from "@/locales/client";
import type { FrameworkInstanceWithComplianceScore } from "./types";
import { FrameworkCard } from "./FrameworkCard";

export function FrameworkList({
	frameworksWithControlsAndComplianceScores,
}: {
	frameworksWithControlsAndComplianceScores: FrameworkInstanceWithComplianceScore[];
}) {
	if (!frameworksWithControlsAndComplianceScores.length) return null;

	return (
		<div className="space-y-6">
			{frameworksWithControlsAndComplianceScores.map(
				({ frameworkInstance, complianceScore }) => (
					<FrameworkCard
						key={frameworkInstance.id}
						frameworkInstance={frameworkInstance}
						complianceScore={complianceScore}
					/>
				),
			)}
		</div>
	);
}
