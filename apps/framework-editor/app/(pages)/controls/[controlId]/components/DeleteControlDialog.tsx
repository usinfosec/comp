'use client'

import { useState } from 'react';
import { Button } from '@comp/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose, // For an explicit close button if needed
} from '@comp/ui/dialog';
import { deleteControl } from '../../actions'; // Corrected path
import { toast } from 'sonner';

interface DeleteControlDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  controlId: string;
  controlName: string;
  onControlDeleted: () => void;
}

export function DeleteControlDialog({
  isOpen,
  onOpenChange,
  controlId,
  controlName,
  onControlDeleted,
}: DeleteControlDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteControl(controlId);
      toast.success(`Control "${controlName}" deleted successfully.`);
      onControlDeleted(); // This will typically close dialog and navigate/refresh
      onOpenChange(false); // Explicitly close dialog
    } catch (error) {
      console.error("Failed to delete control:", error);
      toast.error('Failed to delete control. Please try again.');
      setIsDeleting(false); // Only reset if error, otherwise dialog closes
    }
    // setIsDeleting(false); // Moved to finally or only on error
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-sm">
        <DialogHeader>
          <DialogTitle>Delete Control</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the control "<strong>{controlName}</strong>"?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting} className="rounded-sm">
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="rounded-sm">
            {isDeleting ? 'Deleting...' : 'Delete Control'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 