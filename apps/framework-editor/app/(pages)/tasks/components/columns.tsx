'use client';

import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import type { FrameworkEditorTaskTemplate } from '@prisma/client';

// Helper to format enum values (can be moved to a shared utils file if used in multiple places)
const formatEnumValue = (value: string) => {
  if (!value) return '';
  return value.replace(/_/g, ' ').charAt(0).toUpperCase() + value.slice(1).toLowerCase().replace(/_/g, ' ');
};

export const columns: ColumnDef<FrameworkEditorTaskTemplate>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    size: 250,
    cell: ({ row }) => {
      const task = row.original;
      return (
        <Link href={`/tasks/${task.id}`} className="hover:underline">
          {task.name}
        </Link>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    size: 450,
    minSize: 300,
  },
  {
    accessorKey: 'frequency',
    header: 'Frequency',
    size: 150,
    cell: ({ row }) => formatEnumValue(row.getValue('frequency')),
  },
  {
    accessorKey: 'department',
    header: 'Department',
    size: 150,
    cell: ({ row }) => formatEnumValue(row.getValue('department')),
  },
  // TODO: Add column for controlTemplates if needed
]; 