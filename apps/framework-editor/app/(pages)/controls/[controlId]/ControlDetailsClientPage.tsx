'use client'

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
// import Link from 'next/link'; // No longer directly used for list items here
import PageLayout from '@/app/components/PageLayout';
import type { ControlDetailsWithRelations } from './page';
import { Button } from '@comp/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@comp/ui/card";
import { PencilIcon, Trash2, FileText, ListChecks } from 'lucide-react'; // Added ListChecks
// SearchAndLinkList will be used in a dialog, so not imported directly at top level for inline use ananymore
// import { SearchAndLinkList, type SearchableItemForLinking } from '@/app/components/SearchAndLinkList'; 
import type { SearchableItemForLinking } from '@/app/components/SearchAndLinkList'; // Keep type for handlers
import { Badge } from "@comp/ui/badge"; // Import Badge

import {
  getAllRequirements,
  linkRequirementToControl,
  unlinkRequirementFromControl,
  getAllPolicyTemplates,
  linkPolicyTemplateToControl,
  unlinkPolicyTemplateFromControl,
  getAllTaskTemplates,
  linkTaskTemplateToControl,
  unlinkTaskTemplateFromControl,
} from '../actions';
import { ManageLinksDialog } from './components/ManageLinksDialog'; // We will create this next
import { EditControlDialog } from './components/EditControlDialog'; // Import Edit Dialog
import { DeleteControlDialog } from './components/DeleteControlDialog'; // Import Delete Dialog

// We'll need to define these dialogs later
// import { EditControlDialog } from './components/EditControlDialog'; 
// import { DeleteControlDialog } from './components/DeleteControlDialog';

interface ControlDetailsClientPageProps {
  controlDetails: ControlDetailsWithRelations;
}

export function ControlDetailsClientPage({ controlDetails }: ControlDetailsClientPageProps) {
    const router = useRouter();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); 
    const [isManageRequirementsDialogOpen, setIsManageRequirementsDialogOpen] = useState(false);

    const handleControlUpdated = () => {
        setIsEditDialogOpen(false); // Dialog handles its own closing on success
        router.refresh();
    };

    const handleControlDeleted = () => {
        setIsDeleteDialogOpen(false); // Dialog handles its own closing on success
        router.push('/controls'); // Navigate back to the controls list after deletion
        // router.refresh(); // Navigating away, so refresh of current page isn't primary focus
    };

    // --- Requirements Management Data & Handlers (will be passed to dialog) --- 
    const requirementIds = useMemo(() => 
        new Set(controlDetails.requirements?.map(req => req.id) || [])
    , [controlDetails.requirements]);

    // currentRequirementDetails are the full objects for display in the dialog's "currently linked" list
    const currentRequirementDetails: SearchableItemForLinking[] = useMemo(() => 
        controlDetails.requirements?.map(req => ({ 
            id: req.id, 
            name: req.name, 
            frameworkName: req.framework?.name || undefined,
            framework: req.framework === null ? undefined : req.framework // Map null to undefined
        })) || [] 
    , [controlDetails.requirements]);

    const handleGetAllRequirements = async (): Promise<SearchableItemForLinking[]> => {
        // Server action now returns items with frameworkName mapped
        return getAllRequirements(); 
    };

    const handleLinkRequirement = async (item: SearchableItemForLinking) => {
        try { await linkRequirementToControl(controlDetails.id, item.id); router.refresh(); }
        catch (error) { console.error("Failed to link requirement:", error); throw error; }
    };

    const handleUnlinkRequirement = async (item: SearchableItemForLinking) => {
        try { await unlinkRequirementFromControl(controlDetails.id, item.id); router.refresh(); }
        catch (error) { console.error("Failed to unlink requirement:", error); throw error; }
    };

    const renderRequirementDisplay = (item: SearchableItemForLinking) => (
      <div className="flex items-center">
        <span className='truncate mr-2' title={item.name}>{item.name}</span>
        {item.frameworkName && (
          <Badge variant="outline" className="text-xs whitespace-nowrap shrink-0 rounded-sm">
            {item.frameworkName}
          </Badge>
        )}
      </div>
    );
    // --- End Requirements Management ---

    // --- Policy Templates Management (Placeholder) ---
    const policyTemplateIds = useMemo(() => new Set(controlDetails.policyTemplates?.map(pt => pt.id) || []), [controlDetails.policyTemplates]);
    const currentPolicyTemplateDetails: SearchableItemForLinking[] = useMemo(() => controlDetails.policyTemplates?.map(pt => ({ id: pt.id, name: pt.name })) || [], [controlDetails.policyTemplates]);
    const [isManagePolicyTemplatesDialogOpen, setIsManagePolicyTemplatesDialogOpen] = useState(false);

    const handleGetAllPolicyTemplates = async (): Promise<SearchableItemForLinking[]> => {
        // console.warn("TODO: Implement getAllPolicyTemplates server action");
        // return []; // Placeholder
        return getAllPolicyTemplates();
    };
    const handleLinkPolicyTemplate = async (item: SearchableItemForLinking) => {
        // console.warn("TODO: Implement linkPolicyTemplateToControl server action for item:", item.id);
        try { await linkPolicyTemplateToControl(controlDetails.id, item.id); router.refresh(); }
        catch (error) { console.error("Failed to link policy template:", error); throw error; }
    };
    const handleUnlinkPolicyTemplate = async (item: SearchableItemForLinking) => {
        // console.warn("TODO: Implement unlinkPolicyTemplateFromControl server action for item:", item.id);
        try { await unlinkPolicyTemplateFromControl(controlDetails.id, item.id); router.refresh(); }
        catch (error) { console.error("Failed to unlink policy template:", error); throw error; }
    };
    const renderPolicyTemplateDisplay = (item: SearchableItemForLinking) => (
      <div className="flex items-center">
        <span className='truncate mr-2' title={item.name}>{item.name}</span>
        {/* Add badge here if policy templates have a distinguishing property like frameworkName */}
      </div>
    );
    // --- End Policy Templates Management ---

    // --- Task Templates Management (Placeholder) ---
    const taskTemplateIds = useMemo(() => new Set(controlDetails.taskTemplates?.map(tt => tt.id) || []), [controlDetails.taskTemplates]);
    const currentTaskTemplateDetails: SearchableItemForLinking[] = useMemo(() => controlDetails.taskTemplates?.map(tt => ({ id: tt.id, name: tt.name })) || [], [controlDetails.taskTemplates]);
    const [isManageTaskTemplatesDialogOpen, setIsManageTaskTemplatesDialogOpen] = useState(false);

    const handleGetAllTaskTemplates = async (): Promise<SearchableItemForLinking[]> => {
        // console.warn("TODO: Implement getAllTaskTemplates server action");
        // return []; // Placeholder
        return getAllTaskTemplates();
    };
    const handleLinkTaskTemplate = async (item: SearchableItemForLinking) => {
        // console.warn("TODO: Implement linkTaskTemplateToControl server action for item:", item.id);
        try { await linkTaskTemplateToControl(controlDetails.id, item.id); router.refresh(); }
        catch (error) { console.error("Failed to link task template:", error); throw error; }
    };
    const handleUnlinkTaskTemplate = async (item: SearchableItemForLinking) => {
        // console.warn("TODO: Implement unlinkTaskTemplateFromControl server action for item:", item.id);
        try { await unlinkTaskTemplateFromControl(controlDetails.id, item.id); router.refresh(); }
        catch (error) { console.error("Failed to unlink task template:", error); throw error; }
    };
    const renderTaskTemplateDisplay = (item: SearchableItemForLinking) => (
      <div className="flex items-center">
        <span className='truncate mr-2' title={item.name}>{item.name}</span>
        {/* Add badge here if task templates have a distinguishing property */}
      </div>
    );
    // --- End Task Templates Management ---

    return (
        <PageLayout 
            breadcrumbs={[
                { label: "Controls", href: "/controls" },
                { label: controlDetails.name, href: `/controls/${controlDetails.id}` }
            ]}
        >
            <Card className="w-full shadow-none rounded-sm">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                {controlDetails.name}
                                {/* Example: Displaying a 'family' if it exists on the model */} 
                                {/* {controlDetails.family && (
                                    <Badge variant="outline" className="ml-2 text-sm font-normal">
                                        Family: {controlDetails.family}
                                    </Badge>
                                )} */}
                            </CardTitle>
                            <CardDescription className="mt-2 text-base">
                                {controlDetails.description || "No description provided."}
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)} className="gap-1 rounded-sm">
                                <PencilIcon className="h-4 w-4" />
                                Edit Details
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)} className="gap-1 rounded-sm">
                                <Trash2 className="h-4 w-4" />
                                Delete Control
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">ID:</span> {controlDetails.id}
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {/* Requirements Section */}
                <Card className="w-full shadow-none rounded-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-semibold">Requirements</CardTitle>
                        <Button variant="outline" size="sm" onClick={() => setIsManageRequirementsDialogOpen(true)} className="gap-1 rounded-sm">
                            <ListChecks className="h-4 w-4" />
                            Manage ({currentRequirementDetails.length})
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {currentRequirementDetails.length > 0 ? (
                            <div className="space-y-1">
                                {currentRequirementDetails.map(req => (
                                    <div key={req.id} className="text-sm text-muted-foreground">
                                        {renderRequirementDisplay(req)}
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-sm text-muted-foreground">No requirements currently associated.</p>}
                    </CardContent>
                </Card>

                <Card className="w-full shadow-none rounded-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-semibold">Policies</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setIsManagePolicyTemplatesDialogOpen(true)} className="gap-1 rounded-sm">
                        <FileText className="h-4 w-4" /> {/* Using FileText as an example icon */}
                        Manage ({currentPolicyTemplateDetails.length})
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {currentPolicyTemplateDetails.length > 0 ? (
                        <div className="space-y-1">
                            {currentPolicyTemplateDetails.map(pt => (
                                <div key={pt.id} className="text-sm text-muted-foreground">
                                    {renderPolicyTemplateDisplay(pt)}
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-sm text-muted-foreground">No policy templates currently associated.</p>}
                  </CardContent>
                </Card>
                
                <Card className="w-full shadow-none rounded-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-semibold">Tasks</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setIsManageTaskTemplatesDialogOpen(true)} className="gap-1 rounded-sm">
                        <ListChecks className="h-4 w-4" /> {/* Using ListChecks as an example icon */}
                        Manage ({currentTaskTemplateDetails.length})
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {currentTaskTemplateDetails.length > 0 ? (
                        <div className="space-y-1">
                            {currentTaskTemplateDetails.map(tt => (
                                <div key={tt.id} className="text-sm text-muted-foreground">
                                    {renderTaskTemplateDisplay(tt)}
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-sm text-muted-foreground">No task templates currently associated.</p>}
                  </CardContent>
                </Card>
            </div>

            {isManageRequirementsDialogOpen && (
                <ManageLinksDialog
                    isOpen={isManageRequirementsDialogOpen}
                    onOpenChange={setIsManageRequirementsDialogOpen}
                    itemTypeLabel="Requirement"
                    title="Link Requirements"
                    linkedItemIds={requirementIds}
                    currentLinkedItemsDetails={currentRequirementDetails}
                    getAllItemsFunction={handleGetAllRequirements}
                    onLinkItem={handleLinkRequirement}
                    onUnlinkItem={handleUnlinkRequirement}
                    renderItemDisplay={renderRequirementDisplay}
                />
            )}

            {isManagePolicyTemplatesDialogOpen && (
                <ManageLinksDialog
                    isOpen={isManagePolicyTemplatesDialogOpen}
                    onOpenChange={setIsManagePolicyTemplatesDialogOpen}
                    itemTypeLabel="Policy Template"
                    title="Link Policy Templates"
                    linkedItemIds={policyTemplateIds}
                    currentLinkedItemsDetails={currentPolicyTemplateDetails}
                    getAllItemsFunction={handleGetAllPolicyTemplates}
                    onLinkItem={handleLinkPolicyTemplate}
                    onUnlinkItem={handleUnlinkPolicyTemplate}
                    renderItemDisplay={renderPolicyTemplateDisplay}
                />
            )}

            {isManageTaskTemplatesDialogOpen && (
                <ManageLinksDialog
                    isOpen={isManageTaskTemplatesDialogOpen}
                    onOpenChange={setIsManageTaskTemplatesDialogOpen}
                    itemTypeLabel="Task"
                    title="Link Tasks"
                    linkedItemIds={taskTemplateIds}
                    currentLinkedItemsDetails={currentTaskTemplateDetails}
                    getAllItemsFunction={handleGetAllTaskTemplates}
                    onLinkItem={handleLinkTaskTemplate}
                    onUnlinkItem={handleUnlinkTaskTemplate}
                    renderItemDisplay={renderTaskTemplateDisplay}
                />
            )}

            {/* Edit Control Dialog */}
            {isEditDialogOpen && (
                <EditControlDialog 
                    isOpen={isEditDialogOpen} 
                    onOpenChange={setIsEditDialogOpen} 
                    control={controlDetails} 
                    onControlUpdated={handleControlUpdated}
                />
            )}

            {/* Delete Control Dialog */}
            {isDeleteDialogOpen && (
                <DeleteControlDialog
                    isOpen={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    controlId={controlDetails.id}
                    controlName={controlDetails.name}
                    onControlDeleted={handleControlDeleted}
                />
            )}
        </PageLayout>
    );
} 