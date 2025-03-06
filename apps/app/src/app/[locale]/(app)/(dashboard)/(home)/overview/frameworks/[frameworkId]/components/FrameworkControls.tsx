"use client";

import { DataTable } from "@/components/tables/frameworks/data-table";
import { useOrganizationCategories } from "../hooks/useOrganizationCategories";
import { useMemo } from "react";
import type { OrganizationControlType } from "@/components/tables/frameworks/columns";

interface FrameworkControlsProps {
	frameworkId: string;
}

export function FrameworkControls({ frameworkId }: FrameworkControlsProps) {
	const { data: organizationCategories } =
		useOrganizationCategories(frameworkId);

	const allControls = useMemo(() => {
		if (!organizationCategories) return [];

		return organizationCategories.flatMap((category) =>
			category.organizationControl.map((control) => ({
				code: control.control.code,
				description: control.control.description,
				name: control.control.name,
				status: control.status,
				id: control.id,
				frameworkId,
				category: category.name,
				requirements: control.OrganizationControlRequirement,
			})),
		);
	}, [organizationCategories, frameworkId]) as OrganizationControlType[];

	if (!organizationCategories) {
		return null;
	}

	return <DataTable data={allControls} />;
}
