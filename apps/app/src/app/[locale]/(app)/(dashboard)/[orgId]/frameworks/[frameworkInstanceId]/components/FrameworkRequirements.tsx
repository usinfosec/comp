"use client";

import type { Requirement } from "@bubba/data";
import { FrameworkId } from "@bubba/db/types";
import { useMemo } from "react";
import { getFrameworkRequirements } from "../../lib/getFrameworkRequirements";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@bubba/ui/table";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useI18n } from "@/locales/client";
import type { FrameworkInstanceWithControls } from "../../types";

export function FrameworkRequirements({
	frameworkId,
	frameworkInstanceWithControls,
}: {
	frameworkId: FrameworkId;
	frameworkInstanceWithControls: FrameworkInstanceWithControls;
}) {
	const t = useI18n();
	const { orgId, frameworkInstanceId } = useParams<{
		orgId: string;
		frameworkInstanceId: string;
	}>();

	const requirements = useMemo(() => {
		const reqs = getFrameworkRequirements(frameworkId);
		return Object.entries(reqs).map(([id, requirement]) => {
			// Count controls mapped to this requirement
			const mappedControlsCount = frameworkInstanceWithControls.controls.filter(
				(control) =>
					control.requirementsMapped?.some((req) => req.requirementId === id) ??
					false,
			).length;

			return {
				id,
				...requirement,
				mappedControlsCount,
			};
		});
	}, [frameworkId, frameworkInstanceWithControls.controls]);

	if (!requirements?.length) {
		return null;
	}

	return (
		<div className="space-y-4">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="min-w-[100px]">ID</TableHead>
						<TableHead className="min-w-[200px]">Name</TableHead>
						<TableHead className="min-w-[300px] max-w-[500px]">
							Description
						</TableHead>
						<TableHead className="min-w-[100px]">
							{t("frameworks.controls.table.requirements")}
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{requirements.map((requirement) => (
						<TableRow
							key={requirement.id}
							className="cursor-pointer hover:bg-muted/50"
						>
							<TableCell>
								<Link
									href={`/${orgId}/frameworks/${frameworkInstanceId}/requirement/${requirement.id}`}
									className="block w-full"
								>
									{requirement.id}
								</Link>
							</TableCell>
							<TableCell>
								<Link
									href={`/${orgId}/frameworks/${frameworkInstanceId}/requirement/${requirement.id}`}
									className="block w-full"
								>
									{requirement.name}
								</Link>
							</TableCell>
							<TableCell>
								<Link
									href={`/${orgId}/frameworks/${frameworkInstanceId}/requirement/${requirement.id}`}
									className="block w-full max-w-[500px]"
								>
									{requirement.description}
								</Link>
							</TableCell>
							<TableCell>
								<Link
									href={`/${orgId}/frameworks/${frameworkInstanceId}/requirement/${requirement.id}`}
									className="block w-full text-sm text-muted-foreground"
								>
									{requirement.mappedControlsCount}
								</Link>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
