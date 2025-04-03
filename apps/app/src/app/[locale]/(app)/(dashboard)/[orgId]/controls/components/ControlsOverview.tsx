"use client";

import { useI18n } from "@/locales/client";
import type { Control } from "@comp/db/types";
import { ControlsTable } from "./table/ControlsTable";

interface ControlsOverviewProps {
	controls: (Control & {
		artifacts: {
			policy: { status: string } | null;
			evidence: { published: boolean } | null;
		}[];
		requirementsMapped: any[];
	})[];
	organizationId: string;
}

export function ControlsOverview({ controls }: ControlsOverviewProps) {
	const t = useI18n();

	return (
		<div className="space-y-6">
			<ControlsTable data={controls} />
		</div>
	);
}
