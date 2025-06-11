"use client";

import type { FrameworkEditorRequirement } from "@comp/db/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@comp/ui/card";
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
					<CardTitle>{requirement.name}</CardTitle>
					<CardDescription>{requirement.description}</CardDescription>
				</CardHeader>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Controls ({relatedControls.length})</CardTitle>
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
