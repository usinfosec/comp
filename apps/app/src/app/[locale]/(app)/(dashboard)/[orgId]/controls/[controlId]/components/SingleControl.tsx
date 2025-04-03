"use client";

import { DisplayFrameworkStatus } from "@/components/frameworks/framework-status";
import type { Control } from "@comp/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { useMemo } from "react";
import type { ControlProgressResponse } from "../data/getOrganizationControlProgress";
import { SingleControlSkeleton } from "./SingleControlSkeleton";
import { useI18n } from "@/locales/client";
import { useParams } from "next/navigation";
import { RequirementsTable } from "./RequirementsTable";
import { ArtifactsTable } from "./ArtifactsTable";
import type { RelatedArtifact } from "../data/getRelatedArtifacts";
import { Separator } from "@comp/ui/separator";

interface SingleControlProps {
	control: Control & {
		requirementsMapped: any[];
	};
	controlProgress: ControlProgressResponse;
	relatedArtifacts: RelatedArtifact[];
}

export const SingleControl = ({
	control,
	controlProgress,
	relatedArtifacts = [],
}: SingleControlProps) => {
	const t = useI18n();
	const params = useParams();
	const orgId = params.orgId as string;
	const controlId = params.controlId as string;

	const progressStatus = useMemo(() => {
		if (!controlProgress) return "not_started";

		return controlProgress.total === controlProgress.completed
			? "completed"
			: controlProgress.completed > 0
				? "in_progress"
				: "not_started";
	}, [controlProgress]);

	if (!control || !controlProgress) {
		return <SingleControlSkeleton />;
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<div>
							<span className="text-sm text-muted-foreground">
								{t("frameworks.controls.title")}
							</span>
							<h1 className="text-2xl font-semibold">{control.name}</h1>
						</div>
						<DisplayFrameworkStatus status={progressStatus} />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">{control.description}</p>
				</CardContent>
			</Card>

			<RequirementsTable
				requirements={control.requirementsMapped}
				orgId={orgId}
			/>
			<ArtifactsTable
				artifacts={relatedArtifacts}
				orgId={orgId}
				controlId={controlId}
			/>
		</div>
	);
};
