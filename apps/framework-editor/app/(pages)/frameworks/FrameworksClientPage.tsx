'use client'

import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { db } from "@comp/db";
import PageLayout from "@/app/components/PageLayout";
import { DataTable } from "@/app/components/DataTable";
import { columns } from "./components/columns"; 
import { CreateFrameworkDialog } from './components/CreateFrameworkDialog';
import type { FrameworkEditorFramework } from '@prisma/client';

interface FrameworksClientPageProps {
  initialFrameworks: FrameworkEditorFramework[];
}

export function FrameworksClientPage({ initialFrameworks }: FrameworksClientPageProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    return (
        <PageLayout breadcrumbs={[{ label: "Frameworks", href: "/frameworks" }]}>
            <DataTable 
                data={initialFrameworks}
                columns={columns} 
                searchQueryParamName="frameworks-search" 
                onCreateClick={() => setIsCreateDialogOpen(true)}
                createButtonLabel="Create New Framework"
            />
            <CreateFrameworkDialog 
                isOpen={isCreateDialogOpen} 
                onOpenChange={setIsCreateDialogOpen} 
                onFrameworkCreated={() => setIsCreateDialogOpen(false)}
            />
        </PageLayout>
    );
} 