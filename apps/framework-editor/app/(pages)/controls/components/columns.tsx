'use client';

import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import type { FrameworkEditorControlTemplate } from '@prisma/client';

export const columns: ColumnDef<FrameworkEditorControlTemplate>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    size: 350,
    cell: ({ row }) => {
      const control = row.original;
      return (
        <Link href={`/controls/${control.id}`} className="hover:underline">
          {control.name}
        </Link>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    size: 700,
    minSize: 400,
    cell: ({ row }) => {
      const description = row.getValue('description') as string;
      return (
        <div style={{ wordBreak: 'break-word' }}>
          {description}
        </div>
      );
    },
  },
  // TODO: Add columns for policyTemplates, requirements, taskTemplates if needed
  // This might involve custom cell renderers to display counts or summaries.
  // Example for displaying count of policy templates:
  // {
  //   id: 'policyTemplatesCount',
  //   header: 'Policy Templates',
  //   accessorFn: row => row.policyTemplates?.length || 0,
  //   cell: ({ getValue }) => `${getValue()} policies`
  // },
]; 