"use client";

import type {
	Framework,
	OrganizationControl,
	OrganizationFramework,
} from "@bubba/db/types";
import { FrameworkProgress } from "./FrameworkProgress";
import { RequirementStatus } from "./RequirementStatusChart";

export const FrameworksOverview = ({
	frameworks,
}: {
	frameworks: (OrganizationFramework & {
		organizationControl: OrganizationControl[];
		framework: Framework;
	})[];
}) => {
	return (
		<div className="space-y-12">
			<div className="grid gap-4 md:grid-cols-2 select-none">
				<FrameworkProgress frameworks={frameworks} />
				<RequirementStatus frameworks={frameworks} />
			</div>
		</div>
	);
};
