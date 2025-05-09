"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Control, Framework, Requirement, TemplatePolicy, Task } from "@/lib/types"

interface ControlFormProps {
  id: string
  control: Control
  frameworks: Record<string, Framework>
  requirements: Record<string, Record<string, Requirement>>
  policies: Record<string, TemplatePolicy>
  tasks: Record<string, Task>
  onSave: (id: string, control: Control) => boolean
  onCancel: () => void
}

export default function ControlForm({
  id,
  control,
  frameworks,
  requirements,
  policies,
  tasks,
  onSave,
  onCancel,
}: ControlFormProps) {
  const [controlId, setControlId] = useState(id)
  const [controlData, setControlData] = useState<Control>({ ...control })

  // For mapping UI
  const [selectedFramework, setSelectedFramework] = useState<string>("")
  const [selectedRequirement, setSelectedRequirement] = useState<string>("")
  const [selectedPolicy, setSelectedPolicy] = useState<string>("")
  const [selectedTask, setSelectedTask] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")

  const handleSubmit = () => {
    onSave(controlId, controlData)
  }

  // Requirement mapping handlers
  const addRequirementMapping = () => {
    if (!selectedFramework || !selectedRequirement) return

    const newMapping = {
      frameworkId: selectedFramework,
      requirementId: selectedRequirement,
    }

    // Check if mapping already exists
    const exists = controlData.mappedRequirements.some(
      (req) => req.frameworkId === selectedFramework && req.requirementId === selectedRequirement,
    )

    if (!exists) {
      setControlData({
        ...controlData,
        mappedRequirements: [...controlData.mappedRequirements, newMapping],
      })
    }

    setSelectedRequirement("")
  }

  const removeRequirementMapping = (frameworkId: string, requirementId: string) => {
    setControlData({
      ...controlData,
      mappedRequirements: controlData.mappedRequirements.filter(
        (req) => !(req.frameworkId === frameworkId && req.requirementId === requirementId),
      ),
    })
  }

  // Policy mapping handlers
  const addPolicyMapping = () => {
    if (!selectedPolicy) return

    const newArtifact = {
      type: "policy" as const,
      policyId: selectedPolicy,
    }

    // Check if mapping already exists
    const exists = controlData.mappedArtifacts.some(
      (artifact) => artifact.type === "policy" && artifact.policyId === selectedPolicy,
    )

    if (!exists) {
      setControlData({
        ...controlData,
        mappedArtifacts: [...controlData.mappedArtifacts, newArtifact],
      })
    }

    setSelectedPolicy("")
  }

  const removePolicyMapping = (policyId: string) => {
    setControlData({
      ...controlData,
      mappedArtifacts: controlData.mappedArtifacts.filter(
        (artifact) => !(artifact.type === "policy" && artifact.policyId === policyId),
      ),
    })
  }

  // Task mapping handlers
  const addTaskMapping = () => {
    if (!selectedTask) return

    const newTaskMapping = {
      taskId: selectedTask,
    }

    // Check if mapping already exists
    const exists = controlData.mappedTasks.some((task) => task.taskId === selectedTask)

    if (!exists) {
      setControlData({
        ...controlData,
        mappedTasks: [...controlData.mappedTasks, newTaskMapping],
      })
    }

    setSelectedTask("")
  }

  const removeTaskMapping = (taskId: string) => {
    setControlData({
      ...controlData,
      mappedTasks: controlData.mappedTasks.filter((task) => task.taskId !== taskId),
    })
  }

  // Helper functions for getting names
  const getRequirementName = (frameworkId: string, requirementId: string) => {
    return requirements[frameworkId]?.[requirementId]?.name || requirementId
  }

  const getPolicyName = (policyId: string) => {
    return policies[policyId]?.metadata?.name || policyId
  }

  const getTaskName = (taskId: string) => {
    return tasks[taskId]?.name || taskId
  }

  // Filter policies based on search query
  const filteredPolicies = Object.entries(policies).filter(
    ([id, policy]) =>
      searchQuery === "" ||
      policy.metadata.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.metadata.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter tasks based on search query
  const filteredTasks = Object.entries(tasks).filter(
    ([id, task]) =>
      searchQuery === "" ||
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {id ? (
          <div className="grid gap-2">
            <Label htmlFor="control-id">Control ID</Label>
            <Input id="control-id" value={controlId} disabled className="font-mono text-xs" />
          </div>
        ) : null}
        <div className={id ? "" : "md:col-span-2"}>
          <div className="grid gap-2">
            <Label htmlFor="control-name">Name</Label>
            <Input
              id="control-name"
              value={controlData.name}
              onChange={(e) => setControlData({ ...controlData, name: e.target.value })}
              placeholder="e.g., Access Authentication"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="control-description">Description</Label>
        <Textarea
          id="control-description"
          value={controlData.description}
          onChange={(e) => setControlData({ ...controlData, description: e.target.value })}
          placeholder="Describe the control..."
          className="min-h-[100px]"
        />
      </div>

      <Tabs defaultValue="requirements" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requirements" className="flex items-center gap-2">
            Requirements
            {controlData.mappedRequirements.length > 0 && (
              <Badge variant="outline" className="ml-1 bg-blue-50 text-blue-700 hover:bg-blue-50 rounded-full">
                {controlData.mappedRequirements.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="policies" className="flex items-center gap-2">
            Policies
            {controlData.mappedArtifacts.filter((a) => a.type === "policy").length > 0 && (
              <Badge variant="outline" className="ml-1 bg-green-50 text-green-700 hover:bg-green-50 rounded-full">
                {controlData.mappedArtifacts.filter((a) => a.type === "policy").length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            Tasks
            {controlData.mappedTasks.length > 0 && (
              <Badge variant="outline" className="ml-1 bg-amber-50 text-amber-700 hover:bg-amber-50 rounded-full">
                {controlData.mappedTasks.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requirements" className="space-y-4 mt-4">
          <div className="grid gap-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
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

              <div className="flex-1">
                <Select
                  value={selectedRequirement}
                  onValueChange={setSelectedRequirement}
                  disabled={!selectedFramework || !requirements[selectedFramework]}
                >
                  <SelectTrigger>
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
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={addRequirementMapping}
                disabled={!selectedFramework || !selectedRequirement}
                className="shrink-0"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            {controlData.mappedRequirements.length > 0 ? (
              <div className="border rounded-md p-4">
                <div className="text-sm font-medium mb-2">Mapped Requirements:</div>
                <div className="flex flex-wrap gap-2">
                  {controlData.mappedRequirements.map((req, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="flex items-center gap-1 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-50"
                    >
                      <span className="font-medium">
                        {req.frameworkId}:{req.requirementId}
                      </span>
                      <span className="mx-1">-</span>
                      <span className="truncate max-w-[200px]">
                        {getRequirementName(req.frameworkId, req.requirementId)}
                      </span>
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
            ) : (
              <div className="text-center p-4 border border-dashed rounded-md">
                <p className="text-sm text-muted-foreground">No requirements mapped yet.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4 mt-4">
          <div className="grid gap-4">
            <div className="mb-4">
              <Label htmlFor="search-policies">Search Policies</Label>
              <Input
                id="search-policies"
                placeholder="Search by name, description, or ID..."
                className="mt-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <Select value={selectedPolicy} onValueChange={setSelectedPolicy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Policy" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredPolicies.map(([id, policy]) => (
                      <SelectItem key={id} value={id}>
                        {policy.metadata?.name || id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={addPolicyMapping}
                disabled={!selectedPolicy}
                className="shrink-0"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            {controlData.mappedArtifacts.filter((a) => a.type === "policy").length > 0 ? (
              <div className="border rounded-md p-4">
                <div className="text-sm font-medium mb-2">Mapped Policies:</div>
                <div className="flex flex-wrap gap-2">
                  {controlData.mappedArtifacts
                    .filter((artifact) => artifact.type === "policy")
                    .map((artifact, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="flex items-center gap-1 py-1.5 bg-green-50 text-green-700 hover:bg-green-50"
                      >
                        <span className="truncate max-w-[250px]">{getPolicyName(artifact.policyId)}</span>
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
            ) : (
              <div className="text-center p-4 border border-dashed rounded-md">
                <p className="text-sm text-muted-foreground">No policies mapped yet.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4 mt-4">
          <div className="grid gap-4">
            <div className="mb-4">
              <Label htmlFor="search-tasks">Search Tasks</Label>
              <Input
                id="search-tasks"
                placeholder="Search by name, description, or ID..."
                className="mt-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <Select value={selectedTask} onValueChange={setSelectedTask}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Task" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredTasks.map(([id, task]) => (
                      <SelectItem key={id} value={id}>
                        {task.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={addTaskMapping}
                disabled={!selectedTask}
                className="shrink-0"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            {controlData.mappedTasks.length > 0 ? (
              <div className="border rounded-md p-4">
                <div className="text-sm font-medium mb-2">Mapped Tasks:</div>
                <div className="flex flex-wrap gap-2">
                  {controlData.mappedTasks.map((task, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="flex items-center gap-1 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-50"
                    >
                      <span className="truncate max-w-[250px]">{getTaskName(task.taskId)}</span>
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
            ) : (
              <div className="text-center p-4 border border-dashed rounded-md">
                <p className="text-sm text-muted-foreground">No tasks mapped yet.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>{id ? "Save Changes" : "Add Control"}</Button>
      </DialogFooter>
    </div>
  )
}
