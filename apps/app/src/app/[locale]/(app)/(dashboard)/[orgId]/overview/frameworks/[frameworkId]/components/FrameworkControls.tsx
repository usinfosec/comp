"use client";

import { useMemo } from "react";
import type { FrameworkRequirements } from "../data/getFrameworkRequirements";
import { FrameworkControlsTable } from "./table/FrameworkControlsTable";
import type { OrganizationControlType } from "./table/FrameworkControlsTableColumns";
import type { ComplianceStatus } from "@bubba/db/types";

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
	}, [frameworkRequirements, frameworkId]);

	if (!frameworkRequirements?.length) {
		return null;
	}

	return <FrameworkControlsTable data={allControls} />;
}
