"use client";

import { DisplayFrameworkStatus } from "@/components/frameworks/framework-status";
import type { Control, RequirementMap } from "@bubba/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@bubba/ui/table";
import { useMemo } from "react";
import type { ControlProgressResponse } from "../data/getOrganizationControlProgress";
import { SingleControlSkeleton } from "./SingleControlSkeleton";
import { useI18n } from "@/locales/client";
import { RequirementRow } from "./RequirementRow";

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
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<div>
							<span className="text-sm text-muted-foreground">
								{t("frameworks.controls.title")}
							</span>
							<h1 className="text-2xl font-semibold">{control.name}</h1>
						</div>
						<DisplayFrameworkStatus status={progressStatus} />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">{control.description}</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>
						{t("frameworks.requirements.title")} (
						{control.requirementsMapped.length})
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="relative w-full">
						<div className="overflow-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>
											{t("frameworks.requirements.table.id")}
										</TableHead>
										<TableHead>
											{t("frameworks.requirements.table.name")}
										</TableHead>
										<TableHead>
											{t("frameworks.requirements.table.description")}
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{control.requirementsMapped.length > 0 ? (
										control.requirementsMapped.map((requirement) => (
											<RequirementRow
												key={requirement.id}
												requirement={requirement}
											/>
										))
									) : (
										<TableRow>
											<TableCell colSpan={2} className="h-24 text-center">
												{t("controls.requirements.no_requirements_mapped")}
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
