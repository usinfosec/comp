"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { FrameworkEditorRequirement } from "@prisma/client";
// If you need to link to individual requirement pages later, you can import Link:
// import Link from "next/link";

export const columns: ColumnDef<FrameworkEditorRequirement>[] = [
  {
    accessorKey: "name",
    header: "Requirement ID / Name",
    size: 250,
    // Example of making it a link if needed in the future:
    // cell: ({ row }) => {
    //   const requirement = row.original;
    //   return (
    //     <Link href={`/frameworks/${requirement.frameworkId}/requirements/${requirement.id}`} className="hover:underline">
    //       {requirement.name}
    //     </Link>
    //   );
    // },
  },
  {
    accessorKey: "description",
    header: "Description",
    size: 600,
  },
  // Add more columns here if needed, for example, for control counts or other properties
]; 