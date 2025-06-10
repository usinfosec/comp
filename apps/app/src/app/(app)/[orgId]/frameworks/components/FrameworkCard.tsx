"use client";

import type { Task, Control } from "@comp/db/types";
import { Badge } from "@comp/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@comp/ui/card";
import { Progress } from "@comp/ui/progress";
import { cn } from "@comp/ui/cn";
import { ClipboardCheck, ClipboardList, Clock } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { FrameworkInstanceWithControls } from "../types";

interface FrameworkCardProps {
	frameworkInstance: FrameworkInstanceWithControls;
	complianceScore?: number;
	tasks: (Task & { controls: Control[] })[];
}

export function FrameworkCard({
	frameworkInstance,
	complianceScore = 0,
	tasks,
}: FrameworkCardProps) {
	const { orgId } = useParams<{ orgId: string }>();

	const getStatusBadge = (score: number) => {
		if (score >= 95)
			return {
				label: "Compliant",
				variant: "default" as const,
			};
		if (score >= 80)
			return {
				label: "Nearly Compliant",
				variant: "secondary" as const,
			};
		if (score >= 50)
			return {
				label: "In Progress",
				variant: "outline" as const,
			};
		return {
			label: "Needs Attention",
			variant: "destructive" as const,
		};
	};

	const controlsCount = frameworkInstance.controls?.length || 0;
	const compliantControlsCount = Math.round(
		(complianceScore / 100) * controlsCount,
	);

	// Calculate not started controls: controls where all policies are draft or non-existent AND all tasks are todo or non-existent
	const notStartedControlsCount =
		frameworkInstance.controls?.filter((control) => {
			// If a control has no policies and no tasks, it's not started.
			const controlTasks = tasks.filter((task) =>
				task.controls.some((c) => c.id === control.id),
			);

			if (
				(!control.policies || control.policies.length === 0) &&
				controlTasks.length === 0
			) {
				return true;
			}

			// Check if ALL policies are in draft state or non-existent
			const policiesNotStarted =
				!control.policies ||
				control.policies.length === 0 ||
				control.policies.every((policy) => policy.status === "draft");

			// Check if ALL tasks are in todo state or there are no tasks
			const tasksNotStarted =
				controlTasks.length === 0 ||
				controlTasks.every((task) => task.status === "todo");

			return policiesNotStarted && tasksNotStarted;
			// If either any policy is not draft or any task is not todo, it's in progress
		}).length || 0;

	// Calculate in progress controls: Total - Compliant - Not Started
	const inProgressCount = Math.max(
		0, // Ensure count doesn't go below zero
		controlsCount - compliantControlsCount - notStartedControlsCount,
	);

	// Use direct framework data:
	const frameworkDetails = frameworkInstance.framework;
	const statusBadge = getStatusBadge(complianceScore);

	// Calculate last activity date - use current date as fallback
	const lastActivityDate = new Date().toISOString().slice(0, 10);

	return (
		<Link
			href={`/${orgId}/frameworks/${frameworkInstance.id}`}
			className="block"
		>
			<Card className="h-full flex flex-col hover:bg-accent/50 transition-colors">
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<span className="truncate">{frameworkDetails.name}</span>
						<Badge 
							variant={statusBadge.variant}
							className="hidden md:block shrink-0"
						>
							{statusBadge.label}
						</Badge>
					</CardTitle>
					<CardDescription className="flex items-start justify-between gap-4">
						<p className="line-clamp-2 flex-1">
							{frameworkDetails.description}
						</p>
				
					</CardDescription>
				</CardHeader>
				
				<CardContent className="flex-1 space-y-4">
					<div className="space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">Status</span>
							<span className="font-medium">
								{complianceScore}%
							</span>
						</div>
						<Progress value={complianceScore} className="h-2" />
					</div>

					<div className="grid grid-cols-3 gap-4">
						<div className="space-y-1">
							<div className="flex items-center text-muted-foreground">
								<ClipboardList className="h-4 w-4 mr-1" />
								<span className="text-xs">Controls</span>
							</div>
							<p className="font-medium text-sm">
								{controlsCount}
							</p>
						</div>
						<div className="space-y-1">
							<div className="flex items-center text-muted-foreground">
								<ClipboardCheck className="h-4 w-4 mr-1" />
								<span className="text-xs">Completed</span>
							</div>
							<p className="font-medium text-sm">
								{compliantControlsCount} / {controlsCount}
							</p>
						</div>
						<div className="space-y-1">
							<div className="flex items-center text-muted-foreground">
								<Clock className="h-4 w-4 mr-1" />
								<span className="text-xs">In Progress</span>
							</div>
							<p className="font-medium text-sm">
								{inProgressCount} / {controlsCount}
							</p>
						</div>
					</div>
				</CardContent>
				
				<CardFooter className="text-xs text-muted-foreground">
					<div className="flex items-center">
						<Clock className="h-4 w-4 mr-2" />
						Last Updated: {lastActivityDate}
					</div>
				</CardFooter>
			</Card>
		</Link>
	);
}
