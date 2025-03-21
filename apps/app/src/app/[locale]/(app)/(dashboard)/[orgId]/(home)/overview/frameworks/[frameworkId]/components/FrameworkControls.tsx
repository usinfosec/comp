"use client";

import type {
	Control,
	OrganizationCategory,
	OrganizationControl,
	OrganizationControlRequirement,
	OrganizationPolicy,
	OrganizationEvidence,
} from "@bubba/db/types";
import { useMemo } from "react";
import { FrameworkControlsTable } from "./table/FrameworkControlsTable";
import type { OrganizationControlType } from "./table/FrameworkControlsTableColumns";

export type FrameworkCategory = OrganizationCategory & {
	organizationControl: (OrganizationControl & {
		control: Control;
		OrganizationControlRequirement: (OrganizationControlRequirement & {
			organizationPolicy: OrganizationPolicy;
			organizationEvidence: OrganizationEvidence;
		})[];
	})[];
};

export type FrameworkControlsProps = {
	organizationCategories: FrameworkCategory[];
	frameworkId: string;
};

export function FrameworkControls({
	organizationCategories,
	frameworkId,
}: {
	organizationCategories: FrameworkCategory[];
	frameworkId: string;
}) {
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

	return <FrameworkControlsTable data={allControls} />;
}
