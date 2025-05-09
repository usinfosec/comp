"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash } from "lucide-react"
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
import type { Framework, Requirement } from "@/lib/types"

export default function RequirementsManager() {
  const { toast } = useToast()
  const [frameworks, setFrameworks] = useState<Record<string, Framework>>({})
  const [requirements, setRequirements] = useState<Record<string, Record<string, Requirement>>>({})
  const [selectedFramework, setSelectedFramework] = useState<string>("")
  const [editingRequirement, setEditingRequirement] = useState<{ id: string; data: Requirement } | null>(null)
  const [newRequirement, setNewRequirement] = useState<{ id: string; data: Requirement }>({
    id: "",
    data: { name: "", description: "" },
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  // Load data from local storage
  useEffect(() => {
    const storedFrameworks = localStorage.getItem("frameworks")
    const storedRequirements = localStorage.getItem("requirements")

    if (storedFrameworks) {
      const parsedFrameworks = JSON.parse(storedFrameworks)
      setFrameworks(parsedFrameworks)

      // Set the first framework as selected if available
      const frameworkIds = Object.keys(parsedFrameworks)
      if (frameworkIds.length > 0 && !selectedFramework) {
        setSelectedFramework(frameworkIds[0])
      }
    }

    if (storedRequirements) {
      setRequirements(JSON.parse(storedRequirements))
    }
  }, [])

  // Save requirements to local storage whenever they change
  useEffect(() => {
    if (Object.keys(requirements).length > 0) {
      localStorage.setItem("requirements", JSON.stringify(requirements))
    }
  }, [requirements])

  const handleAddRequirement = () => {
    if (!selectedFramework || !newRequirement.id || !newRequirement.data.name) {
      toast({
        title: "Validation Error",
        description: "Framework, requirement ID, and name are required.",
        variant: "destructive",
      })
      return
    }

    // Initialize framework requirements if they don't exist
    const frameworkRequirements = requirements[selectedFramework] || {}

    if (frameworkRequirements[newRequirement.id]) {
      toast({
        title: "Duplicate ID",
        description: "A requirement with this ID already exists for this framework.",
        variant: "destructive",
      })
      return
    }

    const updatedRequirements = {
      ...requirements,
      [selectedFramework]: {
        ...frameworkRequirements,
        [newRequirement.id]: newRequirement.data,
      },
    }

    setRequirements(updatedRequirements)
    setNewRequirement({ id: "", data: { name: "", description: "" } })
    setDialogOpen(false)

    toast({
      title: "Requirement Added",
      description: `${newRequirement.data.name} has been added successfully.`,
    })
  }

  const handleEditRequirement = () => {
    if (!selectedFramework || !editingRequirement || !editingRequirement.id || !editingRequirement.data.name) {
      toast({
        title: "Validation Error",
        description: "Requirement name is required.",
        variant: "destructive",
      })
      return
    }

    const updatedRequirements = {
      ...requirements,
      [selectedFramework]: {
        ...requirements[selectedFramework],
        [editingRequirement.id]: editingRequirement.data,
      },
    }

    setRequirements(updatedRequirements)
    setEditingRequirement(null)
    setEditDialogOpen(false)

    toast({
      title: "Requirement Updated",
      description: `${editingRequirement.data.name} has been updated successfully.`,
    })
  }

  const handleDeleteRequirement = (id: string) => {
    if (!selectedFramework) return

    if (confirm(`Are you sure you want to delete this requirement? This action cannot be undone.`)) {
      const frameworkRequirements = { ...requirements[selectedFramework] }
      delete frameworkRequirements[id]

      const updatedRequirements = {
        ...requirements,
        [selectedFramework]: frameworkRequirements,
      }

      setRequirements(updatedRequirements)

      toast({
        title: "Requirement Deleted",
        description: "The requirement has been deleted successfully.",
      })
    }
  }

  const currentRequirements = selectedFramework ? requirements[selectedFramework] || {} : {}

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Requirements</h2>
        <div className="flex items-center gap-4">
          <div className="w-64">
            <Select value={selectedFramework} onValueChange={setSelectedFramework}>
              <SelectTrigger>
                <SelectValue placeholder="Select Framework" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(frameworks).map(([id, framework]) => (
                  <SelectItem key={id} value={id}>
                    {framework.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2" disabled={!selectedFramework}>
                <Plus className="h-4 w-4" />
                Add Requirement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Requirement</DialogTitle>
                <DialogDescription>
                  Create a new requirement for{" "}
                  {selectedFramework ? frameworks[selectedFramework]?.name : "the selected framework"}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="requirement-id">Requirement ID</Label>
                  <Input
                    id="requirement-id"
                    value={newRequirement.id}
                    onChange={(e) => setNewRequirement({ ...newRequirement, id: e.target.value })}
                    placeholder="e.g., CC1, A1"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="requirement-name">Name</Label>
                  <Input
                    id="requirement-name"
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
                  <Label htmlFor="requirement-description">Description</Label>
                  <Textarea
                    id="requirement-description"
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
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddRequirement}>Add Requirement</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {!selectedFramework && (
        <div className="text-center p-12 border border-dashed rounded-lg">
          <p className="text-muted-foreground">Please select a framework to manage its requirements.</p>
        </div>
      )}

      {selectedFramework && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(currentRequirements).map(([id, requirement]) => (
            <Card key={id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>
                      {id}: {requirement.name}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{requirement.description}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 bg-muted/50 p-2">
                <Dialog
                  open={editDialogOpen && editingRequirement?.id === id}
                  onOpenChange={(open) => {
                    setEditDialogOpen(open)
                    if (!open) setEditingRequirement(null)
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => {
                        setEditingRequirement({ id, data: { ...requirement } })
                        setEditDialogOpen(true)
                      }}
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Requirement</DialogTitle>
                      <DialogDescription>Update the requirement details.</DialogDescription>
                    </DialogHeader>
                    {editingRequirement && (
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-requirement-name">Name</Label>
                          <Input
                            id="edit-requirement-name"
                            value={editingRequirement.data.name}
                            onChange={(e) =>
                              setEditingRequirement({
                                ...editingRequirement,
                                data: { ...editingRequirement.data, name: e.target.value },
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-requirement-description">Description</Label>
                          <Textarea
                            id="edit-requirement-description"
                            value={editingRequirement.data.description}
                            onChange={(e) =>
                              setEditingRequirement({
                                ...editingRequirement,
                                data: { ...editingRequirement.data, description: e.target.value },
                              })
                            }
                          />
                        </div>
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
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleDeleteRequirement(id)}
                >
                  <Trash className="h-3 w-3" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {selectedFramework && Object.keys(currentRequirements).length === 0 && (
        <div className="text-center p-12 border border-dashed rounded-lg">
          <p className="text-muted-foreground">
            No requirements added yet for this framework. Click "Add Requirement" to create one.
          </p>
        </div>
      )}
    </div>
  )
}
