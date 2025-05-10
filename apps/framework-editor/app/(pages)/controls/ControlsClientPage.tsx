'use client';

import { useState } from 'react';
import PageLayout from "@/app/components/PageLayout";
import { DataTable } from "@/app/components/DataTable";
import { columns } from "./components/columns"; 
import { CreateControlDialog } from './components/CreateControlDialog';
import type { FrameworkEditorControlTemplate } from '@prisma/client';
import { useRouter } from 'next/navigation';

interface ControlsClientPageProps {
  initialControls: FrameworkEditorControlTemplate[];
}

export function ControlsClientPage({ initialControls }: ControlsClientPageProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const router = useRouter(); // Uncomment if needed

    const handleRowClick = (control: FrameworkEditorControlTemplate) => {
        router.push(`/controls/${control.id}`);
    };

    return (
        <PageLayout breadcrumbs={[{ label: "Controls", href: "/controls" }]}>
            <DataTable 
                data={initialControls}
                columns={columns} 
                searchQueryParamName="controls-search" 
                searchPlaceholder="Search controls..."
                onCreateClick={() => setIsCreateDialogOpen(true)}
                createButtonLabel="Create New Control"
                onRowClick={handleRowClick}
            />
            <CreateControlDialog 
                isOpen={isCreateDialogOpen} 
                onOpenChange={setIsCreateDialogOpen} 
                onControlCreated={() => {
                  setIsCreateDialogOpen(false);
                }}
            />
        </PageLayout>
    );
} 