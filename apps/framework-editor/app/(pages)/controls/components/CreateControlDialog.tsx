'use client';

import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@comp/ui/form";
import { Input } from "@comp/ui/input";
import { Textarea } from "@comp/ui/textarea";

import { createControlTemplateAction, type CreateControlTemplateActionState } from '../actions/create-control-template-action';

interface CreateControlDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onControlCreated: () => void; 
}

// Inline a simple schema for testing
const testSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
});

const controlFormSchema = testSchema; // Use the test schema

type ControlFormValues = z.infer<typeof controlFormSchema>;

export function CreateControlDialog({ isOpen, onOpenChange, onControlCreated }: CreateControlDialogProps) {
  const [actionState, setActionState] = React.useState<CreateControlTemplateActionState | undefined>(undefined);
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<ControlFormValues>({
    resolver: zodResolver(controlFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!actionState) return;

    if (actionState.success && actionState.data) {
      toast.success(actionState.message || 'Control Template created successfully!');
      onOpenChange(false);
      form.reset();
      onControlCreated();
    } else if (actionState.error) {
      if (actionState.issues) {
        actionState.issues.forEach(issue => {
          if (issue.path.length > 0 && (issue.path[0] === 'name' || issue.path[0] === 'description')) {
            form.setError(issue.path[0] as keyof ControlFormValues, { type: 'server', message: issue.message });
          } else {
            toast.error(issue.message);
          }
        });
      } else {
        toast.error(actionState.error);
      }
    }
    // Reset actionState after handling to prevent re-triggering effect
    setActionState(undefined);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionState, onOpenChange, onControlCreated, form.reset, form.setError]); // form.reset and form.setError added to dep array

  async function onSubmit(values: ControlFormValues) {
    const formData = new FormData();
    formData.append('name', values.name);
    if (values.description) {
      formData.append('description', values.description);
    }
    
    const result = await createControlTemplateAction(null, formData);
    setActionState(result);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        form.reset();
        setActionState(undefined);
      }
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Control Template</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new control template.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} ref={formRef} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter control template name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter control template description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting || actionState?.success}>
                {form.formState.isSubmitting ? 'Creating...' : 'Create Control Template'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 