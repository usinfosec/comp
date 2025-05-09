"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search, Filter } from "lucide-react"
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
import ControlsList from "./controls-list"
import ControlForm from "./control-form"
import EmptyState from "../ui/empty-state"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { generateRandomId } from "@/lib/utils"
import { useAppData } from "@/app/contexts/AppDataContext"
import type {
  TemplateControl as CompDataTemplateControl,
  Framework as CompDataFramework,
  Requirement as CompDataRequirement,
  TemplatePolicies as CompDataTemplatePolicies,
  TemplateTaskMap as CompDataTemplateTaskMap
} from "@comp/data"
import type {
  TemplatePolicy as LocalTemplatePolicy,
  TemplateTask as LocalTemplateTask,
  TemplateControl as LocalTemplateControl
} from "../../lib/types";

export default function ControlsManager() {
  const { toast } = useToast()
  const { appData, isLoading, reinitializeData } = useAppData()

  // UI state
  const [searchQuery, setSearchQuery] = useState("")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([])
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([])
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])

  // New control state
  const initialNewControlData: Omit<CompDataTemplateControl, 'id'> = {
    name: "",
    description: "",
    mappedArtifacts: [],
    mappedRequirements: [],
    mappedTasks: [],
  }
  const [newControlData, setNewControlData] = useState(initialNewControlData)

  // Helper to convert array of controls to Record<string, TemplateControl> if needed by old logic/form
  // Or better, update all logic to work with TemplateControl[]
  const controlsAsRecord = useMemo(() => {
    if (!appData.controls) return {}
    return appData.controls.reduce((acc, control) => {
      acc[control.id] = control
      return acc
    }, {} as Record<string, CompDataTemplateControl>)
  }, [appData.controls])

  const handleAddControl = (controlDataFromForm: Omit<CompDataTemplateControl, 'id'>) => {
    if (!appData.controls) return false
    
    if (!controlDataFromForm.name) {
      toast({ title: "Validation Error", description: "Control name is required.", variant: "destructive" })
      return false
    }

    const newId = generateRandomId()
    // Check for duplicate ID (unlikely with UUID, but good practice if IDs could be manual)
    if (appData.controls.find(c => c.id === newId)) {
        toast({ title: "Error", description: "Generated ID already exists. Please try again.", variant: "destructive" })
        return false
    }

    const finalControlData: CompDataTemplateControl = {
      ...controlDataFromForm,
      id: newId,
    }

    const updatedControls = [...appData.controls, finalControlData]
    setToStorage("controls", updatedControls)
    reinitializeData()

    setAddDialogOpen(false)
    setNewControlData(initialNewControlData)
    toast({ title: "Control Added", description: `${finalControlData.name} has been added successfully.` })
    return true
  }

  const handleUpdateControl = (controlId: string, controlDataFromForm: Omit<CompDataTemplateControl, 'id'>) => {
    if (!appData.controls) return false

    if (!controlDataFromForm.name) {
      toast({ title: "Validation Error", description: "Control name is required.", variant: "destructive" })
      return false
    }

    const finalControlData: CompDataTemplateControl = {
      ...controlDataFromForm,
      id: controlId,
    }

    const updatedControls = appData.controls.map(c => c.id === controlId ? finalControlData : c)
    setToStorage("controls", updatedControls)
    reinitializeData()

    toast({ title: "Control Updated", description: `${finalControlData.name} has been updated successfully.` })
    return true
  }

  const handleDeleteControl = (controlId: string) => {
    if (!appData.controls) return
    const updatedControls = appData.controls.filter(c => c.id !== controlId)
    setToStorage("controls", updatedControls)
    reinitializeData()
    toast({ title: "Control Deleted", description: "The control has been deleted successfully." })
  }

  const filteredControls = useMemo(() => {
    if (!appData.controls) return []
    return appData.controls.filter((control) => {
      const matchesSearch =
        searchQuery === "" ||
        control.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        control.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        control.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesFramework =
        selectedFrameworks.length === 0 ||
        control.mappedRequirements.some((req) => selectedFrameworks.includes(req.frameworkId))

      const matchesPolicy =
        selectedPolicies.length === 0 ||
        control.mappedArtifacts
          .filter((artifact) => artifact.type === "policy")
          .some((artifact) => selectedPolicies.includes(artifact.policyId))

      const matchesTask =
        selectedTasks.length === 0 || control.mappedTasks.some((task) => selectedTasks.includes(task.taskId))

      return matchesSearch && matchesFramework && matchesPolicy && matchesTask
    })
  }, [appData.controls, searchQuery, selectedFrameworks, selectedPolicies, selectedTasks])

  const getRequirementName = (frameworkId: string, requirementId: string): string => {
    return appData.requirements?.[frameworkId]?.[requirementId]?.name || requirementId
  }
  
  const getPolicyName = (policyId: string): string => {
    const policy = appData.policies?.[policyId as keyof CompDataTemplatePolicies]
    return (policy as any)?.metadata?.name || policyId
  }
  
  const getTaskName = (taskId: string): string => {
    return appData.tasks?.[taskId]?.name || taskId
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedFrameworks([])
    setSelectedPolicies([])
    setSelectedTasks([])
  }

  const activeFilterCount =
    (searchQuery ? 1 : 0) + selectedFrameworks.length + selectedPolicies.length + selectedTasks.length

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading Controls Data...</div>
  }

  if (!appData.controls || !appData.frameworks || !appData.requirements || !appData.policies || !appData.tasks) {
    return <EmptyState title="Data not available" description="Control data or related dependencies could not be loaded." />
  }

  // Wrappers for event handlers to bridge local types and @comp/data types
  const onSaveControlForm = (
    _idIgnored: string, // ControlForm might pass an ID, even for new items
    localControlData: LocalTemplateControl
  ): boolean => {
    // Convert LocalTemplateControl to Omit<CompDataTemplateControl, 'id'>
    const { id, ...dataToSave } = localControlData as unknown as CompDataTemplateControl;
    return handleAddControl(dataToSave);
  };

  const onUpdateControlList = (
    id: string,
    localControlData: LocalTemplateControl
  ): boolean => {
    // Convert LocalTemplateControl to Omit<CompDataTemplateControl, 'id'>
    const { id: localId, ...dataToUpdate } = localControlData as unknown as CompDataTemplateControl;
    return handleUpdateControl(id, dataToUpdate);
  };

  // Prepare data for child components expecting local types
  const localPoliciesForForm = appData.policies as unknown as Record<string, LocalTemplatePolicy>; 
  const localTasksForForm = appData.tasks as unknown as Record<string, LocalTemplateTask>;
  
  const localFilteredControlsForList = useMemo(() => 
    filteredControls.reduce((acc, control) => {
      acc[control.id] = control as unknown as LocalTemplateControl;
      return acc;
    }, {} as Record<string, LocalTemplateControl>)
  , [filteredControls]);

  // Prepare control object for ControlForm when adding a new control
  const newControlIdForForm = ""; // Or generateRandomId() if a unique key is needed by the form itself
  const newControlObjectForForm: LocalTemplateControl = {
    id: newControlIdForForm, // This ID is for the ControlForm's state management
    name: newControlData.name,
    description: newControlData.description,
    // Ensure these arrays are correctly typed for LocalTemplateControl
    mappedArtifacts: newControlData.mappedArtifacts as unknown as LocalTemplateControl['mappedArtifacts'],
    mappedRequirements: newControlData.mappedRequirements as unknown as LocalTemplateControl['mappedRequirements'],
    mappedTasks: newControlData.mappedTasks as unknown as LocalTemplateControl['mappedTasks'],
    // Add other fields from newControlData if LocalTemplateControl requires them
    // and ensure they are cast appropriately.
    // For example, if LocalTemplateControl has specific enum types different from CompDataTemplateControl
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search controls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 w-full sm:w-[300px]"
          />
        </div>
        <div className="flex gap-2 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
                {activeFilterCount > 0 && <Badge variant="secondary">{activeFilterCount}</Badge>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[300px]">
              <div className="px-2 py-1.5 text-sm font-semibold">Frameworks</div>
              {Object.entries(appData.frameworks).map(([id, fw]) => (
                <DropdownMenuCheckboxItem
                  key={id}
                  checked={selectedFrameworks.includes(id)}
                  onCheckedChange={(checked) => {
                    setSelectedFrameworks(prev => checked ? [...prev, id] : prev.filter(item => item !== id))
                  }}
                >
                  {fw.name}
                </DropdownMenuCheckboxItem>
              ))}
              <div className="px-2 py-1.5 text-sm font-semibold">Policies</div>
              {Object.entries(appData.policies as Record<string, {metadata?: {name: string}}>) .map(([id, policy]) => (
                <DropdownMenuCheckboxItem
                  key={id}
                  checked={selectedPolicies.includes(id)}
                  onCheckedChange={(checked) => {
                    setSelectedPolicies(prev => checked ? [...prev, id] : prev.filter(item => item !== id))
                  }}
                >
                  {policy.metadata?.name || id}
                </DropdownMenuCheckboxItem>
              ))}
              <div className="px-2 py-1.5 text-sm font-semibold">Tasks</div>
              {Object.entries(appData.tasks).map(([id, task]) => (
                <DropdownMenuCheckboxItem
                  key={id}
                  checked={selectedTasks.includes(id)}
                  onCheckedChange={(checked) => {
                    setSelectedTasks(prev => checked ? [...prev, id] : prev.filter(item => item !== id))
                  }}
                >
                  {task.name}
                </DropdownMenuCheckboxItem>
              ))}
              {activeFilterCount > 0 && (
                 <Button variant="ghost" onClick={clearFilters} className="w-full justify-start mt-2">
                   Clear All Filters
                 </Button>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Control
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Add New Control</DialogTitle>
                <DialogDescription>
                  Create a new control and map it to requirements, policies, and tasks.
                </DialogDescription>
              </DialogHeader>
              <ControlForm
                id={newControlIdForForm}
                control={newControlObjectForForm} 
                frameworks={appData.frameworks}
                requirements={appData.requirements}
                policies={localPoliciesForForm}
                tasks={localTasksForForm}
                onSave={onSaveControlForm} 
                onCancel={() => setAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredControls.length === 0 && activeFilterCount === 0 && Object.keys(controlsAsRecord).length > 0 ? (
         <EmptyState
            title="No controls match your filters"
            description="Try adjusting your search or filter criteria."
            action={<Button onClick={clearFilters}>Clear Filters</Button>}
          />
      ) : filteredControls.length === 0 && searchQuery === "" && activeFilterCount === 0 ? (
        <EmptyState
          title="No controls available"
          description="Add a control to get started."
          action={<Button onClick={() => setAddDialogOpen(true)}><Plus className="h-4 w-4 mr-2"/>Add Control</Button>}
        />
      ) : (
        <ControlsList
          controls={localFilteredControlsForList}
          frameworks={appData.frameworks}
          requirements={appData.requirements}
          policies={localPoliciesForForm}
          tasks={localTasksForForm}
          onUpdateControl={onUpdateControlList}
          onDeleteControl={handleDeleteControl}
          getRequirementName={getRequirementName}
          getPolicyName={getPolicyName}
          getTaskName={getTaskName}
        />
      )}
    </div>
  )
}
