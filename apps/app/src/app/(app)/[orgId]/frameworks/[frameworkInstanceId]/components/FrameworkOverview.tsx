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
					<Badge variant={getComplianceBadgeVariant()} className="text-xs">
						{compliancePercentage}% Complete
					</Badge>
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

			{/* Main Content Grid */}
			<div className="grid gap-6 lg:grid-cols-3">
				{/* Framework Details - Takes up 2 columns on large screens */}
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle className="text-xl">About This Framework</CardTitle>
						<CardDescription>
							Framework details and implementation guidance
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
							{frameworkInstanceWithControls.framework.description}
						</div>
					</CardContent>
				</Card>

				{/* Compliance Progress - Takes up 1 column */}
				<Card>
					<CardHeader className="pb-4">
						<CardTitle className="text-xl flex items-center gap-2">
							<CheckCircle2 className="h-5 w-5" />
							Compliance Status
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Progress Circle/Bar */}
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">Overall Progress</span>
								<span className={`text-2xl font-bold ${getComplianceColor()}`}>
									{compliancePercentage}%
								</span>
							</div>
							<Progress value={compliancePercentage} className="h-3" />
						</div>

						{/* Stats */}
						<div className="space-y-4">
							<div className="flex items-center justify-between py-2 border-b">
								<div className="flex items-center gap-2">
									<CheckCircle2 className="h-4 w-4 text-green-600" />
									<span className="text-sm">Completed</span>
								</div>
								<span className="font-semibold text-green-600">
									{compliantControls}
								</span>
							</div>
							<div className="flex items-center justify-between py-2 border-b">
								<div className="flex items-center gap-2">
									<Clock className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">Remaining</span>
								</div>
								<span className="font-semibold text-muted-foreground">
									{totalControls - compliantControls}
								</span>
							</div>
							<div className="flex items-center justify-between py-2">
								<span className="text-sm font-medium">Total Controls</span>
								<span className="font-bold">{totalControls}</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Delete Dialog */}
			<FrameworkDeleteDialog
				isOpen={deleteDialogOpen}
				onClose={() => setDeleteDialogOpen(false)}
				frameworkInstance={frameworkInstanceWithControls}
			/>
		</div>
	);
}
