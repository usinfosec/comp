"use client";

import { useMemo } from "react";
import { FrameworkInstanceWithControls } from "../../../types";
import { FrameworkControlsTable } from "./table/FrameworkControlsTable";
import type { OrganizationControlType } from "./table/FrameworkControlsTableColumns";

export type FrameworkControlsProps = {
	frameworkInstanceWithControls: FrameworkInstanceWithControls;
};

export function FrameworkControls({
	frameworkInstanceWithControls,
}: FrameworkControlsProps) {
	const allControls = useMemo(() => {
		if (!frameworkInstanceWithControls?.controls?.length) return [];

		// Get all controls
		const controls: OrganizationControlType[] = [];

		for (const control of frameworkInstanceWithControls.controls) {
			// Map artifacts first to have them in the correct format
			const mappedArtifacts = control.artifacts.map((artifact) => {
				return {
					...artifact,
					policy: artifact.policy
						? {
								status:
									artifact.policy.status === "archived"
										? "draft"
										: artifact.policy.status,
							}
						: null,
					evidence: artifact.evidence
						? {
								published: artifact.evidence.published,
							}
						: null,
				};
			});

			controls.push({
				id: control.id,
				name: control.name,
				description: control.description,
				frameworkInstanceId: frameworkInstanceWithControls.frameworkId,
				artifacts: mappedArtifacts,
			});
		}

		return controls;
	}, [frameworkInstanceWithControls]);

	if (!allControls?.length) {
		return null;
	}

	return <FrameworkControlsTable data={allControls} />;
}
