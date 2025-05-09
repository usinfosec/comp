"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash, PlusIcon, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import type { Control, Framework, Requirement, Task } from "@/lib/types"

export default function ControlsManager() {
  const { toast } = useToast()
  const [controls, setControls] = useState<Record<string, Control>>({})
  const [frameworks, setFrameworks] = useState<Record<string, Framework>>({})
  const [requirements, setRequirements] = useState<Record<string, Record<string, Requirement>>>({})
  const [policies, setPolicies] = useState<Record<string, any>>({})
  const [tasks, setTasks] = useState<Record<string, Task>>({})

  const [editingControl, setEditingControl] = useState<{ id: string; data: Control } | null>(null)
  const [newControl, setNewControl] = useState<{ id: string; data: Control }>({
    id: "",
    data: {
      id: "",
      name: "",
      description: "",
      mappedArtifacts: [],
      mappedRequirements: [],
      mappedTasks: [],
    },
  })

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  // For mapping UI
  const [selectedFramework, setSelectedFramework] = useState<string>("")
  const [selectedRequirement, setSelectedRequirement] = useState<string>("")
  const [selectedPolicy, setSelectedPolicy] = useState<string>("")
  const [selectedTask, setSelectedTask] = useState<string>("")

  // Load data from local storage
  useEffect(() => {
    const storedControls = localStorage.getItem("controls")
    const storedFrameworks = localStorage.getItem("frameworks")
    const storedRequirements = localStorage.getItem("requirements")
    const storedPolicies = localStorage.getItem("policies")
    const storedTasks = localStorage.getItem("tasks")

    if (storedControls) {
      setControls(JSON.parse(storedControls))
    }

    if (storedFrameworks) {
      setFrameworks(JSON.parse(storedFrameworks))
    }

    if (storedRequirements) {
      setRequirements(JSON.parse(storedRequirements))
    }

    if (storedPolicies) {
      setPolicies(JSON.parse(storedPolicies))
    }

    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  // Save controls to local storage whenever they change
  useEffect(() => {
    if (Object.keys(controls).length > 0) {
      localStorage.setItem("controls", JSON.stringify(controls))
    }
  }, [controls])

  const handleAddControl = () => {
    if (!newControl.id || !newControl.data.name) {
      toast({
        title: "Validation Error",
        description: "Control ID and name are required.",
        variant: "destructive",
      })
      return
    }

    if (controls[newControl.id]) {
      toast({
        title: "Duplicate ID",
        description: "A control with this ID already exists.",
        variant: "destructive",
      })
      return
    }

    // Ensure the control ID is also set in the data object
    const controlData = {
      ...newControl.data,
      id: newControl.id,
    }

    const updatedControls = {
      ...controls,
      [newControl.id]: controlData,
    }

    setControls(updatedControls)
    setNewControl({
      id: "",
      data: {
        id: "",
        name: "",
        description: "",
        mappedArtifacts: [],
        mappedRequirements: [],
        mappedTasks: [],
      },
    })
    setDialogOpen(false)

    toast({
      title: "Control Added",
      description: `${newControl.data.name} has been added successfully.`,
    })
  }

  const handleEditControl = () => {
    if (!editingControl || !editingControl.id || !editingControl.data.name) {
      toast({
        title: "Validation Error",
        description: "Control name is required.",
        variant: "destructive",
      })
      return
    }

    // Ensure the control ID is also set in the data object
    const controlData = {
      ...editingControl.data,
      id: editingControl.id,
    }

    const updatedControls = {
      ...controls,
      [editingControl.id]: controlData,
    }

    setControls(updatedControls)
    setEditingControl(null)
    setEditDialogOpen(false)

    toast({
      title: "Control Updated",
      description: `${editingControl.data.name} has been updated successfully.`,
    })
  }

  const handleDeleteControl = (id: string) => {
    if (confirm(`Are you sure you want to delete this control? This action cannot be undone.`)) {
      const { [id]: _, ...remainingControls } = controls
      setControls(remainingControls)

      toast({
        title: "Control Deleted",
        description: "The control has been deleted successfully.",
      })
    }
  }

  const addRequirementMapping = () => {
    if (!selectedFramework || !selectedRequirement) return

    const newMapping = {
      frameworkId: selectedFramework,
      requirementId: selectedRequirement,
    }

    if (editingControl) {
      // Check if mapping already exists
      const exists = editingControl.data.mappedRequirements.some(
        (req) => req.frameworkId === selectedFramework && req.requirementId === selectedRequirement,
      )

      if (!exists) {
        setEditingControl({
          ...editingControl,
          data: {
            ...editingControl.data,
            mappedRequirements: [...editingControl.data.mappedRequirements, newMapping],
          },
        })
      }
    } else {
      // Check if mapping already exists
      const exists = newControl.data.mappedRequirements.some(
        (req) => req.frameworkId === selectedFramework && req.requirementId === selectedRequirement,
      )

      if (!exists) {
        setNewControl({
          ...newControl,
          data: {
            ...newControl.data,
            mappedRequirements: [...newControl.data.mappedRequirements, newMapping],
          },
        })
      }
    }

    setSelectedFramework("")
    setSelectedRequirement("")
  }

  const addPolicyMapping = () => {
    if (!selectedPolicy) return

    const newArtifact = {
      type: "policy",
      policyId: selectedPolicy,
    }

    if (editingControl) {
      // Check if mapping already exists
      const exists = editingControl.data.mappedArtifacts.some(
        (artifact) => artifact.type === "policy" && artifact.policyId === selectedPolicy,
      )

      if (!exists) {
        setEditingControl({
          ...editingControl,
          data: {
            ...editingControl.data,
            mappedArtifacts: [...editingControl.data.mappedArtifacts, newArtifact],
          },
        })
      }
    } else {
      // Check if mapping already exists
      const exists = newControl.data.mappedArtifacts.some(
        (artifact) => artifact.type === "policy" && artifact.policyId === selectedPolicy,
      )

      if (!exists) {
        setNewControl({
          ...newControl,
          data: {
            ...newControl.data,
            mappedArtifacts: [...newControl.data.mappedArtifacts, newArtifact],
          },
        })
      }
    }

    setSelectedPolicy("")
  }

  const addTaskMapping = () => {
    if (!selectedTask) return

    const newTaskMapping = {
      taskId: selectedTask,
    }

    if (editingControl) {
      // Check if mapping already exists
      const exists = editingControl.data.mappedTasks.some((task) => task.taskId === selectedTask)

      if (!exists) {
        setEditingControl({
          ...editingControl,
          data: {
            ...editingControl.data,
            mappedTasks: [...editingControl.data.mappedTasks, newTaskMapping],
          },
        })
      }
    } else {
      // Check if mapping already exists
      const exists = newControl.data.mappedTasks.some((task) => task.taskId === selectedTask)

      if (!exists) {
        setNewControl({
          ...newControl,
          data: {
            ...newControl.data,
            mappedTasks: [...newControl.data.mappedTasks, newTaskMapping],
          },
        })
      }
    }

    setSelectedTask("")
  }

  const removeRequirementMapping = (frameworkId: string, requirementId: string) => {
    if (editingControl) {
      setEditingControl({
        ...editingControl,
        data: {
          ...editingControl.data,
          mappedRequirements: editingControl.data.mappedRequirements.filter(
            (req) => !(req.frameworkId === frameworkId && req.requirementId === requirementId),
          ),
        },
      })
    } else {
      setNewControl({
        ...newControl,
        data: {
          ...newControl.data,
          mappedRequirements: newControl.data.mappedRequirements.filter(
            (req) => !(req.frameworkId === frameworkId && req.requirementId === requirementId),
          ),
        },
      })
    }
  }

  const removePolicyMapping = (policyId: string) => {
    if (editingControl) {
      setEditingControl({
        ...editingControl,
        data: {
          ...editingControl.data,
          mappedArtifacts: editingControl.data.mappedArtifacts.filter(
            (artifact) => !(artifact.type === "policy" && artifact.policyId === policyId),
          ),
        },
      })
    } else {
      setNewControl({
        ...newControl,
        data: {
          ...newControl.data,
          mappedArtifacts: newControl.data.mappedArtifacts.filter(
            (artifact) => !(artifact.type === "policy" && artifact.policyId === policyId),
          ),
        },
      })
    }
  }

  const removeTaskMapping = (taskId: string) => {
    if (editingControl) {
      setEditingControl({
        ...editingControl,
        data: {
          ...editingControl.data,
          mappedTasks: editingControl.data.mappedTasks.filter((task) => task.taskId !== taskId),
        },
      })
    } else {
      setNewControl({
        ...newControl,
        data: {
          ...newControl.data,
          mappedTasks: newControl.data.mappedTasks.filter((task) => task.taskId !== taskId),
        },
      })
    }
  }

  const getRequirementName = (frameworkId: string, requirementId: string) => {
    return requirements[frameworkId]?.[requirementId]?.name || requirementId
  }

  const getPolicyName = (policyId: string) => {
    return policies[policyId]?.metadata?.name || policyId
  }

  const getTaskName = (taskId: string) => {
    return tasks[taskId]?.name || taskId
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Controls</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Control
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add New Control</DialogTitle>
              <DialogDescription>
                Create a new control and map it to requirements, policies, and tasks.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="control-id">Control ID</Label>
                  <Input
                    id="control-id"
                    value={newControl.id}
                    onChange={(e) =>
                      setNewControl({
                        ...newControl,
                        id: e.target.value,
                        data: { ...newControl.data, id: e.target.value },
                      })
                    }
                    placeholder="e.g., access_authentication"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="control-name">Name</Label>
                  <Input
                    id="control-name"
                    value={newControl.data.name}
                    onChange={(e) =>
                      setNewControl({
                        ...newControl,
                        data: { ...newControl.data, name: e.target.value },
                      })
                    }
                    placeholder="e.g., Access Authentication"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="control-description">Description</Label>
                <Textarea
                  id="control-description"
                  value={newControl.data.description}
                  onChange={(e) =>
                    setNewControl({
                      ...newControl,
                      data: { ...newControl.data, description: e.target.value },
                    })
                  }
                  placeholder="Describe the control..."
                />
              </div>

              <div className="grid gap-2">
                <Label>Map to Requirements</Label>
                <div className="flex gap-2">
                  <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                    <SelectTrigger className="w-[180px]">
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

                  <Select
                    value={selectedRequirement}
                    onValueChange={setSelectedRequirement}
                    disabled={!selectedFramework || !requirements[selectedFramework]}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Requirement" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedFramework &&
                        requirements[selectedFramework] &&
                        Object.entries(requirements[selectedFramework]).map(([id, req]) => (
                          <SelectItem key={id} value={id}>
                            {id}: {req.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={addRequirementMapping}
                    disabled={!selectedFramework || !selectedRequirement}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {newControl.data.mappedRequirements.map((req, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {req.frameworkId}:{req.requirementId} - {getRequirementName(req.frameworkId, req.requirementId)}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1"
                        onClick={() => removeRequirementMapping(req.frameworkId, req.requirementId)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Map to Policies</Label>
                <div className="flex gap-2">
                  <Select value={selectedPolicy} onValueChange={setSelectedPolicy}>
                    <SelectTrigger className="w-[300px]">
                      <SelectValue placeholder="Select Policy" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(policies).map(([id, policy]) => (
                        <SelectItem key={id} value={id}>
                          {policy.metadata?.name || id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={addPolicyMapping}
                    disabled={!selectedPolicy}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {newControl.data.mappedArtifacts
                    .filter((artifact) => artifact.type === "policy")
                    .map((artifact, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {getPolicyName(artifact.policyId)}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1"
                          onClick={() => removePolicyMapping(artifact.policyId)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Map to Tasks</Label>
                <div className="flex gap-2">
                  <Select value={selectedTask} onValueChange={setSelectedTask}>
                    <SelectTrigger className="w-[300px]">
                      <SelectValue placeholder="Select Task" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(tasks).map(([id, task]) => (
                        <SelectItem key={id} value={id}>
                          {task.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button type="button" variant="outline" size="icon" onClick={addTaskMapping} disabled={!selectedTask}>
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {newControl.data.mappedTasks.map((task, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {getTaskName(task.taskId)}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1"
                        onClick={() => removeTaskMapping(task.taskId)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddControl}>Add Control</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(controls).map(([id, control]) => (
          <Card key={id} className="overflow-hidden">
            <CardHeader>
              <CardTitle>{control.name}</CardTitle>
              <CardDescription className="line-clamp-2">{control.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {control.mappedRequirements.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Requirements:</h4>
                  <div className="flex flex-wrap gap-2">
                    {control.mappedRequirements.map((req, index) => (
                      <Badge key={index} variant="outline">
                        {req.frameworkId}:{req.requirementId}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {control.mappedArtifacts.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Policies:</h4>
                  <div className="flex flex-wrap gap-2">
                    {control.mappedArtifacts
                      .filter((artifact) => artifact.type === "policy")
                      .map((artifact, index) => (
                        <Badge key={index} variant="outline">
                          {getPolicyName(artifact.policyId)}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}

              {control.mappedTasks.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Tasks:</h4>
                  <div className="flex flex-wrap gap-2">
                    {control.mappedTasks.map((task, index) => (
                      <Badge key={index} variant="outline">
                        {getTaskName(task.taskId)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2 bg-muted/50 p-2">
              <Dialog
                open={editDialogOpen && editingControl?.id === id}
                onOpenChange={(open) => {
                  setEditDialogOpen(open)
                  if (!open) setEditingControl(null)
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => {
                      setEditingControl({ id, data: { ...control } })
                      setEditDialogOpen(true)
                    }}
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Edit Control</DialogTitle>
                    <DialogDescription>Update the control details and mappings.</DialogDescription>
                  </DialogHeader>
                  {editingControl && (
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-control-id">Control ID</Label>
                          <Input id="edit-control-id" value={editingControl.id} disabled />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-control-name">Name</Label>
                          <Input
                            id="edit-control-name"
                            value={editingControl.data.name}
                            onChange={(e) =>
                              setEditingControl({
                                ...editingControl,
                                data: { ...editingControl.data, name: e.target.value },
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-control-description">Description</Label>
                        <Textarea
                          id="edit-control-description"
                          value={editingControl.data.description}
                          onChange={(e) =>
                            setEditingControl({
                              ...editingControl,
                              data: { ...editingControl.data, description: e.target.value },
                            })
                          }
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>Map to Requirements</Label>
                        <div className="flex gap-2">
                          <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                            <SelectTrigger className="w-[180px]">
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

                          <Select
                            value={selectedRequirement}
                            onValueChange={setSelectedRequirement}
                            disabled={!selectedFramework || !requirements[selectedFramework]}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select Requirement" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedFramework &&
                                requirements[selectedFramework] &&
                                Object.entries(requirements[selectedFramework]).map(([id, req]) => (
                                  <SelectItem key={id} value={id}>
                                    {id}: {req.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>

                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={addRequirementMapping}
                            disabled={!selectedFramework || !selectedRequirement}
                          >
                            <PlusIcon className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {editingControl.data.mappedRequirements.map((req, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {req.frameworkId}:{req.requirementId} -{" "}
                              {getRequirementName(req.frameworkId, req.requirementId)}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 ml-1"
                                onClick={() => removeRequirementMapping(req.frameworkId, req.requirementId)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label>Map to Policies</Label>
                        <div className="flex gap-2">
                          <Select value={selectedPolicy} onValueChange={setSelectedPolicy}>
                            <SelectTrigger className="w-[300px]">
                              <SelectValue placeholder="Select Policy" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(policies).map(([id, policy]) => (
                                <SelectItem key={id} value={id}>
                                  {policy.metadata?.name || id}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={addPolicyMapping}
                            disabled={!selectedPolicy}
                          >
                            <PlusIcon className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {editingControl.data.mappedArtifacts
                            .filter((artifact) => artifact.type === "policy")
                            .map((artifact, index) => (
                              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                {getPolicyName(artifact.policyId)}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 ml-1"
                                  onClick={() => removePolicyMapping(artifact.policyId)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label>Map to Tasks</Label>
                        <div className="flex gap-2">
                          <Select value={selectedTask} onValueChange={setSelectedTask}>
                            <SelectTrigger className="w-[300px]">
                              <SelectValue placeholder="Select Task" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(tasks).map(([id, task]) => (
                                <SelectItem key={id} value={id}>
                                  {task.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={addTaskMapping}
                            disabled={!selectedTask}
                          >
                            <PlusIcon className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {editingControl.data.mappedTasks.map((task, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {getTaskName(task.taskId)}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 ml-1"
                                onClick={() => removeTaskMapping(task.taskId)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleEditControl}>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                variant="destructive"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => handleDeleteControl(id)}
              >
                <Trash className="h-3 w-3" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {Object.keys(controls).length === 0 && (
        <div className="text-center p-12 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No controls added yet. Click "Add Control" to create one.</p>
        </div>
      )}
    </div>
  )
}
