"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import type { Requirement } from "@/lib/types"
import RequirementForm from "../requirements/requirement-form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import EmptyState from "../ui/empty-state"
import { Input } from "@/components/ui/input"
import { generateRandomId } from "@/lib/utils"

interface RequirementsListProps {
  frameworkId: string
  requirements: Record<string, Requirement>
  onUpdateRequirements: (requirements: Record<string, Requirement>) => void
}

export default function RequirementsList({ frameworkId, requirements, onUpdateRequirements }: RequirementsListProps) {
  const { toast } = useToast()
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const [newRequirement, setNewRequirement] = useState<{ id: string; data: Requirement }>({
    id: generateRandomId(),
    data: { name: "", description: "" },
  })

  const [editingRequirement, setEditingRequirement] = useState<{ id: string; data: Requirement } | null>(null)
  const [deletingRequirementId, setDeletingRequirementId] = useState<string | null>(null)

  const handleAddRequirement = () => {
    if (!newRequirement.data.name) {
      toast({
        title: "Validation Error",
        description: "Requirement name is required.",
        variant: "destructive",
      })
      return
    }

    const updatedRequirements = {
      ...requirements,
      [newRequirement.id]: newRequirement.data,
    }

    onUpdateRequirements(updatedRequirements)
    setNewRequirement({ id: generateRandomId(), data: { name: "", description: "" } })
    setAddDialogOpen(false)

    toast({
      title: "Requirement Added",
      description: `${newRequirement.data.name} has been added successfully.`,
    })
  }

  const handleEditRequirement = () => {
    if (!editingRequirement || !editingRequirement.id || !editingRequirement.data.name) {
      toast({
        title: "Validation Error",
        description: "Requirement name is required.",
        variant: "destructive",
      })
      return
    }

    const updatedRequirements = {
      ...requirements,
      [editingRequirement.id]: editingRequirement.data,
    }

    onUpdateRequirements(updatedRequirements)
    setEditingRequirement(null)
    setEditDialogOpen(false)

    toast({
      title: "Requirement Updated",
      description: `${editingRequirement.data.name} has been updated successfully.`,
    })
  }

  const handleDeleteRequirement = () => {
    if (!deletingRequirementId) return

    const { [deletingRequirementId]: _, ...remainingRequirements } = requirements
    onUpdateRequirements(remainingRequirements)
    setDeletingRequirementId(null)
    setDeleteDialogOpen(false)

    toast({
      title: "Requirement Deleted",
      description: "The requirement has been deleted successfully.",
    })
  }

  // Filter requirements based on search query
  const filteredRequirements = Object.entries(requirements).filter(
    ([id, req]) =>
      id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-md font-semibold">Requirements</h4>
        <div className="flex gap-2">
          <Input
            placeholder="Search requirements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <Button size="sm" onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Requirement
          </Button>
        </div>
      </div>

      {Object.keys(requirements).length === 0 ? (
        <EmptyState
          title="No requirements yet"
          description="Add requirements to this framework to define compliance criteria."
          action={
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Requirement
            </Button>
          }
        />
      ) : filteredRequirements.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No requirements match your search criteria.</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequirements.map(([id, requirement]) => (
                <TableRow key={id}>
                  <TableCell className="font-medium">{id}</TableCell>
                  <TableCell>{requirement.name}</TableCell>
                  <TableCell className="max-w-md truncate">{requirement.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => {
                          setEditingRequirement({ id, data: { ...requirement } })
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
                        onClick={() => {
                          setDeletingRequirementId(id)
                          setDeleteDialogOpen(true)
                        }}
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
        </div>
      )}

      {/* Add Requirement Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Requirement</DialogTitle>
            <DialogDescription>Create a new requirement for this framework.</DialogDescription>
          </DialogHeader>
          <RequirementForm
            id={newRequirement.id}
            data={newRequirement.data}
            isEditing={false}
            onChange={(id, data) => setNewRequirement({ id, data })}
            onSubmit={handleAddRequirement}
            onCancel={() => setAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Requirement Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Requirement</DialogTitle>
            <DialogDescription>Update the requirement details.</DialogDescription>
          </DialogHeader>
          {editingRequirement && (
            <RequirementForm
              id={editingRequirement.id}
              data={editingRequirement.data}
              isEditing={true}
              onChange={(id, data) => setEditingRequirement({ id, data })}
              onSubmit={handleEditRequirement}
              onCancel={() => setEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Requirement Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Requirement
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this requirement? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deletingRequirementId && (
            <div className="bg-muted/50 p-3 rounded-md border">
              <p className="font-medium">
                {deletingRequirementId}: {requirements[deletingRequirementId]?.name}
              </p>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRequirement}>
              Delete Requirement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
