"use client";

import type { Framework, OrganizationFramework } from "@bubba/db/types";
import { Badge } from "@bubba/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { Progress } from "@bubba/ui/progress";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { FrameworkCategories } from "../data/getFrameworkRequirements";
interface FrameworkOverviewProps {
	organizationCategories: FrameworkCategories;
	organizationFramework: OrganizationFramework & { framework: Framework };
}

export function FrameworkOverview({
	organizationCategories,
	organizationFramework,
}: FrameworkOverviewProps) {
	const requirements = organizationCategories.flatMap((category) =>
		category.organizationControl.flatMap(
			(control) => control.OrganizationControlRequirement,
		),
	);

	const totalRequirements = requirements.length;
	const completedRequirements = requirements.filter((req) => {
		switch (req.type) {
			case "policy":
				return req.organizationPolicy?.status === "published";
			case "file":
				return !!req.fileUrl;
			case "evidence":
				return req.organizationEvidence?.published === true;
			default:
				return req.published;
		}
	}).length;

	// Count controls
	const allControls = organizationCategories.flatMap(
		(category) => category.organizationControl,
	);
	const totalControls = allControls.length;

	// Calculate compliant controls (all requirements completed)
	const compliantControls = allControls.filter((control) => {
		const controlRequirements = control.OrganizationControlRequirement;
		if (controlRequirements.length === 0) return false;

		const completedControlRequirements = controlRequirements.filter((req) => {
			switch (req.type) {
				case "policy":
					return req.organizationPolicy?.status === "published";
				case "file":
					return !!req.fileUrl;
				case "evidence":
					return req.organizationEvidence?.published === true;
				default:
					return req.published;
			}
		}).length;

		return completedControlRequirements === controlRequirements.length;
	}).length;

	// Calculate compliance percentage based on compliant controls
	const compliancePercentage =
		totalControls > 0
			? Math.round((compliantControls / totalControls) * 100)
			: 0;

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			<Card>
				<CardHeader>
					<CardTitle>{organizationFramework?.framework.name}</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						{organizationFramework?.framework.description}
					</p>
					<div className="mt-4">
						<Badge variant="outline">
							Version {organizationFramework?.framework.version}
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
								{organizationFramework?.lastAssessed
									? format(organizationFramework?.lastAssessed, "MMM d, yyyy")
									: "Never"}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<CalendarIcon className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm">
								Next assessment:{" "}
								{organizationFramework?.nextAssessment
									? format(organizationFramework?.nextAssessment, "MMM d, yyyy")
									: "Not scheduled"}
							</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
