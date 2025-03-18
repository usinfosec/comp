"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { PolicyStatus } from "./types";
import { formatStatus, getStatusStyle } from "./utils";

interface PolicyRow {
	id: string;
	status: PolicyStatus;
	createdAt: Date;
	updatedAt: Date;
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
				return (
					<div className="flex flex-col gap-1">
						<button
							type="button"
							className="text-left hover:underline"
							onClick={() => handleRowClick(row.original.id)}
						>
							<span className="truncate">{name}</span>
						</button>
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
