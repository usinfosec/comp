"use client";

import { DisplayFrameworkStatus } from "@/components/frameworks/framework-status";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { useMemo } from "react";
import { useOrganizationControl } from "../hooks/useOrganizationControl";
import { useOrganizationControlProgress } from "../hooks/useOrganizationControlProgress";
import { ControlRequirementsTable } from "./table/ControlRequirementsTable";
import { SingleControlSkeleton } from "./SingleControlSkeleton";

interface SingleControlProps {
	controlId: string;
}

export const SingleControl = ({ controlId }: SingleControlProps) => {
	const { data: control, isLoading: isControlLoading } =
		useOrganizationControl(controlId);
	const { data: controlProgress, isLoading: isControlProgressLoading } =
		useOrganizationControlProgress(controlId);

	const progressStatus = useMemo(() => {
		if (!controlProgress) return "not_started";

		return controlProgress.progress?.completed > 0
			? "in_progress"
			: controlProgress.progress?.completed === 0
				? "not_started"
				: "completed";
	}, [controlProgress]);

	if (
		(!control && isControlLoading) ||
		(!controlProgress && isControlProgressLoading)
	) {
		return <SingleControlSkeleton />;
	}

	return (
		<div className="max-w-[1200px] mx-auto">
			<div className="space-y-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex md:flex-row justify-between">
								{control?.control.name}
								<DisplayFrameworkStatus status={progressStatus} />
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm">{control?.control.description}</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Domain</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm">{control?.control.domain}</p>
						</CardContent>
					</Card>
				</div>

				<div className="flex flex-col gap-2">
					{control?.OrganizationControlRequirement && (
						<ControlRequirementsTable
							data={control.OrganizationControlRequirement}
						/>
					)}
				</div>
			</div>
		</div>
	);
};
