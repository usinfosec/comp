'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { db } from "@comp/db"; // Removed: Cannot use db in client component
import PageLayout from "@/app/components/PageLayout";
import { DataTable } from "@/app/components/DataTable";
import { columns } from "./components/columns"; 
import { CreateFrameworkDialog } from './components/CreateFrameworkDialog';
import type { FrameworkEditorFramework } from '@prisma/client';

interface FrameworksClientPageProps {
  initialFrameworks: FrameworkEditorFramework[];
}

export function FrameworksClientPage({ initialFrameworks }: FrameworksClientPageProps) {
    const router = useRouter();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    // Local state to manage frameworks, initialized by prop
    const [frameworks, setFrameworks] = useState<FrameworkEditorFramework[]>(initialFrameworks);

    const refreshData = () => {
        router.refresh(); // This will re-run the data fetching in the parent Server Component
                        // and re-render this component with new initialFrameworks prop.
    };

    // Effect to update local state if the prop changes (e.g., after router.refresh)
    useEffect(() => {
        setFrameworks(initialFrameworks);
    }, [initialFrameworks]);

    return (
        <PageLayout title="Frameworks">
            <DataTable 
                data={frameworks} // Use local state for DataTable
                columns={columns} 
                searchQueryParamName="frameworks-search" 
                onCreateClick={() => setIsCreateDialogOpen(true)}
                createButtonLabel="Create New Framework"
            />
            <CreateFrameworkDialog 
                isOpen={isCreateDialogOpen} 
                onOpenChange={setIsCreateDialogOpen} 
                onFrameworkCreated={refreshData} 
            />
        </PageLayout>
    );
} 