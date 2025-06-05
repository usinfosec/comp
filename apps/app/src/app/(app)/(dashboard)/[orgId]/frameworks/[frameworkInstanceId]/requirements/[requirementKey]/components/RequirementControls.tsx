"use client";

import type { FrameworkEditorRequirement } from "@comp/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { FrameworkInstanceWithControls } from "../../../../types";
import { RequirementControlsTable } from "./table/RequirementControlsTable";
import type { Control, RequirementMap, Task } from "@comp/db/types";

interface RequirementControlsProps {
	requirement: FrameworkEditorRequirement;
	tasks: (Task & { controls: Control[] })[];
	relatedControls: (RequirementMap & { control: Control })[];
}

export function RequirementControls({
	requirement,
	tasks,
	relatedControls,
}: RequirementControlsProps) {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<div>
							<span className="text-sm text-muted-foreground">
								{"Requirement"}
							</span>
							<h1 className="text-2xl font-semibold">
								{requirement.name}
							</h1>
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						{requirement.description}
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>
						{"Controls"} (
						{relatedControls.length})
					</CardTitle>
				</CardHeader>
				<CardContent>
					<RequirementControlsTable
						controls={relatedControls.map((control) => control.control)}
						tasks={tasks}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
