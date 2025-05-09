"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getRequirements, setToStorage, getControls, getFrameworks } from "@/lib/storage"
import type { Requirement, FrameworkId, Control, Framework } from "@/lib/types"
import { generateRandomId } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import EntityTabs from "@/components/shared/entity-tabs"
import ControlMappingEditor from "@/components/shared/control-mapping-editor"

interface RequirementsManagerProps {
  frameworkId: FrameworkId
}

export default function RequirementsManager({ frameworkId }: RequirementsManagerProps) {
  const { toast } = useToast()
  const [requirements, setRequirements] = useState<Record<string, Record<string, Requirement>>>({})
  const [controls, setControls] = useState<Record<string, Control>>({})
  const [frameworks, setFrameworks] = useState<Record<string, Framework>>({})
  const [editingRequirement, setEditingRequirement] = useState<{ id: string; data: Requirement } | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const createEmptyRequirement = (): Requirement => {
    return {
      name: "",
      description: "",
    }
  }

  const [newRequirement, setNewRequirement] = useState<{ id: string; data: Requirement }>({
    id: generateRandomId(),
    data: createEmptyRequirement(),
  })

  // Load data from local storage
  useEffect(() => {
    const storedRequirements = getRequirements()
    const storedControls = getControls()
    const storedFrameworks = getFrameworks()
    setRequirements(storedRequirements)
    setControls(storedControls)
    setFrameworks(storedFrameworks)
  }, [])

  // Save requirements to local storage whenever they change
  useEffect(() => {
    if (Object.keys(requirements).length > 0) {
      setToStorage("requirements", requirements)
    }
  }, [requirements])

  const frameworkRequirements = requirements[frameworkId] || {}

  const handleAddRequirement = () => {
    if (!newRequirement.data.name) {
      toast({
        title: "Validation Error",
        description: "Requirement name is required.",
        variant: "destructive",
      })
      return
    }

    // Initialize framework requirements if they don't exist
    const updatedRequirements = {
      ...requirements,
      [frameworkId]: {
        ...requirements[frameworkId],
        [newRequirement.id]: newRequirement.data,
      },
    }

    setRequirements(updatedRequirements)
    setNewRequirement({
      id: generateRandomId(),
      data: createEmptyRequirement(),
    })
    setDialogOpen(false)

    toast({
      title: "Requirement Added",
      description: `${newRequirement.data.name} has been added successfully.`,
    })
  }

  const handleEditRequirement = () => {
    if (!editingRequirement || !editingRequirement.id || !editingRequirement.data.name) {
      toast({
        title: "Validation Error",
        description: "Requirement name is required.",
        variant: "destructive",
      })
      return
    }

    const updatedRequirements = {
      ...requirements,
      [frameworkId]: {
        ...requirements[frameworkId],
        [editingRequirement.id]: editingRequirement.data,
      },
    }

    setRequirements(updatedRequirements)

    // Save controls mappings
    setToStorage("controls", controls)

    setEditingRequirement(null)
    setEditDialogOpen(false)

    toast({
      title: "Requirement Updated",
      description: `${editingRequirement.data.name} has been updated successfully.`,
    })
  }

  const handleDeleteRequirement = (id: string) => {
    if (confirm(`Are you sure you want to delete this requirement? This action cannot be undone.`)) {
      const updatedFrameworkRequirements = { ...requirements[frameworkId] }
      delete updatedFrameworkRequirements[id]

      const updatedRequirements = {
        ...requirements,
        [frameworkId]: updatedFrameworkRequirements,
      }

      // Remove any control mappings to this requirement
      const updatedControls = { ...controls }
      Object.keys(updatedControls).forEach((controlId) => {
        updatedControls[controlId] = {
          ...updatedControls[controlId],
          mappedRequirements: (updatedControls[controlId].mappedRequirements || []).filter(
            (req) => !(req.frameworkId === frameworkId && req.requirementId === id),
          ),
        }
      })

      setRequirements(updatedRequirements)
      setControls(updatedControls)
      setToStorage("controls", updatedControls)

      toast({
        title: "Requirement Deleted",
        description: "The requirement has been deleted successfully.",
      })
    }
  }

  // Count controls mapped to each requirement
  const getControlsCount = (requirementId: string) => {
    return Object.values(controls).filter((control) =>
      control.mappedRequirements.some((req) => req.frameworkId === frameworkId && req.requirementId === requirementId),
    ).length
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Requirements</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Requirement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Requirement</DialogTitle>
              <DialogDescription>
                Add a new requirement to {frameworks[frameworkId]?.name || "this framework"}.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <EntityTabs
                entityType="requirement"
                mappedControlsCount={0}
                detailsContent={
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="requirement-name" className="text-sm font-medium">
                        Name
                      </label>
                      <input
                        id="requirement-name"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={newRequirement.data.name}
                        onChange={(e) =>
                          setNewRequirement({
                            ...newRequirement,
                            data: { ...newRequirement.data, name: e.target.value },
                          })
                        }
                        placeholder="e.g., Control Environment"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="requirement-description" className="text-sm font-medium">
                        Description
                      </label>
                      <textarea
                        id="requirement-description"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={newRequirement.data.description}
                        onChange={(e) =>
                          setNewRequirement({
                            ...newRequirement,
                            data: { ...newRequirement.data, description: e.target.value },
                          })
                        }
                        placeholder="Describe the requirement..."
                      />
                    </div>
                  </div>
                }
                mappingsContent={
                  <div className="py-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Save the requirement first before mapping controls.
                    </p>
                    <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto">
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <p className="text-muted-foreground">
                          You'll be able to map controls after creating this requirement.
                        </p>
                      </div>
                    </div>
                  </div>
                }
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddRequirement}>Add Requirement</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {Object.keys(frameworkRequirements).length === 0 ? (
        <EmptyState
          title="No requirements"
          description="Add your first requirement to this framework."
          action={
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Requirement
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(frameworkRequirements).map(([id, requirement]) => (
            <div key={id} className="border rounded-md p-4 hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium truncate">{requirement.name}</h3>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 rounded-full">
                  {getControlsCount(id)} {getControlsCount(id) === 1 ? "control" : "controls"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{requirement.description}</p>
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => {
                    setEditingRequirement({ id, data: { ...frameworkRequirements[id] } })
                    setEditDialogOpen(true)
                  }}
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleDeleteRequirement(id)}
                >
                  <Trash className="h-3 w-3" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Requirement</DialogTitle>
            <DialogDescription>
              Update the requirement for {frameworks[frameworkId]?.name || "this framework"}.
            </DialogDescription>
          </DialogHeader>
          {editingRequirement && (
            <div className="py-4">
              <EntityTabs
                entityType="requirement"
                mappedControlsCount={getControlsCount(editingRequirement.id)}
                detailsContent={
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="edit-requirement-id" className="text-sm font-medium">
                        Requirement ID
                      </label>
                      <input
                        id="edit-requirement-id"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono text-xs"
                        value={editingRequirement.id}
                        disabled
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="edit-requirement-name" className="text-sm font-medium">
                        Name
                      </label>
                      <input
                        id="edit-requirement-name"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={editingRequirement.data.name}
                        onChange={(e) =>
                          setEditingRequirement({
                            ...editingRequirement,
                            data: { ...editingRequirement.data, name: e.target.value },
                          })
                        }
                        placeholder="e.g., Control Environment"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="edit-requirement-description" className="text-sm font-medium">
                        Description
                      </label>
                      <textarea
                        id="edit-requirement-description"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={editingRequirement.data.description}
                        onChange={(e) =>
                          setEditingRequirement({
                            ...editingRequirement,
                            data: { ...editingRequirement.data, description: e.target.value },
                          })
                        }
                        placeholder="Describe the requirement..."
                      />
                    </div>
                  </div>
                }
                mappingsContent={
                  <ControlMappingEditor
                    controls={controls}
                    entityId={editingRequirement.id}
                    entityType="requirement"
                    frameworkId={frameworkId}
                    mappedControlsCount={getControlsCount(editingRequirement.id)}
                    onControlsChange={setControls}
                  />
                }
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditRequirement}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
