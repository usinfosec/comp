'use client';

import React from 'react';
import { toast } from 'sonner';
import { FrameworkEditorTaskTemplate } from '@prisma/client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@comp/ui/dialog";
import { Button } from "@comp/ui/button";

import { deleteTaskTemplateAction } from '../actions/delete-task-template-action';

interface DeleteTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  task: FrameworkEditorTaskTemplate;
  onTaskDeleted: (taskId: string) => void;
}

export function DeleteTaskDialog({ isOpen, onOpenChange, task, onTaskDeleted }: DeleteTaskDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleDelete() {
    try {
      setIsDeleting(true);
      const formData = new FormData();
      formData.append('id', task.id);
      const result = await deleteTaskTemplateAction(undefined, formData);

      if (result.success) {
        toast.success(result.message || 'Task Template deleted successfully!');
        onOpenChange(false);
        onTaskDeleted(task.id);
      } else {
        toast.error(result.error || 'Failed to delete task template');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Task Template</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the task template "{task.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 