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

export const columns: ColumnDef<EvidenceTaskRow>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    size: 200,
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="max-w-[200px] truncate">{row.original.name}</div>
          </TooltipTrigger>
          <TooltipContent>{row.original.name}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Description",
    size: 300,
    cell: ({ row }) => {
      const description = row.original.description;
      if (!description) return null;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[300px] truncate">{description}</div>
            </TooltipTrigger>
            <TooltipContent>{description}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: "evidence",
    accessorKey: "evidence.name",
    header: "Evidence Type",
    size: 150,
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="max-w-[150px] truncate">
              {row.original.evidence.name}
            </div>
          </TooltipTrigger>
          <TooltipContent>{row.original.evidence.name}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    id: "status",
    accessorKey: "published",
    header: "Status",
    size: 100,
    cell: ({ row }) => {
      const isPublished = row.original.published;
      const label = isPublished ? "Published" : "Draft";

      return (
        <div className="flex items-center justify-center gap-2">
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
];
