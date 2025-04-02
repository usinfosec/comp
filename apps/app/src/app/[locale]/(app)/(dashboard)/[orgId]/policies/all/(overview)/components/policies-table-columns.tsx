"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Policy } from "@bubba/db/types";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

export function getPolicyColumns(): ColumnDef<Policy>[] {
  return [
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              {row.getValue("name")}
            </span>
          </div>
        );
      },
      meta: {
        label: "Name",
        placeholder: "Search names...",
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
        return (
          <p className="text-sm font-medium">
            {row.getValue("status")}
          </p>
        )
      },
      meta: {
        label: "Status",
        placeholder: "Search status...",
        variant: "select",
      },
    },
  ];
}
