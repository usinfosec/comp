'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from "@/app/components/PageLayout";
import { DataTable } from "@/app/components/DataTable";
import { columns } from "./components/columns"; 
import type { FrameworkEditorRequirement, FrameworkEditorFramework } from '@prisma/client';
import { Button } from '@comp/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@comp/ui/card";
import { Badge } from "@comp/ui/badge";
import { PencilIcon, FileText } from 'lucide-react';
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
            <Card className="w-full mb-6 shadow-none">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                {frameworkDetails.name}
                                <Badge variant="outline" className="ml-2 text-sm font-normal">
                                    Version: {frameworkDetails.version}
                                </Badge>
                            </CardTitle>
                            <CardDescription className="mt-2 text-base">
                                {frameworkDetails.description}
                            </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)} className="gap-1">
                            <PencilIcon className="h-4 w-4" />
                            Edit Details
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">ID:</span> {frameworkDetails.id}
                    </div>
                </CardContent>
            </Card>

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