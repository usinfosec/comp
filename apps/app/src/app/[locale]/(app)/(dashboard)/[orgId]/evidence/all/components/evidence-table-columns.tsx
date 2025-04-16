"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { StatusIndicator } from "@/components/status-indicator";
import { formatDate } from "@/lib/format";
import { calculateNextReview } from "@/lib/utils/calculate-next-review";
import { Frequency, Task, TaskFrequency } from "@comp/db/types";
import { Badge } from "@comp/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

export function getEvidenceColumns(): ColumnDef<Task>[] {
	return [
		{
			id: "title",
			accessorKey: "title",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Title" />
			),
			cell: ({ row }) => {
				return (
					<div className="flex items-center gap-2">
						<span className="max-w-[31.25rem] truncate font-medium">
							{row.getValue("title")}
						</span>
					</div>
				);
			},
			meta: {
				label: "Title",
				placeholder: "Search for title...",
				variant: "text",
			},
			enableColumnFilter: true,
		},
		{
			id: "status",
			accessorKey: "status",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Status" />
			),
			cell: ({ row }) => {
				return <StatusIndicator status={row.original.status} />;
			},
			meta: {
				label: "Status",
				placeholder: "Search by status...",
				variant: "select",
			},
		},
		{
			id: "frequency",
			accessorKey: "frequency",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Frequency" />
			),
			cell: ({ row }) => {
				const frequency = row.original.frequency;

				if (!frequency) {
					return (
						<Badge
							variant="marketing"
							className="text-xs w-min hidden md:flex"
						>
							None
						</Badge>
					);
				}

				return (
					<div className="hidden md:flex items-center gap-2">
						<Badge variant="marketing">
							{frequency.replace(/_/g, " ").toUpperCase()}
						</Badge>
					</div>
				);
			},
			meta: {
				label: "Frequency",
				placeholder: "Search by frequency...",
				variant: "select",
			},
		},
		{
			id: "lastCompletedAt",
			accessorKey: "lastCompletedAt",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Last Completed" />
			),
			cell: ({ row }) => {
				if (row.original.lastCompletedAt === null) {
					return (
						<div className="truncate text-red-500 font-medium hidden md:block">
							N/A
						</div>
					);
				}

				const reviewInfo = calculateNextReview(
					row.original.lastCompletedAt,
					row.original.frequency,
				);

				if (!reviewInfo) return null;

				return (
					<div
						className={`truncate ${reviewInfo.isUrgent ? "text-red-500" : ""} hidden md:block`}
					>
						{reviewInfo.daysUntil} days (
						{formatDate(reviewInfo.nextReviewDate)})
					</div>
				);
			},
			meta: {
				label: "Review Date",
				placeholder: "Search by review date...",
				variant: "date",
			},
		},
		{
			id: "updatedAt",
			accessorKey: "updatedAt",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Last Updated" />
			),
			cell: ({ row }) => {
				return (
					<div className="text-muted-foreground">
						{formatDate(row.getValue("updatedAt"))}
					</div>
				);
			},
			meta: {
				label: "Last Updated",
				placeholder: "Search by last updated...",
				variant: "date",
			},
		},
	];
}
