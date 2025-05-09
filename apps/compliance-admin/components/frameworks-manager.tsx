"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import type { Framework } from "@/lib/types"

export default function FrameworksManager() {
  const { toast } = useToast()
  const [frameworks, setFrameworks] = useState<Record<string, Framework>>({})
  const [editingFramework, setEditingFramework] = useState<{ id: string; data: Framework } | null>(null)
  const [newFramework, setNewFramework] = useState<{ id: string; data: Framework }>({
    id: "",
    data: { name: "", version: "", description: "" },
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  // Load frameworks from local storage
  useEffect(() => {
    const storedFrameworks = localStorage.getItem("frameworks")
    if (storedFrameworks) {
      setFrameworks(JSON.parse(storedFrameworks))
    }
  }, [])

  // Save frameworks to local storage whenever they change
  useEffect(() => {
    if (Object.keys(frameworks).length > 0) {
      localStorage.setItem("frameworks", JSON.stringify(frameworks))
    }
  }, [frameworks])

  const handleAddFramework = () => {
    if (!newFramework.id || !newFramework.data.name) {
      toast({
        title: "Validation Error",
        description: "Framework ID and name are required.",
        variant: "destructive",
      })
      return
    }

    if (frameworks[newFramework.id]) {
      toast({
        title: "Duplicate ID",
        description: "A framework with this ID already exists.",
        variant: "destructive",
      })
      return
    }

    const updatedFrameworks = {
      ...frameworks,
      [newFramework.id]: newFramework.data,
    }

    setFrameworks(updatedFrameworks)
    setNewFramework({ id: "", data: { name: "", version: "", description: "" } })
    setDialogOpen(false)

    toast({
      title: "Framework Added",
      description: `${newFramework.data.name} has been added successfully.`,
    })
  }

  const handleEditFramework = () => {
    if (!editingFramework || !editingFramework.id || !editingFramework.data.name) {
      toast({
        title: "Validation Error",
        description: "Framework name is required.",
        variant: "destructive",
      })
      return
    }

    const updatedFrameworks = {
      ...frameworks,
      [editingFramework.id]: editingFramework.data,
    }

    setFrameworks(updatedFrameworks)
    setEditingFramework(null)
    setEditDialogOpen(false)

    toast({
      title: "Framework Updated",
      description: `${editingFramework.data.name} has been updated successfully.`,
    })
  }

  const handleDeleteFramework = (id: string) => {
    if (confirm(`Are you sure you want to delete this framework? This action cannot be undone.`)) {
      const { [id]: _, ...remainingFrameworks } = frameworks
      setFrameworks(remainingFrameworks)

      toast({
        title: "Framework Deleted",
        description: "The framework has been deleted successfully.",
      })
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Frameworks</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="framework-id">Framework ID</Label>
                <Input
                  id="framework-id"
                  value={newFramework.id}
                  onChange={(e) => setNewFramework({ ...newFramework, id: e.target.value })}
                  placeholder="e.g., soc2, iso27001"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="framework-name">Name</Label>
                <Input
                  id="framework-name"
                  value={newFramework.data.name}
                  onChange={(e) =>
                    setNewFramework({
                      ...newFramework,
                      data: { ...newFramework.data, name: e.target.value },
                    })
                  }
                  placeholder="e.g., SOC 2, ISO 27001"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="framework-version">Version</Label>
                <Input
                  id="framework-version"
                  value={newFramework.data.version}
                  onChange={(e) =>
                    setNewFramework({
                      ...newFramework,
                      data: { ...newFramework.data, version: e.target.value },
                    })
                  }
                  placeholder="e.g., 2023, v2.0"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="framework-description">Description</Label>
                <Textarea
                  id="framework-description"
                  value={newFramework.data.description}
                  onChange={(e) =>
                    setNewFramework({
                      ...newFramework,
                      data: { ...newFramework.data, description: e.target.value },
                    })
                  }
                  placeholder="Describe the framework..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddFramework}>Add Framework</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(frameworks).map(([id, framework]) => (
          <Card key={id} className="overflow-hidden">
            <CardHeader>
              <CardTitle>{framework.name}</CardTitle>
              <CardDescription>Version: {framework.version}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{framework.description}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 bg-muted/50 p-2">
              <Dialog
                open={editDialogOpen && editingFramework?.id === id}
                onOpenChange={(open) => {
                  setEditDialogOpen(open)
                  if (!open) setEditingFramework(null)
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => {
                      setEditingFramework({ id, data: { ...framework } })
                      setEditDialogOpen(true)
                    }}
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Framework</DialogTitle>
                    <DialogDescription>Update the framework details.</DialogDescription>
                  </DialogHeader>
                  {editingFramework && (
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-framework-name">Name</Label>
                        <Input
                          id="edit-framework-name"
                          value={editingFramework.data.name}
                          onChange={(e) =>
                            setEditingFramework({
                              ...editingFramework,
                              data: { ...editingFramework.data, name: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-framework-version">Version</Label>
                        <Input
                          id="edit-framework-version"
                          value={editingFramework.data.version}
                          onChange={(e) =>
                            setEditingFramework({
                              ...editingFramework,
                              data: { ...editingFramework.data, version: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-framework-description">Description</Label>
                        <Textarea
                          id="edit-framework-description"
                          value={editingFramework.data.description}
                          onChange={(e) =>
                            setEditingFramework({
                              ...editingFramework,
                              data: { ...editingFramework.data, description: e.target.value },
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
                    <Button onClick={handleEditFramework}>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                variant="destructive"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => handleDeleteFramework(id)}
              >
                <Trash className="h-3 w-3" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {Object.keys(frameworks).length === 0 && (
        <div className="text-center p-12 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No frameworks added yet. Click "Add Framework" to create one.</p>
        </div>
      )}
    </div>
  )
}
