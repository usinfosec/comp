"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
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
import { getTasks, setToStorage, getControls } from "@/lib/storage"
import { Frequency, Departments, type Task, type Control } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { generateRandomId } from "@/lib/utils"

// Import shared components
import EntityFormFields from "@/components/shared/entity-form-fields"
import EntityTabs from "@/components/shared/entity-tabs"
import ControlMappingEditor from "@/components/shared/control-mapping-editor"

export default function TasksManager() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Record<string, Task>>({})
  const [controls, setControls] = useState<Record<string, Control>>({})
  const [editingTask, setEditingTask] = useState<{ id: string; data: Task } | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const createEmptyTask = (): Task => {
    const id = generateRandomId()
    return {
      id,
      name: "",
      description: "",
      frequency: Frequency.monthly,
      department: Departments.it,
      mappedControls: [],
    }
  }

  const [newTask, setNewTask] = useState<{ id: string; data: Task }>({
    id: generateRandomId(),
    data: createEmptyTask(),
  })

  // Load tasks from local storage
  useEffect(() => {
    const storedTasks = getTasks()
    const storedControls = getControls()
    setTasks(storedTasks)
    setControls(storedControls)
  }, [])

  // Save tasks to local storage whenever they change
  useEffect(() => {
    if (Object.keys(tasks).length > 0) {
      setToStorage("tasks", tasks)
    }
  }, [tasks])

  const handleAddTask = () => {
    if (!newTask.data.name) {
      toast({
        title: "Validation Error",
        description: "Task name is required.",
        variant: "destructive",
      })
      return
    }

    // Ensure the ID in the data object matches the task ID
    const taskData = {
      ...newTask.data,
      id: newTask.id,
    }

    const updatedTasks = {
      ...tasks,
      [newTask.id]: taskData,
    }

    setTasks(updatedTasks)
    setNewTask({
      id: generateRandomId(),
      data: createEmptyTask(),
    })
    setDialogOpen(false)

    toast({
      title: "Task Added",
      description: `${newTask.data.name} has been added successfully.`,
    })
  }

  const handleEditTask = () => {
    if (!editingTask || !editingTask.id || !editingTask.data.name) {
      toast({
        title: "Validation Error",
        description: "Task name is required.",
        variant: "destructive",
      })
      return
    }

    // Ensure the ID in the data object matches the task ID
    const taskData = {
      ...editingTask.data,
      id: editingTask.id,
    }

    const updatedTasks = {
      ...tasks,
      [editingTask.id]: taskData,
    }

    setTasks(updatedTasks)

    // Save controls mappings
    setToStorage("controls", controls)

    setEditingTask(null)
    setEditDialogOpen(false)

    toast({
      title: "Task Updated",
      description: `${editingTask.data.name} has been updated successfully.`,
    })
  }

  const handleDeleteTask = (id: string) => {
    if (confirm(`Are you sure you want to delete this task? This action cannot be undone.`)) {
      const { [id]: _, ...remainingTasks } = tasks
      setTasks(remainingTasks)

      toast({
        title: "Task Deleted",
        description: "The task has been deleted successfully.",
      })
    }
  }

  // Count controls mapped to each task
  const getControlsCount = (taskId: string) => {
    return Object.values(controls).filter((control) => control.mappedTasks.some((task) => task.taskId === taskId))
      .length
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>Create a new compliance task.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <EntityFormFields
                name={newTask.data.name}
                description={newTask.data.description}
                frequency={newTask.data.frequency}
                department={newTask.data.department}
                onNameChange={(value) => setNewTask({ ...newTask, data: { ...newTask.data, name: value } })}
                onDescriptionChange={(value) =>
                  setNewTask({ ...newTask, data: { ...newTask.data, description: value } })
                }
                onFrequencyChange={(value) => setNewTask({ ...newTask, data: { ...newTask.data, frequency: value } })}
                onDepartmentChange={(value) => setNewTask({ ...newTask, data: { ...newTask.data, department: value } })}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTask}>Add Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {Object.keys(tasks).length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Mapped Controls</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(tasks).map(([id, task]) => {
                const controlsCount = getControlsCount(id)
                return (
                  <TableRow key={id}>
                    <TableCell className="font-mono text-xs">{id}</TableCell>
                    <TableCell>{task.name}</TableCell>
                    <TableCell className="max-w-md truncate">{task.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{task.frequency}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{task.department}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50 rounded-full">
                        {controlsCount} {controlsCount === 1 ? "control" : "controls"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => {
                            setEditingTask({ id, data: { ...tasks[id] } })
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
                          onClick={() => handleDeleteTask(id)}
                        >
                          <Trash className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center p-12 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No tasks added yet. Click "Add Task" to create one.</p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update the task details and control mappings.</DialogDescription>
          </DialogHeader>
          {editingTask && (
            <div className="py-4">
              <EntityTabs
                entityType="task"
                mappedItemsCount={
                  Object.values(controls).filter((control) =>
                    control.mappedTasks.some((task) => task.taskId === editingTask.id),
                  ).length
                }
                detailsContent={
                  <EntityFormFields
                    id={editingTask.id}
                    name={editingTask.data.name}
                    description={editingTask.data.description}
                    frequency={editingTask.data.frequency}
                    department={editingTask.data.department}
                    onNameChange={(value) =>
                      setEditingTask({ ...editingTask, data: { ...editingTask.data, name: value } })
                    }
                    onDescriptionChange={(value) =>
                      setEditingTask({ ...editingTask, data: { ...editingTask.data, description: value } })
                    }
                    onFrequencyChange={(value) =>
                      setEditingTask({ ...editingTask, data: { ...editingTask.data, frequency: value } })
                    }
                    onDepartmentChange={(value) =>
                      setEditingTask({ ...editingTask, data: { ...editingTask.data, department: value } })
                    }
                  />
                }
                mappingsContent={
                  <ControlMappingEditor
                    controls={controls}
                    entityId={editingTask.id}
                    entityType="task"
                    mappedControlsCount={
                      Object.values(controls).filter((control) =>
                        control.mappedTasks.some((task) => task.taskId === editingTask.id),
                      ).length
                    }
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
            <Button onClick={handleEditTask}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
