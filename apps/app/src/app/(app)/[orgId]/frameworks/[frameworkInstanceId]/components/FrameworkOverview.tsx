"use client";

import { Badge } from "@comp/ui/badge";
import { Button } from "@comp/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@comp/ui/dropdown-menu";
import { Progress } from "@comp/ui/progress";
import { Control, Task } from "@comp/db/types";
import { MoreVertical, Trash2 } from "lucide-react";
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

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<h1 className="text-2xl font-bold">{frameworkInstanceWithControls.framework.name}</h1>
						<DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
							<DropdownMenuTrigger asChild>
								<Button
									size="icon"
									variant="ghost"
									className="p-2 m-0 size-auto"
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
					</CardTitle>
				</CardHeader>
				<CardContent>
						{frameworkInstanceWithControls.framework.description}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Compliance Progress</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-2">
						<Progress value={compliancePercentage} />
						<p className="text-sm text-muted-foreground">
							{compliantControls} of {totalControls} controls
							compliant
						</p>
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
