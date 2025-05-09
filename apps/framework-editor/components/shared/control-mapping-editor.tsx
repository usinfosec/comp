"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlusCircle, Search, ShieldAlert, ShieldCheck } from "lucide-react"
import type { Control, FrameworkId } from "@/lib/types"

interface ControlMappingEditorProps {
  controls: Record<string, Control>
  entityId: string
  entityType: "policy" | "task" | "requirement"
  frameworkId?: FrameworkId // Only needed for requirements
  mappedControlsCount: number
  onControlsChange: (updatedControls: Record<string, Control>) => void
  onAddNewControl?: () => void // Optional callback to open control creation dialog
}

export default function ControlMappingEditor({
  controls = {}, // Provide default empty object to prevent null/undefined errors
  entityId,
  entityType,
  frameworkId,
  mappedControlsCount,
  onControlsChange,
  onAddNewControl,
}: ControlMappingEditorProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Ensure controls is always an object
  const controlsObj = controls || {}

  // Check if a control is mapped to the current entity
  const isControlMapped = (control: Control) => {
    if (!control) return false

    if (entityType === "policy") {
      return (
        control.mappedArtifacts?.some((artifact) => artifact.type === "policy" && artifact.policyId === entityId) ||
        false
      )
    } else if (entityType === "task") {
      return control.mappedTasks?.some((task) => task.taskId === entityId) || false
    } else if (entityType === "requirement" && frameworkId) {
      return (
        control.mappedRequirements?.some((req) => req.frameworkId === frameworkId && req.requirementId === entityId) ||
        false
      )
    }
    return false
  }

  // Handle checkbox change
  const handleControlMapping = (controlId: string, control: Control, checked: boolean) => {
    if (!control) return

    const updatedControls = { ...controlsObj }

    if (checked) {
      // Add entity to control if not already mapped
      if (!isControlMapped(control)) {
        if (entityType === "policy") {
          updatedControls[controlId] = {
            ...updatedControls[controlId],
            mappedArtifacts: [
              ...(updatedControls[controlId].mappedArtifacts || []),
              { type: "policy", policyId: entityId },
            ],
          }
        } else if (entityType === "task") {
          updatedControls[controlId] = {
            ...updatedControls[controlId],
            mappedTasks: [...(updatedControls[controlId].mappedTasks || []), { taskId: entityId }],
          }
        } else if (entityType === "requirement" && frameworkId) {
          updatedControls[controlId] = {
            ...updatedControls[controlId],
            mappedRequirements: [
              ...(updatedControls[controlId].mappedRequirements || []),
              { frameworkId, requirementId: entityId },
            ],
          }
        }
      }
    } else {
      // Remove entity from control
      if (entityType === "policy") {
        updatedControls[controlId] = {
          ...updatedControls[controlId],
          mappedArtifacts: (updatedControls[controlId].mappedArtifacts || []).filter(
            (artifact) => !(artifact.type === "policy" && artifact.policyId === entityId),
          ),
        }
      } else if (entityType === "task") {
        updatedControls[controlId] = {
          ...updatedControls[controlId],
          mappedTasks: (updatedControls[controlId].mappedTasks || []).filter((task) => task.taskId !== entityId),
        }
      } else if (entityType === "requirement" && frameworkId) {
        updatedControls[controlId] = {
          ...updatedControls[controlId],
          mappedRequirements: (updatedControls[controlId].mappedRequirements || []).filter(
            (req) => !(req.frameworkId === frameworkId && req.requirementId === entityId),
          ),
        }
      }
    }

    onControlsChange(updatedControls)
  }

  // Get badge color based on entity type
  const getBadgeColor = () => {
    if (entityType === "policy") return "bg-green-50 text-green-700 hover:bg-green-50"
    if (entityType === "task") return "bg-amber-50 text-amber-700 hover:bg-amber-50"
    return "bg-blue-50 text-blue-700 hover:bg-blue-50" // For requirements
  }

  const filteredControls = Object.entries(controlsObj).filter(
    ([id, control]) =>
      searchQuery === "" ||
      control.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      control.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const hasControls = Object.keys(controlsObj).length > 0
  const hasFilteredControls = filteredControls.length > 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="search-controls">Search Controls</Label>
        {mappedControlsCount > 0 && (
          <Badge variant="outline" className={`${getBadgeColor()} rounded-full`}>
            {mappedControlsCount} {mappedControlsCount === 1 ? "control" : "controls"}
          </Badge>
        )}
      </div>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          id="search-controls"
          placeholder="Search by name, description, or ID..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto">
        {!hasControls ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <ShieldAlert className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="font-medium text-base">No controls available</h3>
            <p className="text-muted-foreground text-sm mt-1 mb-4 max-w-[80%]">
              Controls help you demonstrate compliance with requirements.
            </p>
            {onAddNewControl && (
              <Button onClick={onAddNewControl} variant="outline" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create your first control
              </Button>
            )}
          </div>
        ) : !hasFilteredControls ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Search className="h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="font-medium text-base">No matching controls</h3>
            <p className="text-muted-foreground text-sm mt-1 max-w-[80%]">
              Try adjusting your search or clear it to see all available controls.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredControls.map(([id, control]) => {
              const isMapped = isControlMapped(control)

              return (
                <div
                  key={id}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={`edit-${entityType}-control-${id}`}
                    checked={isMapped}
                    onCheckedChange={(checked) => handleControlMapping(id, control, !!checked)}
                  />
                  <Label htmlFor={`edit-${entityType}-control-${id}`} className="flex-1 cursor-pointer text-sm">
                    <div className="flex items-center">
                      <span className="font-medium">{control.name}</span>
                      <span className="text-muted-foreground ml-2 text-xs">({id})</span>
                    </div>
                    {control.description && (
                      <p className="text-muted-foreground text-xs mt-0.5 line-clamp-1">{control.description}</p>
                    )}
                  </Label>
                  {isMapped && <ShieldCheck className="h-4 w-4 text-green-600 flex-shrink-0" />}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
