"use client";

import { StatusPolicies } from "@/components/status-policies";
import { calculateNextReview } from "@/lib/utils/calculate-next-review";
import { Avatar, AvatarFallback, AvatarImage } from "@bubba/ui/avatar";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { AlertTriangle, Building, CheckCircle2 } from "lucide-react";
import type { EvidenceTaskRow } from "../../types";
import { Badge } from "@bubba/ui/badge";

export const EvidenceListColumns: ColumnDef<EvidenceTaskRow>[] = [
	{
		id: "name",
		accessorKey: "name",
		header: "Name",
		enableResizing: true,
		enableSorting: true,
		size: 100,
		minSize: 200,
		cell: ({ row }) => (
			<div className="flex flex-col gap-1">
				<span className="font-medium truncate">{row.original.name}</span>
				<div className="md:hidden">
					<StatusPolicies
						status={row.original.published ? "published" : "draft"}
					/>
				</div>
			</div>
		),
	},
	{
		id: "status",
		accessorKey: "published",
		header: "Status",
		enableResizing: true,
		enableSorting: false,
		size: 150,
		minSize: 120,
		cell: ({ row }) => {
			const isPublished = row.original.published;

			return (
				<div className="hidden md:flex gap-2">
					<StatusPolicies status={isPublished ? "published" : "draft"} />
				</div>
			);
		},
	},
	{
		id: "department",
		accessorKey: "department",
		header: "Department",
		size: 150,
		enableResizing: true,
		minSize: 130,
		enableSorting: false,
		cell: ({ row }) => {
			const department = row.original.department;

			if (!department || department === "none") {
				return (
					<Badge variant="marketing" className="text-xs w-min hidden md:flex">
						None
					</Badge>
				);
			}

			return (
				<div className="hidden md:flex items-center gap-2">
					<Badge variant="marketing">
						{department.replace(/_/g, " ").toUpperCase()}
					</Badge>
				</div>
			);
		},
	},
	{
		id: "frequency",
		accessorKey: "frequency",
		header: "Frequency",
		size: 150,
		enableResizing: true,
		minSize: 130,
		enableSorting: false,
		cell: ({ row }) => {
			const frequency = row.original.frequency;
			if (!frequency) return null;

			return <div className="truncate hidden md:block">{frequency}</div>;
		},
	},
	{
		id: "nextReviewDate",
		accessorKey: "nextReviewDate",
		header: "Next Review Date",
		size: 150,
		enableResizing: true,
		minSize: 180,
		enableSorting: false,
		cell: ({ row }) => {
			if (row.original.lastPublishedAt === null) {
				return (
					<div className="truncate text-red-500 font-medium hidden md:block">
						ASAP
					</div>
				);
			}

			const reviewInfo = calculateNextReview(
				row.original.lastPublishedAt,
				row.original.frequency,
			);

			if (!reviewInfo) return null;

			return (
				<div
					className={`truncate ${reviewInfo.isUrgent ? "text-red-500" : ""} hidden md:block`}
				>
					{reviewInfo.daysUntil} days (
					{format(reviewInfo.nextReviewDate, "MM/dd/yyyy")})
				</div>
			);
		},
	},
	{
		id: "assignee",
		accessorKey: "assignee",
		header: "Assignee",
		enableResizing: true,
		enableSorting: false,
		size: 150,
		minSize: 150,
		cell: ({ row }) => {
			const assignee = row.original.assignee;

			if (!assignee) {
				return (
					<div className="text-muted-foreground text-sm hidden md:block">
						Unassigned
					</div>
				);
			}

			return (
				<div className="hidden md:flex items-center gap-2">
					<Avatar className="h-6 w-6">
						<AvatarImage
							src={assignee.image || undefined}
							alt={assignee.name || ""}
						/>
						<AvatarFallback>
							{assignee.name ? assignee.name.charAt(0) : "?"}
						</AvatarFallback>
					</Avatar>
					<span className="truncate text-sm">{assignee.name}</span>
				</div>
			);
		},
	},
	{
		id: "relevance",
		accessorKey: "isNotRelevant",
		header: "Relevance",
		enableResizing: true,
		enableSorting: false,
		size: 150,
		minSize: 120,
		cell: ({ row }) => {
			const isNotRelevant = row.original.isNotRelevant;

			if (!isNotRelevant) {
				return (
					<div className="flex gap-2 items-center">
						<CheckCircle2 size={16} className="text-green-500 shrink-0" />
						<span className="text-sm text-green-600">Relevant</span>
					</div>
				);
			}

			return (
				<div className="flex gap-2 items-center">
					<AlertTriangle size={16} className="text-yellow-500 shrink-0" />
					<span className="text-sm text-yellow-600">Not Relevant</span>
				</div>
			);
		},
	},
];
