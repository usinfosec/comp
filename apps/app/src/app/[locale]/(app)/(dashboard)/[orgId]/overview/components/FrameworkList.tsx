"use client";

import { useI18n } from "@/locales/client";
import type { FrameworkInstanceWithComplianceScore } from "./types";
import { FrameworkCard } from "./FrameworkCard";

export function FrameworkList({
	frameworksWithComplianceScores,
}: {
	frameworksWithComplianceScores: FrameworkInstanceWithComplianceScore[];
}) {
	if (!frameworksWithComplianceScores.length) return null;

	return (
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
	);
}
