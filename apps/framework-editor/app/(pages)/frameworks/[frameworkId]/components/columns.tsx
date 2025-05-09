"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { FrameworkEditorRequirement } from "@prisma/client";
import { Button } from "@comp/ui/button";
import { PencilIcon } from "lucide-react";
import { Badge } from "@comp/ui/badge";
// If you need to link to individual requirement pages later, you can import Link:
// import Link from "next/link";

export function getColumns(onEdit: (requirement: FrameworkEditorRequirement) => void): ColumnDef<FrameworkEditorRequirement>[] {
  return [
    {
      accessorKey: "name",
      header: "Requirement ID / Name",
      size: 250,
      cell: ({ row }) => row.getValue("name"),
    },
    {
      accessorKey: "description",
      header: "Description",
      size: 500,
    },
    {
      accessorKey: "_count.controls",
      header: "Linked Controls",
      size: 150,
      cell: ({ row }) => {
        const requirement = row.original as FrameworkEditorRequirement & { _count?: { controls?: number } };
        const controlsCount = requirement._count?.controls ?? 0;
        return <Badge variant="secondary">{controlsCount}</Badge>;
      },
    },
    {
      id: "actions",
      header: () => null,
      cell: ({ row }) => {
        const requirement = row.original;
        return (
          <div className="text-right pr-4 group h-full flex items-center justify-end">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-150"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(requirement);
              }}
            >
              <PencilIcon className="h-4 w-4" />
              <span className="sr-only">Edit Requirement</span>
            </Button>
          </div>
        );
      },
      size: 80,
    }
  ];
} 