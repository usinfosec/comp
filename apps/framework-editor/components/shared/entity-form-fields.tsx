"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Frequency, Departments } from "@/lib/types"

interface EntityFormFieldsProps {
  id?: string
  name: string
  description: string
  frequency: Frequency
  department: Departments
  onNameChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onFrequencyChange: (value: Frequency) => void
  onDepartmentChange: (value: Departments) => void
  disabled?: boolean
}

export default function EntityFormFields({
  id,
  name,
  description,
  frequency,
  department,
  onNameChange,
  onDescriptionChange,
  onFrequencyChange,
  onDepartmentChange,
  disabled = false,
}: EntityFormFieldsProps) {
  return (
    <div className="space-y-4">
      {id && (
        <div className="grid gap-2">
          <Label htmlFor="entity-id">ID</Label>
          <Input id="entity-id" value={id} disabled className="font-mono text-xs" />
        </div>
      )}
      <div className="grid gap-2">
        <Label htmlFor="entity-name">Name</Label>
        <Input
          id="entity-name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          disabled={disabled}
          placeholder="Enter name..."
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="entity-description">Description</Label>
        <Textarea
          id="entity-description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          disabled={disabled}
          placeholder="Enter description..."
          className="min-h-[100px]"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="entity-frequency">Frequency</Label>
          <Select
            value={frequency}
            onValueChange={(value) => onFrequencyChange(value as Frequency)}
            disabled={disabled}
          >
            <SelectTrigger id="entity-frequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Frequency.monthly}>Monthly</SelectItem>
              <SelectItem value={Frequency.quarterly}>Quarterly</SelectItem>
              <SelectItem value={Frequency.yearly}>Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="entity-department">Department</Label>
          <Select
            value={department}
            onValueChange={(value) => onDepartmentChange(value as Departments)}
            disabled={disabled}
          >
            <SelectTrigger id="entity-department">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Departments.none}>None</SelectItem>
              <SelectItem value={Departments.admin}>Admin</SelectItem>
              <SelectItem value={Departments.gov}>Governance</SelectItem>
              <SelectItem value={Departments.hr}>HR</SelectItem>
              <SelectItem value={Departments.it}>IT</SelectItem>
              <SelectItem value={Departments.itsm}>ITSM</SelectItem>
              <SelectItem value={Departments.qms}>QMS</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
