"use client";

import type { FrameworkEditorRequirement } from "@comp/db/types";
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
			{/* Requirement Header */}
			<div className="space-y-2">
				<h1 className="text-xl font-semibold">{requirement.name}</h1>
				{requirement.description && (
					<p className="text-sm text-muted-foreground leading-relaxed">
						{requirement.description}
					</p>
				)}
			</div>

			{/* Controls Section */}
			<div className="space-y-4">
				<div className="flex items-center justify-between border-b border-muted pb-3">
					<div className="flex items-center gap-2">
						<h2 className="text-base font-medium">Controls</h2>
						<span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-xs tabular-nums">
							{relatedControls.length}
						</span>
					</div>
				</div>
				
				<RequirementControlsTable
					controls={relatedControls.map((control) => control.control)}
					tasks={tasks}
				/>
			</div>
		</div>
	);
}
