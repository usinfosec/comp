"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Control, Framework, Requirement, TemplatePolicy, Task } from "@/lib/types"
import ControlDetail from "./control-detail"
import ControlForm from "./control-form"

interface ControlsListProps {
  controls: Record<string, Control>
  frameworks: Record<string, Framework>
  requirements: Record<string, Record<string, Requirement>>
  policies: Record<string, TemplatePolicy>
  tasks: Record<string, Task>
  getRequirementName: (frameworkId: string, requirementId: string) => string
  getPolicyName: (policyId: string) => string
  getTaskName: (taskId: string) => string
  onUpdateControl: (id: string, control: Control) => boolean
  onDeleteControl: (id: string) => void
}

export default function ControlsList({
  controls,
  frameworks,
  requirements,
  policies,
  tasks,
  getRequirementName,
  getPolicyName,
  getTaskName,
  onUpdateControl,
  onDeleteControl,
}: ControlsListProps) {
  const [viewingControlId, setViewingControlId] = useState<string | null>(null)
  const [editingControlId, setEditingControlId] = useState<string | null>(null)
  const [deletingControlId, setDeletingControlId] = useState<string | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleViewControl = (controlId: string) => {
    setViewingControlId(controlId)
    setViewDialogOpen(true)
  }

  const handleEditControl = (controlId: string) => {
    setEditingControlId(controlId)
    setEditDialogOpen(true)
  }

  const handleDeleteControl = (controlId: string) => {
    setDeletingControlId(controlId)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteControl = () => {
    if (deletingControlId) {
      onDeleteControl(deletingControlId)
      setDeletingControlId(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleSaveEdit = (id: string, control: Control) => {
    const success = onUpdateControl(id, control)
    if (success) {
      setEditingControlId(null)
      setEditDialogOpen(false)
    }
    return success
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">ID</TableHead>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[250px]">Mappings</TableHead>
            <TableHead className="text-right w-[180px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(controls).map(([id, control]) => (
            <TableRow key={id}>
              <TableCell className="font-mono text-sm">{id}</TableCell>
              <TableCell className="font-medium">{control.name}</TableCell>
              <TableCell className="max-w-md truncate">{control.description}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1.5">
                  {control.mappedRequirements.length > 0 && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 rounded-full">
                      {control.mappedRequirements.length}{" "}
                      {control.mappedRequirements.length === 1 ? "Requirement" : "Requirements"}
                    </Badge>
                  )}
                  {control.mappedArtifacts.filter((a) => a.type === "policy").length > 0 && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 rounded-full">
                      {control.mappedArtifacts.filter((a) => a.type === "policy").length}{" "}
                      {control.mappedArtifacts.filter((a) => a.type === "policy").length === 1 ? "Policy" : "Policies"}
                    </Badge>
                  )}
                  {control.mappedTasks.length > 0 && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50 rounded-full">
                      {control.mappedTasks.length} {control.mappedTasks.length === 1 ? "Task" : "Tasks"}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleViewControl(id)}
                  >
                    <Eye className="h-3 w-3" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleEditControl(id)}
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleDeleteControl(id)}
                  >
                    <Trash className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* View Control Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {viewingControlId && (
            <ControlDetail
              control={controls[viewingControlId]}
              frameworks={frameworks}
              requirements={requirements}
              policies={policies}
              tasks={tasks}
              getRequirementName={getRequirementName}
              getPolicyName={getPolicyName}
              getTaskName={getTaskName}
              onEdit={() => {
                setViewDialogOpen(false)
                handleEditControl(viewingControlId)
              }}
              onClose={() => setViewDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Control Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Control</DialogTitle>
            <DialogDescription>Update the control details and mappings.</DialogDescription>
          </DialogHeader>
          {editingControlId && (
            <ControlForm
              id={editingControlId}
              control={controls[editingControlId]}
              frameworks={frameworks}
              requirements={requirements}
              policies={policies}
              tasks={tasks}
              onSave={handleSaveEdit}
              onCancel={() => setEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Control Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Control
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this control? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deletingControlId && (
            <div className="bg-muted/50 p-3 rounded-md border">
              <p className="font-medium">{controls[deletingControlId].name}</p>
              <p className="text-sm text-muted-foreground mt-1">ID: {deletingControlId}</p>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteControl}>
              Delete Control
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
