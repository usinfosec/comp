"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { setToStorage } from "@/lib/storage"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { generateRandomId } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import EntityFormFields from "@/components/shared/entity-form-fields"
import EntityTabs from "@/components/shared/entity-tabs"
import ControlMappingEditor from "@/components/shared/control-mapping-editor"
import { useAppData } from "@/app/contexts/AppDataContext"
import type {
  TemplatePolicy as CompDataPolicy,
  Frequency as CompDataFrequency,
  Departments as CompDataDepartments,
  TemplateControl as CompDataControl
} from "@comp/data"
import EmptyState from "../ui/empty-state"
import type { 
  Frequency as AdminFrequency, 
  Departments as AdminDepartments,
  Control as AdminControl
} from "../../lib/types"

// Helper to get the enum values if they are not directly exported or for type safety
// These enums represent values compatible with CompDataFrequency/CompDataDepartments from @comp/data
const CompDataFrequencyEnum = { yearly: "yearly", quarterly: "quarterly", monthly: "monthly" } as const;
const CompDataDepartmentsEnum = { it: "it", hr: "hr", legal: "legal", finance: "finance", operations: "operations", engineering: "engineering" } as const;

export default function PoliciesManager() {
  const { toast } = useToast()
  const { appData, isLoading, reinitializeData } = useAppData()

  // Local UI state
  const [editingPolicyData, setEditingPolicyData] = useState<CompDataPolicy | null>(null)
  const [editingPolicyId, setEditingPolicyId] = useState<string | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [viewingPolicy, setViewingPolicy] = useState<CompDataPolicy | null>(null)

  const createEmptyCompDataPolicy = (): CompDataPolicy => {
    // This needs to precisely match the structure of TemplatePolicy from @comp/data
    // Assuming it has type, metadata (with id, slug, name etc.), and content
    return {
      type: "doc", // Or whatever the default type is
      metadata: {
        id: generateRandomId(), // Ensure 'id' is present and is a string
        slug: "",
        name: "",
        description: "",
        // Ensure these enums match the actual types in CompDataPolicy.metadata
        frequency: CompDataFrequencyEnum.yearly as CompDataFrequency,
        department: CompDataDepartmentsEnum.it as CompDataDepartments,
        // other metadata fields from CompDataPolicy...
      },
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "New Policy" }],
        },
      ],
      // other top-level fields from CompDataPolicy...
    } as CompDataPolicy; // Cast to ensure it matches the interface if some fields are optional
  }

  const [newPolicyData, setNewPolicyData] = useState<CompDataPolicy>(createEmptyCompDataPolicy())

  const handleAddPolicy = () => {
    if (!appData.policies) return;
    if (!newPolicyData.metadata.name) {
      toast({ title: "Validation Error", description: "Policy name is required.", variant: "destructive" })
      return
    }

    const newId = generateRandomId();
    let slug = newPolicyData.metadata.slug;
    if (!slug) {
      slug = newPolicyData.metadata.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }

    const policyToAdd: CompDataPolicy = {
      ...newPolicyData,
      metadata: {
        ...newPolicyData.metadata,
        id: newId, // Assign the generated ID to metadata.id if that's where it belongs
        slug,
      },
    };

    const updatedPolicies = {
      ...(appData.policies as Record<string, CompDataPolicy>), // Cast for adding new key
      [newId]: policyToAdd,
    }

    setToStorage("policies", updatedPolicies)
    reinitializeData()
    setNewPolicyData(createEmptyCompDataPolicy())
    setAddDialogOpen(false)
    toast({ title: "Policy Added", description: `${newPolicyData.metadata.name} has been added successfully.` })
  }

  const handleOpenEditDialog = (policyId: string) => {
    if (!appData.policies) return;
    const policyToEdit = (appData.policies as Record<string, CompDataPolicy>)[policyId];
    if (policyToEdit) {
      setEditingPolicyId(policyId);
      setEditingPolicyData({ ...policyToEdit }); // Create a copy for editing
      setEditDialogOpen(true);
    }
  };

  const handleEditPolicy = () => {
    if (!appData.policies || !editingPolicyId || !editingPolicyData || !editingPolicyData.metadata.name) {
      toast({ title: "Validation Error", description: "Policy name is required.", variant: "destructive" })
      return
    }

    let slug = editingPolicyData.metadata.slug;
    if (!slug) {
      slug = editingPolicyData.metadata.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }

    const policyToUpdate: CompDataPolicy = {
      ...editingPolicyData,
      metadata: {
        ...editingPolicyData.metadata,
        // id is already part of editingPolicyId, ensure metadata.id matches if different
        id: editingPolicyData.metadata.id || editingPolicyId, 
        slug,
      },
    };

    const updatedPolicies = {
      ...(appData.policies as Record<string, CompDataPolicy>),
      [editingPolicyId]: policyToUpdate,
    }

    setToStorage("policies", updatedPolicies)
    // If controls were mapped/unmapped, controls in storage might also need an update & reinitialize
    // For now, assuming ControlMappingEditor handles its own control state updates separately or Policy does not directly alter control mappings here.
    reinitializeData()
    setEditDialogOpen(false)
    setEditingPolicyData(null)
    setEditingPolicyId(null)
    toast({ title: "Policy Updated", description: `${editingPolicyData.metadata.name} has been updated successfully.` })
  }

  const handleDeletePolicy = (id: string) => {
    if (!appData.policies) return;
    if (confirm(`Are you sure you want to delete this policy? This action cannot be undone.`)) {
      const updatedPolicies = { ...(appData.policies as Record<string, CompDataPolicy>) };
      if (id in updatedPolicies) delete updatedPolicies[id];
      setToStorage("policies", updatedPolicies)
      reinitializeData()
      toast({ title: "Policy Deleted", description: "The policy has been deleted successfully." })
    }
  }

  const handleViewPolicy = (policyId: string) => {
    if (!appData.policies) return;
    const policyToView = (appData.policies as Record<string, CompDataPolicy>)[policyId];
    if (policyToView) {
      setViewingPolicy(policyToView)
      setViewDialogOpen(true)
    }
  }

  const handleControlMappingsChange = (updatedAdminControls: Record<string, AdminControl>) => {
    if (!appData.controls) return;

    // The editor provides updated controls with local AdminControl type.
    // We need to convert them back to CompDataControl for storage if their structures differ significantly,
    // or if setToStorage expects the @comp/data structure.
    // For now, let's assume a direct cast works or that setToStorage handles an array of either.
    // The original appData.controls was TemplateControl[] (CompDataControl[]).
    // ControlMappingEditor works with Record<string, AdminControl>.
    // We need to decide the format for setToStorage("controls", ...).
    // If setToStorage expects an array of CompDataControl:
    const controlsToStore: CompDataControl[] = Object.values(updatedAdminControls).map(
      adminControl => adminControl as unknown as CompDataControl
    );

    // If appData.controls was originally a Record, we might need to merge based on that structure.
    // However, appData.controls is TemplateControl[].

    setToStorage("controls", controlsToStore); 
    reinitializeData(); // This will refresh appData with the new controls state
    toast({ title: "Control Mappings Updated", description: "Policy to control mappings have been saved." });
  };

  const getControlsCount = (policyId: string): number => {
    if (!appData.controls) return 0;
    return appData.controls.filter((control) =>
      control.mappedArtifacts.some((artifact) => artifact.type === "policy" && artifact.policyId === policyId),
    ).length
  }

  const renderPolicyContent = (content: any[] | undefined) => {
    if (!content || !Array.isArray(content)) return null
    return content.map((item, index) => {
      if (item.type === "heading") {
        const HeadingTag = `h${item.attrs?.level || 2}` as keyof React.JSX.IntrinsicElements
        return (
          <HeadingTag key={index} className="mt-4 mb-2 font-bold">
            {item.content?.map((textItem: any, i: number) => textItem.text || "").join("")}
          </HeadingTag>
        )
      } else if (item.type === "paragraph") {
        return (
          <p key={index} className="mb-2">
            {item.content?.map((textItem: any, i: number) => textItem.text || "").join("")}
          </p>
        )
      } else if (item.type === "orderedList") {
        return (
          <ol key={index} className="list-decimal pl-5 mb-4">
            {item.content?.map((listItem: any, i: number) => (
              <li key={i}>
                {listItem.content?.map((paragraphItem: any) =>
                  paragraphItem.content?.map((textItem: any) => textItem.text || "").join(""),
                )}
              </li>
            ))}
          </ol>
        )
      } else if (item.type === "table") {
        return (
          <table key={index} className="w-full border-collapse mb-4">
            <tbody>
              {item.content?.map((row: any, rowIndex: number) => (
                <tr key={rowIndex} className="border-b">
                  {row.content?.map((cell: any, cellIndex: number) => (
                    <td key={cellIndex} className="border p-2">
                      {cell.content?.map((cellContent: any) =>
                        cellContent.content?.map((textItem: any) => textItem.text || "").join(""),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
      return null
    })
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading Policies Data...</div>;
  }

  if (!appData.policies || !appData.controls) { // Added controls check as it's used by getControlsCount
    return <EmptyState title="Data not available" description="Policy data or related dependencies could not be loaded." />;
  }
  
  const currentPolicies = appData.policies as Record<string, CompDataPolicy>; // For easier access

  // Memoize the transformation of appData.controls for ControlMappingEditor
  const controlsForEditor: Record<string, AdminControl> = useMemo(() => {
    if (!appData.controls) return {};
    return (appData.controls as CompDataControl[]).reduce((acc, control) => {
      acc[control.id] = control as unknown as AdminControl; // Cast @comp/data type to local admin type
      return acc;
    }, {} as Record<string, AdminControl>);
  }, [appData.controls]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Policies</h2>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2" onClick={() => setNewPolicyData(createEmptyCompDataPolicy())}>
              <Plus className="h-4 w-4" />
              Add Policy
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add New Policy</DialogTitle>
              <DialogDescription>Create a new policy document.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <EntityFormFields
                name={newPolicyData.metadata.name}
                description={newPolicyData.metadata.description}
                frequency={newPolicyData.metadata.frequency as unknown as AdminFrequency}
                department={newPolicyData.metadata.department as unknown as AdminDepartments}
                onNameChange={(value) => setNewPolicyData(p => ({ ...p, metadata: { ...p.metadata, name: value } }))}
                onDescriptionChange={(value) => setNewPolicyData(p => ({ ...p, metadata: { ...p.metadata, description: value } }))}
                onFrequencyChange={(value) => setNewPolicyData(p => ({ ...p, metadata: { ...p.metadata, frequency: value as unknown as CompDataFrequency } }))}
                onDepartmentChange={(value) => setNewPolicyData(p => ({ ...p, metadata: { ...p.metadata, department: value as unknown as CompDataDepartments } }))}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddPolicy}>Save Policy</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Controls Mapped</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(currentPolicies).map(([policyId, policy]) => (
            <TableRow key={policyId}>
              <TableCell className="font-medium">{policy.metadata.name}</TableCell>
              <TableCell>{policy.metadata.department}</TableCell>
              <TableCell>{policy.metadata.frequency}</TableCell>
              <TableCell>
                <Badge variant="secondary">{getControlsCount(policy.metadata.id || policyId)}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => handleViewPolicy(policyId)}>
                  <FileText className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleOpenEditDialog(policyId)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDeletePolicy(policyId)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {Object.keys(currentPolicies).length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No policies found. Add a new policy to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Edit Policy Dialog */}
      {editingPolicyData && editDialogOpen && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit Policy: {editingPolicyData.metadata.name}</DialogTitle>
              <DialogDescription>Update the policy details and content.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <EntityTabs
                entityType="policy"
                mappedControlsCount={getControlsCount(editingPolicyId!)}
                detailsContent={ 
                  <EntityFormFields
                    name={editingPolicyData.metadata.name}
                    description={editingPolicyData.metadata.description}
                    frequency={editingPolicyData.metadata.frequency as unknown as AdminFrequency}
                    department={editingPolicyData.metadata.department as unknown as AdminDepartments}
                    onNameChange={(value) => setEditingPolicyData(p => p ? ({ ...p, metadata: { ...p.metadata, name: value } }) : null)}
                    onDescriptionChange={(value) => setEditingPolicyData(p => p ? ({ ...p, metadata: { ...p.metadata, description: value } }) : null)}
                    onFrequencyChange={(value) => setEditingPolicyData(p => p ? ({ ...p, metadata: { ...p.metadata, frequency: value as unknown as CompDataFrequency } }) : null)}
                    onDepartmentChange={(value) => setEditingPolicyData(p => p ? ({ ...p, metadata: { ...p.metadata, department: value as unknown as CompDataDepartments } }) : null)}
                  />
                }
                mappingsContent={
                  <ControlMappingEditor 
                    controls={controlsForEditor} // Use memoized and transformed controls
                    entityId={editingPolicyId!} 
                    entityType="policy"
                    mappedControlsCount={getControlsCount(editingPolicyId!)} // Pass count for editor's internal use if any
                    onControlsChange={handleControlMappingsChange} // Pass the handler
                    // frameworkId is not needed for policy type
                  /> 
                }
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleEditPolicy}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* View Policy Dialog */}
      {viewingPolicy && viewDialogOpen && (
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{viewingPolicy.metadata.name}</DialogTitle>
              <DialogDescription>{viewingPolicy.metadata.description}</DialogDescription>
            </DialogHeader>
            <div className="prose max-w-none py-4">
              {renderPolicyContent(viewingPolicy.content)}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
