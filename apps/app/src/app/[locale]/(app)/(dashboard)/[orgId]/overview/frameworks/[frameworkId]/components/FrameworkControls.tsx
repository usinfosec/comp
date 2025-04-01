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
	requirements: frameworkRequirements,
	frameworkId,
}: FrameworkControlsProps) {
	const allControls = useMemo(() => {
		if (!frameworkRequirements?.length) return [];

		// Get all controls
		const controls: OrganizationControlType[] = [];

		for (const frameworkInstance of frameworkRequirements) {
			for (const control of frameworkInstance.controls) {
				controls.push({
					id: control.id,
					name: control.name,
					description: control.description,
					frameworkId,
					artifacts: control.artifacts.map((artifact) => {
						// Create a new artifact with the correct structure
						const mappedArtifact = {
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
						return mappedArtifact;
					}),
				});
			}
		}

		return controls;
	}, [frameworkRequirements, frameworkId]);

	if (!frameworkRequirements?.length) {
		return null;
	}

	return <FrameworkControlsTable data={allControls} />;
}
