'use client';

import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Frequency, Departments, FrameworkEditorTaskTemplate } from '@prisma/client';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@comp/ui/select";

import { updateTaskTemplateAction } from '../actions/update-task-template-action';

const taskFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  frequency: z.nativeEnum(Frequency),
  department: z.nativeEnum(Departments),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface EditTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  task: FrameworkEditorTaskTemplate;
  onTaskUpdated: (updatedTask: Pick<FrameworkEditorTaskTemplate, 'id' | 'name' | 'description' | 'frequency' | 'department'>) => void;
}

export function EditTaskDialog({ isOpen, onOpenChange, task, onTaskUpdated }: EditTaskDialogProps) {
  const [actionState, setActionState] = React.useState<any>(undefined);
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: task.name,
      description: task.description || '',
      frequency: task.frequency,
      department: task.department,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!actionState) return;

    if (actionState.success && actionState.data) {
      toast.success(actionState.message || 'Task Template updated successfully!');
      onOpenChange(false);
      form.reset();
      onTaskUpdated(actionState.data);
    } else if (actionState.error) {
      if (actionState.issues) {
        actionState.issues.forEach((issue: any) => {
          if (issue.path.length > 0 && (issue.path[0] === 'name' || issue.path[0] === 'description')) {
            form.setError(issue.path[0] as keyof TaskFormValues, { type: 'server', message: issue.message });
          } else {
            toast.error(issue.message);
          }
        });
      } else {
        toast.error(actionState.error);
      }
    }
    setActionState(undefined);
  }, [actionState, onOpenChange, onTaskUpdated, form]);

  async function onSubmit(values: TaskFormValues) {
    const formData = new FormData();
    formData.append('id', task.id);
    formData.append('name', values.name);
    if (values.description) {
      formData.append('description', values.description);
    }
    formData.append('frequency', values.frequency);
    formData.append('department', values.department);
    
    const result = await updateTaskTemplateAction(undefined, formData);
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
          <DialogTitle>Edit Task Template</DialogTitle>
          <DialogDescription>
            Update the details below to modify the task template.
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
                    <Input placeholder="Enter task template name" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter task template description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={Frequency.monthly}>Monthly</SelectItem>
                      <SelectItem value={Frequency.quarterly}>Quarterly</SelectItem>
                      <SelectItem value={Frequency.yearly}>Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={Departments.none}>None</SelectItem>
                      <SelectItem value={Departments.admin}>Admin</SelectItem>
                      <SelectItem value={Departments.gov}>Government</SelectItem>
                      <SelectItem value={Departments.hr}>HR</SelectItem>
                      <SelectItem value={Departments.it}>IT</SelectItem>
                      <SelectItem value={Departments.itsm}>ITSM</SelectItem>
                      <SelectItem value={Departments.qms}>QMS</SelectItem>
                    </SelectContent>
                  </Select>
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
                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 