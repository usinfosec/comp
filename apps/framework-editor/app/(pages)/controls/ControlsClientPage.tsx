'use client';

import { useState } from 'react';
import PageLayout from "@/app/components/PageLayout";
import { CreateControlDialog } from './components/CreateControlDialog';
import type { FrameworkEditorControlTemplate } from '@prisma/client';
import { useRouter } from 'next/navigation';

import {
  DataSheetGrid,
  textColumn,
  keyColumn,
  Column,
  CellProps,
} from 'react-datasheet-grid';
import 'react-datasheet-grid/dist/style.css';
import { Button } from '@comp/ui/button';

interface FrameworkEditorControlTemplateWithRelatedData extends FrameworkEditorControlTemplate {
  policyTemplates?: { id: string; name: string }[];
  requirements?: { id: string; name: string }[];
  taskTemplates?: { id: string; name: string }[];
}

interface ControlsClientPageProps {
  initialControls: FrameworkEditorControlTemplateWithRelatedData[];
}

type GridData = {
  id: string;
  name: string | null;
  description: string | null;
  policyTemplatesCount: string | null;
  requirementsCount: string | null;
  taskTemplatesCount: string | null;
};

// Custom Cell Component for Actions
const ActionCell: React.FC<CellProps<GridData, any>> = ({ rowData, focus, active }) => {
  const router = useRouter();

  if (!rowData) {
    return null;
  }

  const handleNavigate = () => {
    router.push(`/controls/${rowData.id}`);
  };

  return (
    <div className="flex w-full p-1">
      <Button 
        onClick={handleNavigate} 
        disabled={!rowData}
        size="sm"
        variant="outline"
        className='w-full'
        title={`View details for ${rowData.name || 'control'}`}
      >
        View →
      </Button>
    </div>
  );
};

export function ControlsClientPage({ initialControls }: ControlsClientPageProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const router = useRouter();
    
    const [data, setData] = useState<GridData[]>(
      initialControls.map(control => ({
        id: control.id,
        name: control.name ?? null,
        description: control.description ?? null,
        policyTemplatesCount: (control.policyTemplates?.length ?? 0).toString(),
        requirementsCount: (control.requirements?.length ?? 0).toString(),
        taskTemplatesCount: (control.taskTemplates?.length ?? 0).toString(),
      }))
    );

    const columns: Column<GridData>[] = [
      { ...keyColumn('name', textColumn), title: 'Name' },
      { ...keyColumn('description', textColumn), title: 'Description' },
      { ...keyColumn('policyTemplatesCount', textColumn), title: 'Policy Templates' },
      { ...keyColumn('requirementsCount', textColumn), title: 'Requirements' },
      { ...keyColumn('taskTemplatesCount', textColumn), title: 'Task Templates' },
      {
        id: 'actions',
        title: 'Actions',
        component: ActionCell,
        width: 1,
        minWidth: 100,
      }
    ];
    
    return (
        <PageLayout breadcrumbs={[{ label: "Controls", href: "/controls" }]}>
            <button 
              onClick={() => setIsCreateDialogOpen(true)} 
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create New Control
            </button>
            
            <DataSheetGrid
              value={data}
              onChange={setData}
              columns={columns}
            />
            
            <CreateControlDialog 
                isOpen={isCreateDialogOpen} 
                onOpenChange={setIsCreateDialogOpen} 
                onControlCreated={() => {
                  setIsCreateDialogOpen(false);
                  router.refresh();
                }}
            />
        </PageLayout>
    );
} 