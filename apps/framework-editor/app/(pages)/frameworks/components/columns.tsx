"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import type { FrameworkEditorFramework } from "@prisma/client";

// TODO: Replace 'any' with the actual Framework type from your database schema
// e.g., import type { Framework } from "@comp/db";
// For now, we'll use a placeholder type.
export interface Framework {
  id: string; // Assuming ID is a string, adjust if it's a number
  name: string;
  // Add other properties of a framework that you might want to display or use
}

export const columns: ColumnDef<FrameworkEditorFramework>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 300,
    cell: ({ row }) => {
      const framework = row.original;
      return (
        <Link href={`/frameworks/${framework.id}`} className="hover:underline">
          {framework.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "version",
    header: "Version",
    size: 150,
  },
  {
    accessorKey: "description",
    header: "Description",
    size: 500,
    minSize: 300,
  },
  // Add more columns here if needed, for example:
  // {
  //   accessorKey: "createdAt",
  //   header: "Created At",
  //   cell: ({ row }) => {
  //     const date = new Date(row.getValue("createdAt"));
  //     return <span>{date.toLocaleDateString()}</span>;
  //   }
  // }
]; 