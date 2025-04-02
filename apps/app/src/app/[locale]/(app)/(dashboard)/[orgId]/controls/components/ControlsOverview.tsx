"use client";

import { useI18n } from "@/locales/client";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { ControlsTable } from "./table/ControlsTable";
import type { Control } from "@bubba/db/types";

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

export function ControlsOverview({
	controls,
	organizationId,
}: ControlsOverviewProps) {
	const t = useI18n();

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-3xl font-bold tracking-tight">
					{t("controls.overview.title")}
				</h2>
			</div>
			<ControlsTable data={controls} />
		</div>
	);
}
