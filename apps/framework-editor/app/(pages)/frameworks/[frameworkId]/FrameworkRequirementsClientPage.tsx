'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from "@/app/components/PageLayout";
import { DataTable } from "@/app/components/DataTable";
import { getColumns } from "./components/columns";
import type { FrameworkEditorRequirement, FrameworkEditorFramework } from '@prisma/client';
import { Button } from '@comp/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@comp/ui/card";
import { Badge } from "@comp/ui/badge";
import { PencilIcon, FileText, Trash2 } from 'lucide-react';
import { EditFrameworkDialog } from './components/EditFrameworkDialog';
import { EditRequirementDialog } from './components/EditRequirementDialog';

interface FrameworkDetails extends Pick<FrameworkEditorFramework, 'id' | 'name' | 'version' | 'description'> {}

interface FrameworkRequirementsClientPageProps {
  frameworkDetails: FrameworkDetails;
  initialRequirements: FrameworkEditorRequirement[];
}

interface SelectedRequirementToEdit extends FrameworkEditorRequirement {
  frameworkId: string;
}

export function FrameworkRequirementsClientPage({ 
  frameworkDetails,
  initialRequirements 
}: FrameworkRequirementsClientPageProps) {
    const router = useRouter();
    const [isFrameworkEditDialogOpen, setIsFrameworkEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    
    const [requirementsList, setRequirementsList] = useState<FrameworkEditorRequirement[]>(initialRequirements);

    const [isEditRequirementDialogOpen, setIsEditRequirementDialogOpen] = useState(false);
    const [selectedRequirement, setSelectedRequirement] = useState<SelectedRequirementToEdit | null>(null);

    useEffect(() => {
      setRequirementsList(initialRequirements);
    }, [initialRequirements]);

    const handleFrameworkUpdated = () => {
        setIsFrameworkEditDialogOpen(false);
        router.refresh();
    };

    const handleOpenEditRequirementDialog = (requirement: FrameworkEditorRequirement) => {
      setSelectedRequirement({ ...requirement, frameworkId: frameworkDetails.id });
      setIsEditRequirementDialogOpen(true);
    };

    const handleRequirementUpdated = (updatedRequirement: Pick<FrameworkEditorRequirement, 'id' | 'name' | 'description'>) => {
      setRequirementsList(prevList => 
        prevList.map(req => 
          req.id === updatedRequirement.id ? { ...req, ...updatedRequirement } : req
        )
      );
      setIsEditRequirementDialogOpen(false);
    };

    const columns = getColumns(handleOpenEditRequirementDialog);

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
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setIsFrameworkEditDialogOpen(true)} className="gap-1">
                                <PencilIcon className="h-4 w-4" />
                                Edit Details
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)} className="gap-1">
                                <Trash2 className="h-4 w-4" />
                                Delete Framework
                            </Button>
                        </div>
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
                data={requirementsList}
                columns={columns}
                searchQueryParamName={`${frameworkDetails.id}-requirements-search`} 
                searchPlaceholder="Search requirements..."
            />
            {isFrameworkEditDialogOpen && (
                <EditFrameworkDialog 
                    isOpen={isFrameworkEditDialogOpen} 
                    onOpenChange={setIsFrameworkEditDialogOpen} 
                    framework={frameworkDetails}
                    onFrameworkUpdated={handleFrameworkUpdated}
                />
            )}
            {isEditRequirementDialogOpen && selectedRequirement && (
                <EditRequirementDialog
                    isOpen={isEditRequirementDialogOpen}
                    onOpenChange={setIsEditRequirementDialogOpen}
                    requirement={selectedRequirement}
                    onRequirementUpdated={handleRequirementUpdated}
                />
            )}
        </PageLayout>
    );
} 