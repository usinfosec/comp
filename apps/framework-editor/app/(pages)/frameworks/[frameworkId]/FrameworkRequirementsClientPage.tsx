'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from "@/app/components/PageLayout";
import { DataTable } from "@/app/components/DataTable";
import { columns } from "./components/columns"; 
import type { FrameworkEditorRequirement, FrameworkEditorFramework } from '@prisma/client';
import { Button } from '@comp/ui/button';
import { PencilIcon } from 'lucide-react';
import { EditFrameworkDialog } from './components/EditFrameworkDialog';

interface FrameworkDetails extends Pick<FrameworkEditorFramework, 'id' | 'name' | 'version' | 'description'> {}

interface FrameworkRequirementsClientPageProps {
  frameworkDetails: FrameworkDetails;
  initialRequirements: FrameworkEditorRequirement[];
}

export function FrameworkRequirementsClientPage({ 
  frameworkDetails,
  initialRequirements 
}: FrameworkRequirementsClientPageProps) {
    const router = useRouter();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleFrameworkUpdated = () => {
        setIsEditDialogOpen(false);
        router.refresh();
    };

    return (
        <PageLayout 
            breadcrumbs={[
                { label: "Frameworks", href: "/frameworks" },
                { label: frameworkDetails.name, href: `/frameworks/${frameworkDetails.id}` }
            ]}
        >
            <div className="mb-4 rounded-sm border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold">{frameworkDetails.name}</h2>
                    <Button variant="outline" size="icon" onClick={() => setIsEditDialogOpen(true)}>
                        <PencilIcon className="h-4 w-4" />
                        <span className="sr-only">Edit Framework</span>
                    </Button>
                </div>
                <span className="text-sm text-muted-foreground">Version: {frameworkDetails.version}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{frameworkDetails.description}</p>
              <p className="mt-2 text-xs text-muted-foreground">ID: {frameworkDetails.id}</p>
            </div>
            <DataTable 
                data={initialRequirements}
                columns={columns} 
                searchQueryParamName={`${frameworkDetails.id}-requirements-search`} 
                searchPlaceholder="Search requirements..."
            />
            {isEditDialogOpen && (
                <EditFrameworkDialog 
                    isOpen={isEditDialogOpen} 
                    onOpenChange={setIsEditDialogOpen} 
                    framework={frameworkDetails}
                    onFrameworkUpdated={handleFrameworkUpdated}
                />
            )}
        </PageLayout>
    );
} 