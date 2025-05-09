"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { setToStorage } from "@/lib/storage"
// import type { Framework, Requirement } from "@/lib/types" // Aim to remove these local types
import FrameworkForm from "../frameworks/framework-form" // This component will need to align with CompDataFramework
import FrameworkItem from "./framework-item" // This component will need to align with CompDataFramework
import EmptyState from "../ui/empty-state"
import { useAppData } from "@/app/contexts/AppDataContext"
import type { Framework as CompDataFramework, Requirement as CompDataRequirement } from "@comp/data";

// Define the shape of data used by the form, based on CompDataFramework
// Assuming CompDataFramework is { name: string, version: string, description: string }
// If CompDataFramework has an 'id' or other fields, adjust this type.
type FrameworkFormData = Omit<CompDataFramework, 'id'>; // Or pick relevant fields: Pick<CompDataFramework, 'name' | 'version' | 'description'>

export default function FrameworksRequirementsManager() {
  const { toast } = useToast()
  const { appData, isLoading, reinitializeData } = useAppData()

  const [expandedFrameworks, setExpandedFrameworks] = useState<Record<string, boolean>>({}) 
  // Use CompDataFramework structure for new framework data state
  const [newFrameworkFormData, setNewFrameworkFormData] = useState<FrameworkFormData>({
    name: "", version: "", description: ""
  })
  const [frameworkDialogOpen, setFrameworkDialogOpen] = useState(false)

  useEffect(() => {
    if (appData.frameworks) {
      setExpandedFrameworks(currentExpanded => {
        const newExpandedState = { ...currentExpanded };
        let changed = false;
        Object.keys(appData.frameworks!).forEach((id) => {
          if (!(id in newExpandedState)) {
            newExpandedState[id] = false;
            changed = true;
          }
        });
        return changed ? newExpandedState : currentExpanded;
      });
    }
  }, [appData.frameworks]);

  const toggleFrameworkExpanded = (frameworkId: string) => {
    setExpandedFrameworks((prev) => ({
      ...prev,
      [frameworkId]: !prev[frameworkId],
    }))
  }

  const handleAddFramework = () => {
    if (!appData.frameworks || !appData.requirements) return;
    if (!newFrameworkFormData.name) { 
      toast({ title: "Validation Error", description: "Framework name is required.", variant: "destructive" })
      return
    }
    
    const newId = crypto.randomUUID();
    if (appData.frameworks[newId]) {
      toast({ title: "Error", description: "Generated ID already exists. Please try again.", variant: "destructive" })
      return
    }

    const frameworkToAdd: CompDataFramework = {
      name: newFrameworkFormData.name,
      version: newFrameworkFormData.version,
      description: newFrameworkFormData.description,
      // Add any other fields from CompDataFramework that are not in FrameworkFormData
    };

    const updatedFrameworks = {
      ...appData.frameworks,
      [newId]: frameworkToAdd,
    }
    setToStorage("frameworks", updatedFrameworks)

    const updatedRequirements = {
      ...appData.requirements,
      [newId]: {}, 
    }
    setToStorage("requirements", updatedRequirements)
    
    reinitializeData()
    setNewFrameworkFormData({ name: "", version: "", description: "" })
    setFrameworkDialogOpen(false)
    toast({ title: "Framework Added", description: `${newFrameworkFormData.name} has been added successfully.` })
  }

  // data parameter here should ideally be CompDataFramework if FrameworkForm is updated
  const handleUpdateFramework = (id: string, data: CompDataFramework) => { 
    if (!appData.frameworks) return;
    const frameworkToUpdate: CompDataFramework = {
        name: data.name,
        version: data.version,
        description: data.description,
        // Ensure all fields of CompDataFramework are covered
    };
    const updatedFrameworks = {
      ...appData.frameworks,
      [id]: frameworkToUpdate, 
    }
    setToStorage("frameworks", updatedFrameworks)
    reinitializeData()
    toast({ title: "Framework Updated", description: `${data.name} has been updated successfully.` })
  }

  const handleDeleteFramework = (id: string) => {
    if (!appData.frameworks || !appData.requirements) return;
    
    const frameworksCopy = { ...appData.frameworks };
    if (id in frameworksCopy) delete frameworksCopy[id];
    setToStorage("frameworks", frameworksCopy)

    const requirementsCopy = { ...appData.requirements };
    if (id in requirementsCopy) delete requirementsCopy[id];
    setToStorage("requirements", requirementsCopy)

    reinitializeData()
    toast({ title: "Framework Deleted", description: "The framework and its requirements have been deleted successfully." })
  }

  // updatedReqsForFramework should be Record<string, CompDataRequirement>
  const handleUpdateRequirements = (frameworkId: string, updatedReqsForFramework: Record<string, CompDataRequirement>) => {
    if (!appData.requirements) return;
    const updatedRequirements = {
      ...appData.requirements,
      [frameworkId]: updatedReqsForFramework, 
    }
    setToStorage("requirements", updatedRequirements)
    reinitializeData()
  }
  
  if (isLoading) {
    return <div>Loading framework data...</div>;
  }

  if (!appData.frameworks || !appData.requirements) {
    return <EmptyState title="Data not available" description="Framework or requirements data could not be loaded." />
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Frameworks</h2>
         <Dialog open={frameworkDialogOpen} onOpenChange={setFrameworkDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
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
              id="" 
              data={newFrameworkFormData} // Pass data aligned with CompDataFramework
              isEditing={false}
              // onChange from FrameworkForm needs to return data compatible with FrameworkFormData
              onChange={(_id, formData) => setNewFrameworkFormData(formData as FrameworkFormData)}
              onSubmit={handleAddFramework}
              onCancel={() => setFrameworkDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {Object.keys(appData.frameworks).length === 0 ? (
        <EmptyState
          title="No frameworks available"
          description="Add a framework to get started with your compliance management."
          action={
            <Button onClick={() => setFrameworkDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Framework
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {Object.entries(appData.frameworks).map(([frameworkId, frameworkValue]) => (
            <FrameworkItem
              key={frameworkId}
              id={frameworkId}
              framework={frameworkValue} // Pass CompDataFramework directly
              requirements={(appData.requirements && appData.requirements[frameworkId]) || {}}
              isExpanded={expandedFrameworks[frameworkId] || false}
              onToggleExpand={() => toggleFrameworkExpanded(frameworkId)}
              // FrameworkItem's onUpdateFramework should expect CompDataFramework
              onUpdateFramework={handleUpdateFramework} 
              onDeleteFramework={handleDeleteFramework}
              // FrameworkItem's onUpdateRequirements should expect Record<string, CompDataRequirement>
              onUpdateRequirements={(updatedReqs) => handleUpdateRequirements(frameworkId, updatedReqs)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
