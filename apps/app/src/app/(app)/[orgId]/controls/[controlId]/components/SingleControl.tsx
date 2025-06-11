"use client";

import { StatusIndicator } from "@/components/status-indicator";
import type {
	Control,
	FrameworkEditorFramework,
	FrameworkEditorRequirement,
	FrameworkInstance,
	Policy,
	RequirementMap,
	Task,
} from "@comp/db/types";
import { Button } from "@comp/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@comp/ui/dropdown-menu";
import { MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { ControlDeleteDialog } from "./ControlDeleteDialog";
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

export function SingleControl({
	control,
	controlProgress,
	relatedPolicies,
	relatedTasks,
}: SingleControlProps) {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const params = useParams<{ orgId: string; controlId: string }>();
	const orgIdFromParams = params.orgId;
	const controlIdFromParams = params.controlId;

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
			{/* Control Header */}
			<div className="space-y-3">
				<div className="flex items-start justify-between gap-4">
					<div className="min-w-0 flex-1">
						<div className="flex items-center gap-2 mb-2">
							<h1 className="text-xl font-semibold truncate">{control.name}</h1>
							<StatusIndicator status={progressStatus} />
						</div>
						{control.description && (
							<p className="text-sm text-muted-foreground leading-relaxed">
								{control.description}
							</p>
						)}
					</div>
					<DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
						<DropdownMenuTrigger asChild>
							<Button
								size="sm"
								variant="ghost"
								className="shrink-0"
							>
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() => {
									setDropdownOpen(false);
									setDeleteDialogOpen(true);
								}}
								className="text-destructive focus:text-destructive"
							>
								<Trash2 className="h-4 w-4 mr-2" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Content Sections */}
			<div className="space-y-6">
				<RequirementsTable
					requirements={control.requirementsMapped}
					orgId={orgIdFromParams}
				/>
				<PoliciesTable
					policies={relatedPolicies}
					orgId={orgIdFromParams}
					controlId={controlIdFromParams}
				/>
				<TasksTable
					tasks={relatedTasks}
					orgId={orgIdFromParams}
					controlId={controlIdFromParams}
				/>
			</div>

			{/* Delete Dialog */}
			<ControlDeleteDialog
				isOpen={deleteDialogOpen}
				onClose={() => setDeleteDialogOpen(false)}
				control={control}
			/>
		</div>
	);
}
