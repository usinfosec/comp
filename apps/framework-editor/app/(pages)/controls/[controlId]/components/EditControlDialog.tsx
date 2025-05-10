'use client'

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@comp/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@comp/ui/dialog';
import { Input } from '@comp/ui/input';
import { Textarea } from '@comp/ui/textarea'; // Assuming you have a Textarea component
import { Label } from '@comp/ui/label';
import { updateControlDetails } from '../../actions'; // Path to your server actions
import type { ControlDetailsWithRelations } from '../page'; // Type for control details
import { toast } from 'sonner'; // For notifications

const formSchema = z.object({
  name: z.string().min(1, { message: 'Control name is required.' }).max(255),
  description: z.string().max(1024).optional(), // Optional, adjust as needed
});

type EditControlFormValues = z.infer<typeof formSchema>;

interface EditControlDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  control: Pick<ControlDetailsWithRelations, 'id' | 'name' | 'description'>;
  onControlUpdated: () => void;
}

export function EditControlDialog({
  isOpen,
  onOpenChange,
  control,
  onControlUpdated,
}: EditControlDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditControlFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: control.name || '',
      description: control.description || '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: control.name || '',
        description: control.description || '',
      });
    }
  }, [isOpen, control, form]);

  const onSubmit = async (values: EditControlFormValues) => {
    setIsSubmitting(true);
    try {
      await updateControlDetails(control.id, {
        name: values.name,
        description: values.description || '', // Ensure empty string if undefined
      });
      toast.success('Control details updated successfully!');
      onControlUpdated(); // This will typically close dialog and refresh data
      onOpenChange(false); // Explicitly close dialog
    } catch (error) {
      console.error("Failed to update control:", error);
      toast.error('Failed to update control. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] rounded-sm">
        <DialogHeader>
          <DialogTitle>Edit Control Details</DialogTitle>
          <DialogDescription>
            Make changes to the control name and description.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Control Name</Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="Enter control name"
              className="rounded-sm"
            />
            {form.formState.errors.name && (
              <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Enter control description"
              rows={4}
              className="rounded-sm"
            />
            {form.formState.errors.description && (
              <p className="text-xs text-red-500">{form.formState.errors.description.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting} className="rounded-sm">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="rounded-sm">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 