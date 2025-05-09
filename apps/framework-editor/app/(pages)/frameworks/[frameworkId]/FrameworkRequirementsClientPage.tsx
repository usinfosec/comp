'use client'

import { useState } from 'react';
import PageLayout from "@/app/components/PageLayout";
import { DataTable } from "@/app/components/DataTable";
import { columns } from "./components/columns"; 
import type { FrameworkEditorRequirement } from '@prisma/client';
// Import CreateRequirementDialog if you intend to add create functionality later
// import { CreateRequirementDialog } from './components/CreateRequirementDialog'; 

// Define an interface for the framework details
interface FrameworkDetails {
  id: string;
  name: string;
  version: string;
  description: string;
}

interface FrameworkRequirementsClientPageProps {
  frameworkDetails: FrameworkDetails; // Use the new interface here
  initialRequirements: FrameworkEditorRequirement[];
}

export function FrameworkRequirementsClientPage({ 
  frameworkDetails,
  initialRequirements 
}: FrameworkRequirementsClientPageProps) {
    // const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    return (
        <PageLayout 
            breadcrumbs={[
                { label: "Frameworks", href: "/frameworks" },
                // Use frameworkDetails for breadcrumbs
                { label: frameworkDetails.name, href: `/frameworks/${frameworkDetails.id}` }
            ]}
        >
            <div className="mb-4 rounded-sm border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{frameworkDetails.name}</h2>
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
                // onCreateClick={() => setIsCreateDialogOpen(true)} // Uncomment if create functionality is added
                // createButtonLabel="Add Requirement"
            />
            {/* <CreateRequirementDialog 
                isOpen={isCreateDialogOpen} 
                onOpenChange={setIsCreateDialogOpen} 
                onRequirementCreated={() => setIsCreateDialogOpen(false)}
                frameworkId={frameworkDetails.id} // Pass frameworkId if dialog needs it
            /> */}
        </PageLayout>
    );
} 