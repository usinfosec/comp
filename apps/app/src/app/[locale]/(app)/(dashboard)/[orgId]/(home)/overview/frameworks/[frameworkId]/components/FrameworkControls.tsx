"use client";

import { useMemo } from "react";
import type { FrameworkCategories } from "../data/getFrameworkCategories";
import { FrameworkControlsTable } from "./table/FrameworkControlsTable";
import type { OrganizationControlType } from "./table/FrameworkControlsTableColumns";

export type FrameworkControlsProps = {
	organizationCategories: FrameworkCategories;
	frameworkId: string;
};

export function FrameworkControls({
	organizationCategories,
	frameworkId,
}: FrameworkControlsProps) {
	const allControls = useMemo(() => {
		if (!organizationCategories) return [];

		return organizationCategories.flatMap((category) =>
			category.organizationControl.map((orgControl) => ({
				code: orgControl.control.code,
				description: orgControl.control.description,
				name: orgControl.control.name,
				status: orgControl.status,
				id: orgControl.id,
				frameworkId,
				category: category.name,
				requirements: orgControl.OrganizationControlRequirement,
			})),
		);
	}, [organizationCategories, frameworkId]) as OrganizationControlType[];

	if (!organizationCategories) {
		return null;
	}

	return <FrameworkControlsTable data={allControls} />;
}
