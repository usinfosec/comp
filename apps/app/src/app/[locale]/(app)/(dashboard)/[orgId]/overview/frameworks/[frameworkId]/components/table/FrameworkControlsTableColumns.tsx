"use client";

import {
	DisplayFrameworkStatus,
	type StatusType,
} from "@/components/frameworks/framework-status";
import { useI18n } from "@/locales/client";
import type { ComplianceStatus } from "@bubba/db/types";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@bubba/ui/tooltip";
import { useParams } from "next/navigation";
import { getControlStatus } from "../../lib/utils";
import { ControlRequirement } from "@bubba/data";

export type OrganizationControlType = {
	code: string;
	description: string | null;
	name: string;
	status: ComplianceStatus;
	id: string;
	frameworkId: string;
	category: string;
	requirements: (ControlRequirement & {
		organizationPolicy: {
			status: "draft" | "published" | "archived";
		} | null;
		organizationEvidence: {
			published: boolean;
		} | null;
	})[];
};

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
							href={`/${orgId}/overview/frameworks/controls/${row.original.id}`}
							className="flex flex-col"
						>
							<span className="font-medium truncate">{row.original.name}</span>
							<span className="text-sm text-muted-foreground truncate">
								{row.original.code}
							</span>
						</Link>
					</div>
				);
			},
		},
		{
			id: "category",
			accessorKey: "category",
			header: t("risk.vendor.table.category"),
			cell: ({ row }) => (
				<div className="w-[200px]">
					<span className="text-sm">{row.original.category}</span>
				</div>
			),
		},
		{
			id: "status",
			accessorKey: "status",
			header: t("frameworks.controls.table.status"),
			cell: ({ row }) => {
				const requirements = row.original.requirements;
				const status = getControlStatus(requirements);

				const totalRequirements = requirements.length;
				const completedRequirements = requirements.filter((req) => {
					switch (req.type) {
						case "policy":
							return req.organizationPolicy?.status === "published";
						case "file":
							return !!req.fileUrl;
						case "evidence":
							return req.organizationEvidence?.published === true;
						default:
							return req.published;
					}
				}).length;

				return (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="w-[200px]">
									<DisplayFrameworkStatus status={status} />
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<div className="text-sm">
									<p>
										Progress:{" "}
										{Math.round(
											(completedRequirements / totalRequirements) * 100,
										) || 0}
										%
									</p>
									<p>
										Completed: {completedRequirements}/{totalRequirements}{" "}
										requirements
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
