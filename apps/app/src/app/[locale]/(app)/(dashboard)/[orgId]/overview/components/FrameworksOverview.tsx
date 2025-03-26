"use client";

import type {
	Framework,
	OrganizationControl,
	OrganizationFramework,
} from "@bubba/db/types";
import type { ComplianceScoresProps, FrameworkWithCompliance } from "./types";
import { FrameworkProgress } from "./FrameworkProgress";
import { RequirementStatus } from "./RequirementStatusChart";

export interface FrameworksOverviewProps {
	frameworks: (OrganizationFramework & {
		organizationControl: OrganizationControl[];
		framework: Framework;
	})[];
	complianceScores: ComplianceScoresProps;
	frameworksWithCompliance: FrameworkWithCompliance[];
}

export const FrameworksOverview = ({
	frameworks,
	complianceScores,
	frameworksWithCompliance,
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
