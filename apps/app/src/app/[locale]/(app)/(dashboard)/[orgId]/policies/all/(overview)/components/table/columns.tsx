"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { PolicyStatus } from "./types";
import { formatStatus, getStatusStyle } from "./utils";
import { Archive } from "lucide-react";
import { Badge } from "@bubba/ui/badge";
import { cn } from "@bubba/ui/cn";

interface PolicyRow {
	id: string;
	status: PolicyStatus;
	createdAt: Date;
	updatedAt: Date;
	isArchived: boolean;
	archivedAt?: Date;
	policy: {
		id: string;
		name: string;
		description: string | null;
		slug: string;
	};
}

export function getColumns(
	handleRowClick: (policyId: string) => void,
): ColumnDef<PolicyRow>[] {
	return [
		{
			id: "name",
			header: "Name",
			accessorKey: "policy.name",
			cell: ({ row }) => {
				const name = row.original.policy.name;
				const isArchived = row.original.isArchived;

				return (
					<div className="flex flex-col gap-1">
						<div className="flex items-center gap-2">
							<button
								type="button"
								className={cn(
									"text-left hover:underline",
									isArchived && "text-muted-foreground",
								)}
								onClick={() => handleRowClick(row.original.id)}
							>
								<span className="truncate">{name}</span>
							</button>
							{isArchived && (
								<Badge variant="outline" className="text-xs px-1 py-0 h-5">
									<Archive className="h-3 w-3 mr-1" />
									Archived
								</Badge>
							)}
						</div>
					</div>
				);
			},
		},
		{
			id: "status",
			header: "Status",
			accessorKey: "status",
			cell: ({ row }) => {
				const status = row.original.status;
				return (
					<div className="hidden md:flex items-center gap-2">
						<div className={`h-2.5 w-2.5 ${getStatusStyle(status)}`} />
						<span className="text-sm">{formatStatus(status)}</span>
					</div>
				);
			},
		},
		{
			id: "updatedAt",
			header: "Last Updated",
			accessorKey: "updatedAt",
			cell: ({ row }) => {
				const date = new Date(row.original.updatedAt);
				const isArchived = row.original.isArchived;
				const archivedDate = row.original.archivedAt
					? new Date(row.original.archivedAt)
					: null;

				if (isArchived && archivedDate) {
					return (
						<div className="text-muted-foreground">
							Archived on{" "}
							{archivedDate.toLocaleDateString("en-US", {
								year: "numeric",
								month: "short",
								day: "numeric",
							})}
						</div>
					);
				}

				return (
					<div className="text-muted-foreground">
						{date.toLocaleDateString("en-US", {
							year: "numeric",
							month: "short",
							day: "numeric",
						})}
					</div>
				);
			},
		},
	];
}
