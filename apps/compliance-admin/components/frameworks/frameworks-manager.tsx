"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import FrameworkForm from "./framework-form"
import type { Framework as CompDataFramework } from "@comp/data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { generateRandomId } from "@/lib/utils"
import { useAppData } from "../../app/contexts/AppDataContext"

export default function FrameworksManager() {
  const { toast } = useToast()
  const { appData, addFramework, updateFramework, deleteFramework, isLoading } = useAppData()

  // State for the "Add New Framework" form inputs, including a temporary ID for the form
  const [newFrameworkFormState, setNewFrameworkFormState] = useState<{
    tempId: string;
    data: Omit<CompDataFramework, 'id'>; // Form deals with data fields, actual ID is generated on submit
  }>({ tempId: generateRandomId(), data: { name: "", version: "", description: "" } });
  
  // State for the "Edit Framework" form inputs and which framework is being edited
  const [editingFrameworkData, setEditingFrameworkData] = useState<{ id: string; data: CompDataFramework } | null>(null);

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const frameworksToDisplay = appData.frameworks || {};

  const handleOpenAddDialog = () => {
    // Reset form with a new temporary ID
    setNewFrameworkFormState({ tempId: generateRandomId(), data: { name: "", version: "", description: "" } });
    setAddDialogOpen(true);
  };

  const handleAddFrameworkSubmit = () => {
    if (!newFrameworkFormState.data.name) {
      toast({
        title: "Validation Error",
        description: "Framework name is required.",
        variant: "destructive",
      })
      return
    }
    const newActualId = generateRandomId(); // This is the ID that will be stored
    const frameworkToAdd: CompDataFramework = {
      // id: newActualId, // id is part of the CompDataFramework structure but usually assigned by the backend/storage key
      name: newFrameworkFormState.data.name,
      version: newFrameworkFormState.data.version || "",
      description: newFrameworkFormState.data.description || "",
      // Ensure all required fields of CompDataFramework are here. If CompDataFramework itself
      // doesn't have an 'id' field (e.g. it's Record<string, Omit<CompDataFramework, 'id'>>),
      // then this structure is fine. Assuming CompDataFramework is the value type and ID is the key.
    };

    addFramework(newActualId, frameworkToAdd);
    setAddDialogOpen(false);
    toast({
      title: "Framework Added",
      description: `${frameworkToAdd.name} has been added successfully.`,
    });
  };

  const handleOpenEditDialog = (id: string, framework: CompDataFramework) => {
    setEditingFrameworkData({ id, data: { ...framework } });
    setEditDialogOpen(true);
  };

  const handleEditFrameworkSubmit = () => {
    if (!editingFrameworkData || !editingFrameworkData.data.name) {
      toast({
        title: "Validation Error",
        description: "Framework name is required.",
        variant: "destructive",
      });
      return;
    }

    updateFramework(editingFrameworkData.id, editingFrameworkData.data);
    setEditDialogOpen(false);
    toast({
      title: "Framework Updated",
      description: `${editingFrameworkData.data.name} has been updated successfully.`,
    });
    setEditingFrameworkData(null);
  };

  const handleDeleteFrameworkClick = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete framework "${name}"? This action cannot be undone.`)) {
      deleteFramework(id);
      toast({
        title: "Framework Deleted",
        description: `Framework "${name}" has been deleted successfully.`,
      });
    }
  };

  if (isLoading) {
    return <div>Loading framework data...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Frameworks</h2>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2" onClick={handleOpenAddDialog}>
              <Plus className="h-4 w-4" />
              Add Framework
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Framework</DialogTitle>
              <DialogDescription>Create a new compliance framework.</DialogDescription>
            </DialogHeader>
            <FrameworkForm
              id={newFrameworkFormState.tempId} // Provide the temporary ID
              data={newFrameworkFormState.data as CompDataFramework} // Cast data part to full CompDataFramework if needed, or ensure types match
              isEditing={false}
              onChange={(formId, formData) => setNewFrameworkFormState({ tempId: formId, data: formData })} // Update state with tempId and data
              onSubmit={handleAddFrameworkSubmit}
              onCancel={() => setAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {Object.keys(frameworksToDisplay).length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(frameworksToDisplay).map(([id, framework]) => (
                <TableRow key={id}>
                  <TableCell className="font-medium">{id}</TableCell>
                  <TableCell>{framework.name}</TableCell>
                  <TableCell>{framework.version}</TableCell>
                  <TableCell className="max-w-md truncate">{framework.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleOpenEditDialog(id, framework)}
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleDeleteFrameworkClick(id, framework.name)}
                      >
                        <Trash className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center p-12 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No frameworks added yet. Click "Add Framework" to create one.</p>
        </div>
      )}

      {editingFrameworkData && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Framework</DialogTitle>
              <DialogDescription>Update the framework details.</DialogDescription>
            </DialogHeader>
            <FrameworkForm
              id={editingFrameworkData.id}
              data={editingFrameworkData.data}
              isEditing={true}
              onChange={(id, data) => setEditingFrameworkData({ id, data })}
              onSubmit={handleEditFrameworkSubmit}
              onCancel={() => { setEditDialogOpen(false); setEditingFrameworkData(null); }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
