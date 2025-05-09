"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import type { Framework as CompDataFramework } from "@comp/data"

interface FrameworkFormProps {
  id: string
  data: CompDataFramework
  isEditing: boolean
  onChange: (id: string, data: CompDataFramework) => void
  onSubmit: () => void
  onCancel: () => void
}

export default function FrameworkForm({ id, data, isEditing, onChange, onSubmit, onCancel }: FrameworkFormProps) {
  return (
    <div className="grid gap-4 py-4">
      {!isEditing ? null : (
        <div className="grid gap-2">
          <Label htmlFor="framework-id">Framework ID</Label>
          <Input id="framework-id" value={id} disabled className="font-mono text-xs" />
        </div>
      )}
      <div className="grid gap-2">
        <Label htmlFor="framework-name">Name</Label>
        <Input
          id="framework-name"
          value={data.name}
          onChange={(e) => onChange(id, { ...data, name: e.target.value })}
          placeholder="e.g., SOC 2, ISO 27001"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="framework-version">Version</Label>
        <Input
          id="framework-version"
          value={data.version}
          onChange={(e) => onChange(id, { ...data, version: e.target.value })}
          placeholder="e.g., 2023, v2.0"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="framework-description">Description</Label>
        <Textarea
          id="framework-description"
          value={data.description}
          onChange={(e) => onChange(id, { ...data, description: e.target.value })}
          placeholder="Describe the framework..."
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>{isEditing ? "Save Changes" : "Add Framework"}</Button>
      </DialogFooter>
    </div>
  )
}
