"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Task, Frequency, Departments } from "@/lib/types"

interface TaskFormProps {
  id: string
  data: Task
  isEditing: boolean
  onChange: (id: string, data: Task) => void
  onSubmit: () => void
  onCancel: () => void
}

export default function TaskForm({ id, data, isEditing, onChange, onSubmit, onCancel }: TaskFormProps) {
  return (
    <div className="grid gap-4 py-4">
      {!isEditing && (
        <div className="grid gap-2">
          <Label htmlFor="task-id">Task ID</Label>
          <Input
            id="task-id"
            value={id}
            onChange={(e) => onChange(e.target.value, { ...data, id: e.target.value })}
            placeholder="e.g., access_logs"
          />
        </div>
      )}
      <div className="grid gap-2">
        <Label htmlFor="task-name">Name</Label>
        <Input
          id="task-name"
          value={data.name}
          onChange={(e) => onChange(id, { ...data, name: e.target.value })}
          placeholder="e.g., Access Logs"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="task-description">Description</Label>
        <Textarea
          id="task-description"
          value={data.description}
          onChange={(e) => onChange(id, { ...data, description: e.target.value })}
          placeholder="Describe the task..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="task-frequency">Frequency</Label>
          <Select
            value={data.frequency}
            onValueChange={(value) => onChange(id, { ...data, frequency: value as Frequency })}
          >
            <SelectTrigger id="task-frequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="task-department">Department</Label>
          <Select
            value={data.department}
            onValueChange={(value) => onChange(id, { ...data, department: value as Departments })}
          >
            <SelectTrigger id="task-department">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="gov">Governance</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
              <SelectItem value="it">IT</SelectItem>
              <SelectItem value="itsm">ITSM</SelectItem>
              <SelectItem value="qms">QMS</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>{isEditing ? "Save Changes" : "Add Task"}</Button>
      </DialogFooter>
    </div>
  )
}
