"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, XCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@bubba/ui/tooltip";
import type { EvidenceTaskRow } from "./types";
import { calculateNextReview } from "@/lib/utils/calculate-next-review";

export const columns: ColumnDef<EvidenceTaskRow>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    enableResizing: true,
    enableSorting: true,
    size: 100,
    minSize: 200,
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild className="w-full">
            <div>{row.original.name}</div>
          </TooltipTrigger>
          <TooltipContent>{row.original.description}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    id: "status",
    accessorKey: "published",
    header: "Status",
    enableResizing: true,
    enableSorting: true,
    size: 150,
    minSize: 120,
    cell: ({ row }) => {
      const isPublished = row.original.published;
      const label = isPublished ? "Published" : "Draft";

      return (
        <div className="flex gap-2">
          {isPublished ? (
            <CheckCircle2 size={16} className="text-green-500 shrink-0" />
          ) : (
            <XCircle size={16} className="text-red-500 shrink-0" />
          )}
          <span
            className={
              isPublished ? "text-sm text-green-600" : "text-sm text-red-600"
            }
          >
            {label}
          </span>
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
    enableSorting: true,
    cell: ({ row }) => {
      const frequency = row.original.frequency;
      if (!frequency) return null;

      return <div className="truncate">{frequency}</div>;
    },
  },
  {
    id: "nextReviewDate",
    accessorKey: "nextReviewDate",
    header: "Next Review Date",
    size: 150,
    enableResizing: true,
    minSize: 180,
    enableSorting: true,
    cell: ({ row }) => {
      if (row.original.lastPublishedAt === null) {
        return <div className="truncate text-red-500 font-medium">ASAP</div>;
      }

      const reviewInfo = calculateNextReview(
        row.original.lastPublishedAt,
        row.original.frequency
      );

      if (!reviewInfo) return null;

      return (
        <div
          className={`truncate ${reviewInfo.isUrgent ? "text-red-500" : ""}`}
        >
          {reviewInfo.daysUntil} days (
          {reviewInfo.nextReviewDate.toLocaleDateString()})
        </div>
      );
    },
  },
];
