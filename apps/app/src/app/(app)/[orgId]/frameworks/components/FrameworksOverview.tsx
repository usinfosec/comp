'use client';

import { Control, Task } from "@comp/db/types";
import { getFrameworkWithComplianceScores } from "../data/getFrameworkWithComplianceScores";
import type { FrameworkInstanceWithControls } from "../types";
import { FrameworkList } from "./FrameworkList";
import type { FrameworkEditorFramework } from "@comp/db/types";
import { Button } from "@comp/ui/button";
import { useState } from "react";
import { AddFrameworkModal } from "./AddFrameworkModal";
import { useParams } from 'next/navigation';
import { Dialog } from "@comp/ui/dialog";
import { PlusIcon } from "lucide-react";

export interface FrameworksOverviewProps {
	frameworksWithControls: FrameworkInstanceWithControls[];
	tasks: (Task & { controls: Control[] })[];
	allFrameworks: FrameworkEditorFramework[];
}

export function FrameworksOverview({
	frameworksWithControls,
	tasks,
	allFrameworks,
}: FrameworksOverviewProps) {
	const params = useParams<{ orgId: string }>();
	const organizationId = params.orgId;
	const [isAddFrameworkModalOpen, setIsAddFrameworkModalOpen] = useState(false);

	const instancedFrameworkIds = frameworksWithControls.map(fw => fw.frameworkId);
	const availableFrameworksToAdd = allFrameworks.filter(fw => !instancedFrameworkIds.includes(fw.id) && fw.visible);

	return (
		<div className="space-y-4">

			<div className="grid gap-4 md:grid-cols-1 select-none w-full">
				<FrameworkList
					frameworksWithControls={frameworksWithControls}
					tasks={tasks}
				/>
				<div className="flex justify-center items-center">
				<Button onClick={() => setIsAddFrameworkModalOpen(true)} variant="outline">
					{"Add Framework"} <PlusIcon className="w-4 h-4" />
				</Button>
			</div>
			</div>
			<Dialog open={isAddFrameworkModalOpen} onOpenChange={setIsAddFrameworkModalOpen}>
				{isAddFrameworkModalOpen && (
					<AddFrameworkModal
						onOpenChange={setIsAddFrameworkModalOpen}
						availableFrameworks={availableFrameworksToAdd}
						organizationId={organizationId}
					/>
				)}
			</Dialog>
		</div>
	);
}
