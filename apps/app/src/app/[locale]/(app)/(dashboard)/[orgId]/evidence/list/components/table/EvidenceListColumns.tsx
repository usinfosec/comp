"use client";

import { calculateNextReview } from "@/lib/utils/calculate-next-review";
import { Avatar, AvatarFallback, AvatarImage } from "@bubba/ui/avatar";
import { Badge } from "@bubba/ui/badge";
import { cn } from "@bubba/ui/cn";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { EVIDENCE_STATUS_HEX_COLORS } from "../../../(overview)/constants/evidence-status";
import type { EvidenceTaskRow } from "../../types";

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
					<div className="hidden md:flex gap-2">
						<div className={cn("flex items-center gap-2")}>
							<div
								className={cn("size-2.5")}
								style={{
									backgroundColor:
										EVIDENCE_STATUS_HEX_COLORS[
											row.original.status ?? "draft"
										] ?? "  ",
								}}
							/>
						</div>
					</div>
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
			const status = row.original.status;

			return (
				<div className="hidden md:flex gap-2">
					<div className={cn("flex items-center gap-2")}>
						<div
							className={cn("size-2.5")}
							style={{
								backgroundColor:
									EVIDENCE_STATUS_HEX_COLORS[status ?? "draft"] ?? "  ",
							}}
						/>
						{status
							?.split("_")
							.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
							.join(" ")}
					</div>
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
							src={assignee.user.image || undefined}
							alt={assignee.user.name || ""}
						/>
						<AvatarFallback>
							{assignee.user.name ? assignee.user.name.charAt(0) : "?"}
						</AvatarFallback>
					</Avatar>
					<span className="truncate text-sm">{assignee.user.name}</span>
				</div>
			);
		},
	},
];
