'use client'

import { useState } from 'react';
// useRouter is not strictly needed if action handles redirect and client only refreshes or closes dialog.
// import { useRouter } from 'next/navigation'; 
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@comp/ui/alert-dialog";
import { Button } from "@comp/ui/button";
import { useToast } from "@comp/ui/use-toast";
import { deleteFrameworkAction } from '../actions/delete-framework'; // Import the server action
import type { ActionResponse } from '../actions/delete-framework'; // Import ActionResponse from the action file

interface DeleteFrameworkDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  frameworkId: string;
  frameworkName: string;
  // onFrameworkDeleted: () => void; // This can be removed if redirect handles everything
}

export function DeleteFrameworkDialog({
  isOpen,
  onOpenChange,
  frameworkId,
  frameworkName,
}: DeleteFrameworkDialogProps) {
  // const router = useRouter(); // Not needed if action handles redirect
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteFrameworkAction({ frameworkId });

      if (result && result.data?.success) { // next-safe-action wraps response in 'data' for successful server code execution
        toast({
          title: "Success",
          description: result.data.message || "Framework and its requirements have been deleted. Redirecting...",
        });
        onOpenChange(false);
        // No router.push('/frameworks') here as the action handles the redirect.
        // router.refresh() might also be redundant if redirect is effective immediately.
      } else if (result && result.serverError) { // Error from server action logic (e.g., caught exception)
         toast({
          title: "Error",
          description: result.serverError || "Failed to delete framework.",
          variant: "destructive",
        });
      } else if (result && result.validationErrors) { // Zod validation errors
        toast({
          title: "Validation Error",
          description: "There was an issue with the provided data. " + Object.values(result.validationErrors).flat().join(", "),
          variant: "destructive",
        });
      } else {
        toast({
            title: "Error",
            description: "An unexpected error occurred during deletion.",
            variant: "destructive",
        });
      }
    } catch (error) {
      // This catch block is for unexpected errors during the action call itself (e.g., network issue)
      toast({
        title: "Error",
        description: "An unexpected error occurred while trying to delete the framework.",
        variant: "destructive",
      });
    }
    setIsDeleting(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
      if (isDeleting && !open) return; // Prevent closing while deleting if onOpenChange is called externally
      onOpenChange(open);
    }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete {`"${frameworkName}"`}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the framework and all of its associated requirements.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} onClick={() => onOpenChange(false)}>Cancel</AlertDialogCancel>
          {/* AlertDialogAction can be used for the primary action button styling */}
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 