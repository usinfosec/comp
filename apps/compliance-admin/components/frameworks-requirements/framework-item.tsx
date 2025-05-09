"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Edit, Trash, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import type { Framework, Requirement } from "@/lib/types"
import FrameworkForm from "../frameworks/framework-form"
import RequirementsList from "./requirements-list"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface FrameworkItemProps {
  id: string
  framework: Framework
  requirements: Record<string, Requirement>
  isExpanded: boolean
  onToggleExpand: () => void
  onUpdateFramework: (id: string, framework: Framework) => void
  onDeleteFramework: (id: string) => void
  onUpdateRequirements: (requirements: Record<string, Requirement>) => void
}

export default function FrameworkItem({
  id,
  framework,
  requirements,
  isExpanded,
  onToggleExpand,
  onUpdateFramework,
  onDeleteFramework,
  onUpdateRequirements,
}: FrameworkItemProps) {
  const { toast } = useToast()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingFramework, setEditingFramework] = useState<Framework>(framework)
  const requirementsCount = Object.keys(requirements).length

  const handleEditFramework = () => {
    if (!editingFramework.name) {
      toast({
        title: "Validation Error",
        description: "Framework name is required.",
        variant: "destructive",
      })
      return
    }

    onUpdateFramework(id, editingFramework)
    setEditDialogOpen(false)
  }

  const handleDeleteFramework = () => {
    onDeleteFramework(id)
    setDeleteDialogOpen(false)
  }

  return (
    <Card className="overflow-hidden">
      <Collapsible open={isExpanded} onOpenChange={onToggleExpand}>
        <div className="flex items-center justify-between p-4 bg-muted/30 border-b">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-8 w-8"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onToggleExpand()
              }}
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{framework.name}</h3>
                <Badge variant="outline">{framework.version}</Badge>
                <Badge variant="secondary" className="ml-2">
                  {requirementsCount} {requirementsCount === 1 ? "Requirement" : "Requirements"}
                </Badge>
              </div>
              {!isExpanded && framework.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{framework.description}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation()
                setEditingFramework({ ...framework })
                setEditDialogOpen(true)
              }}
            >
              <Edit className="h-3 w-3" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation()
                setDeleteDialogOpen(true)
              }}
            >
              <Trash className="h-3 w-3" />
              Delete
            </Button>
          </div>
        </div>

        <CollapsibleContent>
          <div className="p-4">
            {framework.description && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Description:</h4>
                <p>{framework.description}</p>
                <div className="text-xs text-muted-foreground mt-1">
                  ID: <span className="font-mono">{id}</span>
                </div>
              </div>
            )}

            <RequirementsList
              frameworkId={id}
              requirements={requirements}
              onUpdateRequirements={onUpdateRequirements}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Edit Framework Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Framework</DialogTitle>
            <DialogDescription>Update the framework details.</DialogDescription>
          </DialogHeader>
          <FrameworkForm
            id={id}
            data={editingFramework}
            isEditing={true}
            onChange={(_, data) => setEditingFramework(data)}
            onSubmit={handleEditFramework}
            onCancel={() => setEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Framework Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Framework
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this framework and all its requirements? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/50 p-3 rounded-md border">
            <p className="font-medium">{framework.name}</p>
            <p className="text-sm text-muted-foreground mt-1">
              This will also delete {requirementsCount} {requirementsCount === 1 ? "requirement" : "requirements"}.
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteFramework}>
              Delete Framework
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
