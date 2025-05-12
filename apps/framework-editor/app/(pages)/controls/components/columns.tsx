'use client';

import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import type { FrameworkEditorControlTemplate } from '@prisma/client';
import { Badge } from "@comp/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@comp/ui/tooltip";

// Define types for related data
interface RelatedRecord {
  id: string;
  name: string;
}

interface RelatedRequirement extends RelatedRecord {
  framework?: {
    name?: string;
  };
}

// Updated type for control template with related data arrays
interface FrameworkEditorControlTemplateWithRelatedData extends FrameworkEditorControlTemplate {
  policyTemplates?: RelatedRecord[];
  requirements?: RelatedRequirement[];
  taskTemplates?: RelatedRecord[];
}

export const columns: ColumnDef<FrameworkEditorControlTemplateWithRelatedData>[] = [
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
    size: 550, 
    minSize: 300,
    cell: ({ row }) => {
      const description = row.getValue('description') as string;
      return (
        <div style={{ wordBreak: 'break-word' }}>
          {description}
        </div>
      );
    },
  },
  {
    id: 'policyTemplates',
    header: 'Policy Templates',
    size: 150,
    accessorFn: row => row.policyTemplates?.length ?? 0,
    cell: ({ row }) => {
      const policyTemplates = row.original.policyTemplates ?? [];
      const count = policyTemplates.length;

      if (count === 0) {
        return <Badge variant="secondary">{count}</Badge>;
      }

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="cursor-pointer hover:bg-muted">{count}</Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium mb-1">Policy Templates:</p>
              {policyTemplates.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  {policyTemplates.map(pt => <li key={pt.id}>{pt.name}</li>)}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">None</p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: 'requirements',
    header: 'Requirements',
    size: 150,
    accessorFn: row => row.requirements?.length ?? 0,
    cell: ({ row }) => {
      const requirements = row.original.requirements ?? [];
      const count = requirements.length;

      if (count === 0) {
        return <Badge variant="secondary">{count}</Badge>;
      }

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="cursor-pointer hover:bg-muted">{count}</Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium mb-1">Requirements:</p>
              {requirements.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  {requirements.map(req => (
                    <li key={req.id}>
                      {req.name}
                      {req.framework?.name ? <span className="text-muted-foreground ml-1">({req.framework.name})</span> : ''}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">None</p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: 'taskTemplates',
    header: 'Task Templates',
    size: 150,
    accessorFn: row => row.taskTemplates?.length ?? 0,
    cell: ({ row }) => {
      const taskTemplates = row.original.taskTemplates ?? [];
      const count = taskTemplates.length;

      if (count === 0) {
        return <Badge variant="secondary">{count}</Badge>;
      }

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="cursor-pointer hover:bg-muted">{count}</Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium mb-1">Task Templates:</p>
              {taskTemplates.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  {taskTemplates.map(tt => <li key={tt.id}>{tt.name}</li>)}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">None</p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];