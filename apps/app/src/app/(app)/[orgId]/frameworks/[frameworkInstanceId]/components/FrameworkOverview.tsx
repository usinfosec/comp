"use client";

import { Badge } from "@comp/ui/badge";
import { Button } from "@comp/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@comp/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@comp/ui/dropdown-menu";
import { Progress } from "@comp/ui/progress";
import { Control, Task } from "@comp/db/types";
import { MoreVertical, Trash2, CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";
import { getControlStatus } from "../../lib/utils";
import { FrameworkInstanceWithControls } from "../../types";
import { FrameworkDeleteDialog } from "./FrameworkDeleteDialog";

interface FrameworkOverviewProps {
	frameworkInstanceWithControls: FrameworkInstanceWithControls;
	tasks: (Task & { controls: Control[] })[];
}

export function FrameworkOverview({
	frameworkInstanceWithControls,
	tasks,
}: FrameworkOverviewProps) {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	
	// Get all controls from all requirements
	const allControls = frameworkInstanceWithControls.controls;
	const totalControls = allControls.length;

	// Calculate compliant controls (all artifacts completed)
	const compliantControls = allControls.filter(
		(control: any) =>
			getControlStatus(control.policies, tasks, control.id) ===
			"completed",
	).length;

	// Calculate compliance percentage based on compliant controls
	const compliancePercentage =
		totalControls > 0
			? Math.round((compliantControls / totalControls) * 100)
			: 0;

	const getComplianceColor = () => {
		if (compliancePercentage >= 80) return "text-green-600";
		if (compliancePercentage >= 60) return "text-yellow-600";
		return "text-red-600";
	};

	const getComplianceBadgeVariant = () => {
		if (compliancePercentage >= 80) return "default";
		if (compliancePercentage >= 60) return "secondary";
		return "destructive";
	};

	return (
		<div className="space-y-8">
			{/* Framework Header */}
			<div className="flex items-start justify-between">
				<div className="space-y-2">
					<h1 className="text-4xl font-bold tracking-tight">
						{frameworkInstanceWithControls.framework.name}
					</h1>
					<p className="text-muted-foreground text-sm max-w-2xl">
						{frameworkInstanceWithControls.framework.description}
					</p>
				</div>
				<DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
					<DropdownMenuTrigger asChild>
						<Button
							size="icon"
							variant="ghost"
							className="h-8 w-8"
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
							Delete Framework
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Compliance Status - Full Width Focus */}
			<Card>
				<CardHeader className="pb-4">
					<CardTitle className="text-2xl flex items-center gap-2">
						<CheckCircle2 className="h-6 w-6" />
						Compliance Status
					</CardTitle>
					<CardDescription>
						Track your progress across all framework controls
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-8 md:grid-cols-2">
						{/* Progress Section */}
						<div className="space-y-4">
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">Overall Progress</span>
									<span className={`text-3xl font-bold ${getComplianceColor()}`}>
										{compliancePercentage}%
									</span>
								</div>
								<Progress value={compliancePercentage} className="h-4" />
								<Badge variant={getComplianceBadgeVariant()} className="w-fit">
									{compliancePercentage >= 80 ? 'Excellent' : compliancePercentage >= 60 ? 'Good Progress' : 'Needs Attention'}
								</Badge>
							</div>
						</div>

						{/* Stats Section */}
						<div className="space-y-4">
							<div className="grid gap-4">
								<div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
									<div className="flex items-center gap-2">
										<CheckCircle2 className="h-4 w-4 text-green-600" />
										<span className="text-sm font-medium">Completed</span>
									</div>
									<span className="text-lg font-bold text-green-600">
										{compliantControls}
									</span>
								</div>
								<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
									<div className="flex items-center gap-2">
										<Clock className="h-4 w-4 text-muted-foreground" />
										<span className="text-sm font-medium">Remaining</span>
									</div>
									<span className="text-lg font-bold text-muted-foreground">
										{totalControls - compliantControls}
									</span>
								</div>
								<div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
									<span className="text-sm font-medium">Total Controls</span>
									<span className="text-lg font-bold text-blue-600">{totalControls}</span>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Delete Dialog */}
			<FrameworkDeleteDialog
				isOpen={deleteDialogOpen}
				onClose={() => setDeleteDialogOpen(false)}
				frameworkInstance={frameworkInstanceWithControls}
			/>
		</div>
	);
}
