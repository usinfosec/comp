'use client';

import { Control, Task } from "@comp/db/types";
import { getFrameworkWithComplianceScores } from "../data/getFrameworkWithComplianceScores";
import type { FrameworkInstanceWithControls } from "../types";
import { FrameworkList } from "./FrameworkList";
import type { FrameworkEditorFramework } from "@comp/db/types";
import { Button } from "@comp/ui/button";
import { useI18n } from "@/locales/client";
import { useState } from "react";
import { AddFrameworkModal } from "./AddFrameworkModal";
import { useParams } from 'next/navigation';
import { Dialog } from "@comp/ui/dialog";

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
	const t = useI18n();
	const params = useParams<{ orgId: string }>();
	const organizationId = params.orgId;
	const [isAddFrameworkModalOpen, setIsAddFrameworkModalOpen] = useState(false);

	const instancedFrameworkIds = frameworksWithControls.map(fw => fw.frameworkId);
	const availableFrameworksToAdd = allFrameworks.filter(fw => !instancedFrameworkIds.includes(fw.id) && fw.visible);

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-semibold">{t("sidebar.frameworks")}</h1>
				<Button onClick={() => setIsAddFrameworkModalOpen(true)}>
					{t("frameworks.overview.progress.empty.action")}
				</Button>
			</div>
			<div className="grid gap-4 md:grid-cols-1 select-none w-full">
				<FrameworkList
					frameworksWithControls={frameworksWithControls}
					tasks={tasks}
				/>
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
