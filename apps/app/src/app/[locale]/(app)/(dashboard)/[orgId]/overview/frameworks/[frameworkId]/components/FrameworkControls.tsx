"use client";

import { useMemo } from "react";
import type { FrameworkRequirements } from "../data/getFrameworkRequirements";
import { FrameworkControlsTable } from "./table/FrameworkControlsTable";
import type { OrganizationControlType } from "./table/FrameworkControlsTableColumns";

export type FrameworkControlsProps = {
	requirements: FrameworkRequirements;
	frameworkId: string;
};

export function FrameworkControls({
	requirements,
	frameworkId,
}: FrameworkControlsProps) {
	const allControls = useMemo(() => {
		if (!requirements?.length) return [];

		// Get all controls
		const controls: OrganizationControlType[] = [];

		for (const requirement of requirements) {
			for (const control of requirement.controls) {
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
					frameworkId,
					artifacts: mappedArtifacts,
				});
			}
		}

		return controls;
	}, [requirements, frameworkId]);

	if (!requirements?.length) {
		return null;
	}

	return <FrameworkControlsTable data={allControls} />;
}
