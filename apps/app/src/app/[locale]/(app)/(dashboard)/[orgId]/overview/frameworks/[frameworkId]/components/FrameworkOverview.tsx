"use client";

import type { FrameworkInstance } from "@bubba/db/types";
import { Badge } from "@bubba/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { Progress } from "@bubba/ui/progress";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { FrameworkRequirements } from "../data/getFrameworkRequirements";
import { getControlStatus } from "../lib/utils";

interface FrameworkOverviewProps {
	requirements: FrameworkRequirements;
	frameworkInstance: FrameworkInstance;
}

export function FrameworkOverview({
	requirements: frameworkRequirements,
	frameworkInstance,
}: FrameworkOverviewProps) {
	// Get all controls from all requirements
	const allControls = frameworkRequirements.flatMap(
		(requirement) => requirement.controls,
	);

	const totalControls = allControls.length;

	// Calculate compliant controls (all artifacts completed)
	const compliantControls = allControls.filter(
		(control) => getControlStatus(control.artifacts) === "completed",
	).length;

	// Calculate compliance percentage based on compliant controls
	const compliancePercentage =
		totalControls > 0
			? Math.round((compliantControls / totalControls) * 100)
			: 0;

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			<Card>
				<CardHeader>
					<CardTitle>{frameworkInstance.frameworkId}</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						Framework implementation for organization
					</p>
					<div className="mt-4">
						<Badge variant="outline">
							Framework ID: {frameworkInstance.frameworkId}
						</Badge>
					</div>
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
							{compliantControls} of {totalControls} controls compliant
						</p>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Assessment Status</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<CalendarIcon className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm">
								Last assessed:{" "}
								{frameworkInstance.lastAssessed
									? format(frameworkInstance.lastAssessed, "MMM d, yyyy")
									: "Never"}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<CalendarIcon className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm">
								Next assessment:{" "}
								{frameworkInstance.nextAssessment
									? format(frameworkInstance.nextAssessment, "MMM d, yyyy")
									: "Not scheduled"}
							</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
