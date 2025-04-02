"use client";

import { DisplayFrameworkStatus } from "@/components/frameworks/framework-status";
import type { Control, RequirementMap } from "@bubba/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { useMemo } from "react";
import type { ControlProgressResponse } from "../data/getOrganizationControlProgress";
import { SingleControlSkeleton } from "./SingleControlSkeleton";
import { useI18n } from "@/locales/client";

interface SingleControlProps {
	control: Control & {
		requirementsMapped: RequirementMap[];
	};
	controlProgress: ControlProgressResponse;
}

export const SingleControl = ({
	control,
	controlProgress,
}: SingleControlProps) => {
	const t = useI18n();
	const progressStatus = useMemo(() => {
		if (!controlProgress) return "not_started";

		return controlProgress.total === controlProgress.completed
			? "completed"
			: controlProgress.completed > 0
				? "in_progress"
				: "not_started";
	}, [controlProgress]);

	if (!control || !controlProgress) {
		return <SingleControlSkeleton />;
	}

	return (
		<div className="max-w-[1200px] mx-auto">
			<div className="space-y-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex md:flex-row justify-between">
								{control.name}
								<DisplayFrameworkStatus status={progressStatus} />
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm">{control.description}</p>
						</CardContent>
					</Card>
				</div>

				<div className="flex flex-col gap-2">
					{control.requirementsMapped.map((requirement) => (
						<div key={requirement.id}>{requirement.requirementId}</div>
					))}
					{control.requirementsMapped.length === 0 && (
						<div className="text-sm text-muted-foreground">
							{t("controls.requirements.no_requirements_mapped")}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
