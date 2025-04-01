"use client";

import type { FrameworkRequirements } from "../data/getFrameworkRequirements";
import { FrameworkControlsTable } from "./table/FrameworkControlsTable";

export type FrameworkControlsProps = {
	requirements: FrameworkRequirements;
	frameworkId: string;
};

export function FrameworkControls({
	requirements: frameworkRequirements,
	frameworkId,
}: FrameworkControlsProps) {
	return <FrameworkControlsTable data={[]} />;
}
