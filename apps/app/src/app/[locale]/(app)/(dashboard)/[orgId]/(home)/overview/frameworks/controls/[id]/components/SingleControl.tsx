"use client";

import { DisplayFrameworkStatus } from "@/components/frameworks/framework-status";
import type {
	Control,
	OrganizationControl,
	OrganizationControlRequirement,
	OrganizationEvidence,
	OrganizationPolicy,
} from "@bubba/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { useMemo } from "react";
import type { ControlProgressResponse } from "../data/getOrganizationControlProgress";
import { SingleControlSkeleton } from "./SingleControlSkeleton";
import { ControlRequirementsTable } from "./table/ControlRequirementsTable";

interface SingleControlProps {
	organizationControl: OrganizationControl & {
		control: Control;
		OrganizationControlRequirement: (OrganizationControlRequirement & {
			organizationPolicy: OrganizationPolicy | null;
			organizationEvidence: OrganizationEvidence | null;
		})[];
	};
	organizationControlProgress: ControlProgressResponse;
}

export const SingleControl = ({
	organizationControl,
	organizationControlProgress,
}: SingleControlProps) => {
	const progressStatus = useMemo(() => {
		if (!organizationControlProgress) return "not_started";

		return organizationControlProgress.total ===
			organizationControlProgress.completed
			? "completed"
			: organizationControlProgress.completed > 0
				? "in_progress"
				: "not_started";
	}, [organizationControlProgress]);

	if (!organizationControl || !organizationControlProgress) {
		return <SingleControlSkeleton />;
	}

	return (
		<div className="max-w-[1200px] mx-auto">
			<div className="space-y-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex md:flex-row justify-between">
								{organizationControl.control.name}
								<DisplayFrameworkStatus status={progressStatus} />
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm">
								{organizationControl.control.description}
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Domain</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm">{organizationControl.control.domain}</p>
						</CardContent>
					</Card>
				</div>

				<div className="flex flex-col gap-2">
					{organizationControl.OrganizationControlRequirement && (
						<ControlRequirementsTable
							data={organizationControl.OrganizationControlRequirement}
						/>
					)}
				</div>
			</div>
		</div>
	);
};
