"use client";

import { StatusIndicator, StatusType } from "@/components/status-indicator";
import { useI18n } from "@/locales/client";
import type { Artifact, Policy, PolicyStatus } from "@comp/db/types";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@comp/ui/tooltip";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useParams } from "next/navigation";

export type OrganizationControlType = {
	id: string;
	name: string;
	description: string | null;
	frameworkInstanceId: string;
	artifacts: (Artifact & {
		policy: Policy | null;
	})[];
};

// Local helper function to check artifact completion
type ArtifactForCompletionCheck = Artifact & {
	policy: (Policy & { status: PolicyStatus | null }) | null;
};

export function getControlStatusForArtifacts(
	artifacts: ArtifactForCompletionCheck[],
): StatusType {
	if (!artifacts || artifacts.length === 0) return "not_started";

	const totalArtifacts = artifacts.length;

	const completedArtifacts = artifacts.filter((artifact) => {
		switch (artifact.type) {
			case "policy":
				return artifact.policy?.status === "published";
			default:
				return false;
		}
	}).length;

	if (completedArtifacts === 0) return "not_started";
	if (completedArtifacts === totalArtifacts) return "completed";
	return "in_progress";
}

function isArtifactCompleted(artifact: ArtifactForCompletionCheck): boolean {
	if (!artifact) return false;

	switch (artifact.type) {
		case "policy":
			return artifact.policy?.status === "published";
		default:
			return false;
	}
}

export function FrameworkControlsTableColumns(): ColumnDef<OrganizationControlType>[] {
	const t = useI18n();
	const { orgId } = useParams<{ orgId: string }>();

	return [
		{
			id: "name",
			accessorKey: "name",
			header: t("frameworks.controls.table.control"),
			cell: ({ row }) => {
				return (
					<div className="flex flex-col w-[300px]">
						<Link
							href={`/${orgId}/controls/${row.original.id}`}
							className="flex flex-col"
						>
							<span className="font-medium truncate">
								{row.original.name}
							</span>
						</Link>
					</div>
				);
			},
		},
		{
			id: "category",
			accessorKey: "name",
			header: t("risk.vendor.table.category"),
			cell: ({ row }) => (
				<div className="w-[200px]">
					<span className="text-sm">{row.original.name}</span>
				</div>
			),
		},
		{
			id: "status",
			accessorKey: "artifacts",
			header: t("frameworks.controls.table.status"),
			cell: ({ row }) => {
				const artifacts = row.original.artifacts;
				const status = getControlStatusForArtifacts(artifacts);

				const totalArtifacts = artifacts.length;
				const completedArtifacts =
					artifacts.filter(isArtifactCompleted).length;

				return (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="w-[200px]">
									<StatusIndicator status={status} />
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<div className="text-sm">
									<p>
										Progress:{" "}
										{Math.round(
											(completedArtifacts /
												totalArtifacts) *
												100,
										) || 0}
										%
									</p>
									<p>
										Completed: {completedArtifacts}/
										{totalArtifacts} artifacts
									</p>
								</div>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				);
			},
		},
	];
}
