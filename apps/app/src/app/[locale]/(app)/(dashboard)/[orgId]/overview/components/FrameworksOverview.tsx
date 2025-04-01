"use client";

import type { FrameworkInstance } from "@bubba/db/types";
import { FrameworkProgress } from "./FrameworkProgress";
import { RequirementStatus } from "./RequirementStatusChart";
import type { ComplianceScoresProps, FrameworkWithCompliance } from "./types";

export interface FrameworksOverviewProps {
	frameworks: FrameworkInstance[];
	complianceScores: ComplianceScoresProps;
	frameworksWithCompliance: FrameworkWithCompliance[];
}

export const FrameworksOverview = ({
	complianceScores,
	frameworksWithCompliance,
	frameworks,
}: FrameworksOverviewProps) => {
	return (
		<div className="space-y-12">
			<div className="grid gap-4 md:grid-cols-2 select-none">
				<FrameworkProgress
					frameworks={frameworks}
					complianceScores={complianceScores}
				/>
				<RequirementStatus
					frameworks={frameworks}
					frameworksWithCompliance={frameworksWithCompliance}
				/>
			</div>
		</div>
	);
};
