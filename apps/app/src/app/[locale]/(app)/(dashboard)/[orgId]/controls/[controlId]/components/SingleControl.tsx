"use client";

import { StatusIndicator } from "@/components/status-indicator";
import { useI18n } from "@/locales/client";
import type {
	Control,
	FrameworkEditorFramework,
	FrameworkEditorRequirement,
	FrameworkInstance,
	Policy,
	RequirementMap,
	Task,
} from "@comp/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import type { ControlProgressResponse } from "../data/getOrganizationControlProgress";
import { PoliciesTable } from "./PoliciesTable";
import { RequirementsTable } from "./RequirementsTable";
import { SingleControlSkeleton } from "./SingleControlSkeleton";
import { TasksTable } from "./TasksTable";

interface SingleControlProps {
	control: Control & {
		requirementsMapped: (RequirementMap & {
			frameworkInstance: FrameworkInstance & {
				framework: FrameworkEditorFramework;
			};
			requirement: FrameworkEditorRequirement;
		})[];
	};
	controlProgress: ControlProgressResponse;
	relatedPolicies: Policy[];
	relatedTasks: Task[];
}

export const SingleControl = ({
	control,
	controlProgress,
	relatedPolicies = [],
	relatedTasks = [],
}: SingleControlProps) => {
	const t = useI18n();
	const params = useParams();
	const orgId = params.orgId as string;
	const controlId = params.controlId as string;

	const progressStatus = useMemo(() => {
		if (!controlProgress) return "not_started";
		if (controlProgress.total === controlProgress.completed)
			return "completed";
		if (controlProgress.completed > 0) return "in_progress";

		// Check if any task is not "todo" or any policy is not "draft"
		const anyTaskInProgress = relatedTasks.some(
			(task) => task.status !== "todo",
		);
		const anyPolicyInProgress = relatedPolicies.some(
			(policy) => policy.status !== "draft",
		);
		if (anyTaskInProgress || anyPolicyInProgress) return "in_progress";

		return "not_started";
	}, [controlProgress, relatedPolicies, relatedTasks]);

	if (!control || !controlProgress) {
		return <SingleControlSkeleton />;
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<div>
							<span className="text-sm text-muted-foreground">
								{t("frameworks.controls.title")}
							</span>
							<h1 className="text-2xl font-semibold">
								{control.name}
							</h1>
						</div>
						<StatusIndicator status={progressStatus} />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						{control.description}
					</p>
				</CardContent>
			</Card>
			<RequirementsTable
				requirements={control.requirementsMapped}
				orgId={orgId}
			/>
			<PoliciesTable
				policies={relatedPolicies}
				orgId={orgId}
				controlId={controlId}
			/>
			<TasksTable
				tasks={relatedTasks}
				orgId={orgId}
				controlId={controlId}
			/>
		</div>
	);
};
