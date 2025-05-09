"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { Requirement, Control, FrameworkId } from "@/lib/types"
import ControlMappingEditor from "@/components/shared/control-mapping-editor"

interface RequirementFormProps {
  id: string
  frameworkId: FrameworkId
  data: Requirement
  isEditing: boolean
  controls: Record<string, Control>
  mappedControlsCount: number
  onChange: (id: string, data: Requirement) => void
  onControlsChange: (updatedControls: Record<string, Control>) => void
  onSubmit: () => void
  onCancel: () => void
}

export default function RequirementForm({
  id,
  frameworkId,
  data,
  isEditing,
  controls,
  mappedControlsCount,
  onChange,
  onControlsChange,
  onSubmit,
  onCancel,
}: RequirementFormProps) {
  const [activeTab, setActiveTab] = useState("details")

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="controls" className="flex items-center justify-center gap-2">
            Control Mappings
            {mappedControlsCount > 0 && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 rounded-full">
                {mappedControlsCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <div className="grid gap-4 py-4">
            {isEditing && (
              <div className="grid gap-2">
                <Label htmlFor="requirement-id">ID</Label>
                <Input id="requirement-id" value={id} disabled className="font-mono text-xs" />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="requirement-name">Name</Label>
              <Input
                id="requirement-name"
                value={data.name}
                onChange={(e) => onChange(id, { ...data, name: e.target.value })}
                placeholder="e.g., Control Environment"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="requirement-description">Description</Label>
              <Textarea
                id="requirement-description"
                value={data.description}
                onChange={(e) => onChange(id, { ...data, description: e.target.value })}
                placeholder="Describe the requirement..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="controls">
          <div className="py-4">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Map controls to this requirement to demonstrate compliance.
              </p>
            </div>
            {isEditing ? (
              <ControlMappingEditor
                controls={controls}
                entityId={id}
                entityType="requirement"
                frameworkId={frameworkId}
                mappedControlsCount={mappedControlsCount}
                onControlsChange={onControlsChange}
              />
            ) : (
              <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto">
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <p className="text-muted-foreground">
                    You'll be able to map controls after creating this requirement.
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>{isEditing ? "Save Changes" : "Add Requirement"}</Button>
      </div>
    </div>
  )
}
