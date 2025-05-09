'use client'

import { Button } from '@comp/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@comp/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@comp/ui/form'
import { Input } from '@comp/ui/input'
import { Textarea } from '@comp/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { updateFrameworkAction, type UpdateFrameworkInput } from '../../actions/update-framework-action' // Adjusted path
import type { ActionResponse } from '@/app/actions/actions' // Assuming this path
import type { FrameworkEditorFramework } from '@prisma/client'

interface EditFrameworkDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  framework: Pick<FrameworkEditorFramework, 'id' | 'name' | 'description' | 'version'>
  onFrameworkUpdated?: (updatedData: Pick<FrameworkEditorFramework, 'id' | 'name' | 'description' | 'version'>) => void
}

const frameworkFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  version: z.string().min(1, { message: "Version is required." }).regex(/^\d+\.\d+\.\d+$/, { message: "Version must be in format X.Y.Z (e.g., 1.0.0)"})
})

type FrameworkFormValues = z.infer<typeof frameworkFormSchema>

export function EditFrameworkDialog({ isOpen, onOpenChange, framework, onFrameworkUpdated }: EditFrameworkDialogProps) {
  const form = useForm<FrameworkFormValues>({
    resolver: zodResolver(frameworkFormSchema),
    defaultValues: {
      name: framework.name,
      description: framework.description,
      version: framework.version,
    },
    mode: 'onChange',
  })

  useEffect(() => {
    // Reset form when framework prop changes (e.g. when dialog is reopened with different data)
    form.reset({
        name: framework.name,
        description: framework.description,
        version: framework.version,
    })
  }, [framework, form])

  async function onSubmit(values: FrameworkFormValues) {
    const input: UpdateFrameworkInput = {
      id: framework.id,
      name: values.name,
      description: values.description,
      version: values.version,
    }
    
    const result: ActionResponse<Pick<FrameworkEditorFramework, 'id' | 'name' | 'description' | 'version'>> = await updateFrameworkAction(input);

    if (result.success && result.data) {
      toast.success('Framework updated successfully!')
      onOpenChange(false) // Close dialog on success
      if (onFrameworkUpdated) {
        onFrameworkUpdated(result.data)
      }
    } else if (result.error) {
        // Handle server-side validation errors specifically for fields
        if (result.validationErrors) {
            result.validationErrors.forEach(issue => {
                if (issue.path && issue.path.length > 0 && (issue.path[0] === 'name' || issue.path[0] === 'description' || issue.path[0] === 'version')) {
                    form.setError(issue.path[0] as keyof FrameworkFormValues, { type: 'server', message: issue.message });
                } else {
                    toast.error(issue.message); // General validation error not tied to a field
                }
            });
        } else {
            toast.error(result.error.message || 'Failed to update framework.');
        }
    } else {
        toast.error('An unexpected error occurred.');
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        // Optionally reset form if dialog is closed manually without saving, 
        // though useEffect above handles pre-fill/reset on open/data change
        form.reset({
            name: framework.name,
            description: framework.description,
            version: framework.version,
        });
      }
      onOpenChange(open);
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Framework</DialogTitle>
          <DialogDescription>
            Update the details for the framework. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Name</FormLabel>
                  <FormControl className="col-span-3">
                    <Input placeholder="Enter framework name" {...field} />
                  </FormControl>
                  <div className="col-start-2 col-span-3">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Description</FormLabel>
                  <FormControl className="col-span-3">
                    <Textarea placeholder="Enter framework description" {...field} />
                  </FormControl>
                  <div className="col-start-2 col-span-3">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Version</FormLabel>
                  <FormControl className="col-span-3">
                    <Input placeholder="e.g., 1.0.0" {...field} />
                  </FormControl>
                  <div className="col-start-2 col-span-3">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isDirty}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 