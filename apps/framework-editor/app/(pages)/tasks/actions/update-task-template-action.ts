'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { Frequency, Departments } from '@prisma/client';
import { db } from '@comp/db';

const updateTaskTemplateSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  frequency: z.nativeEnum(Frequency),
  department: z.nativeEnum(Departments),
});

export type UpdateTaskTemplateActionState = {
  success?: boolean;
  error?: string;
  message?: string;
  data?: {
    id: string;
    name: string;
    description: string | null;
    frequency: Frequency;
    department: Departments;
  };
  issues?: Array<{
    path: string[];
    message: string;
  }>;
};

export async function updateTaskTemplateAction(
  _prevState: UpdateTaskTemplateActionState | undefined,
  formData: FormData
): Promise<UpdateTaskTemplateActionState> {
  try {
    const rawData = {
      id: formData.get('id'),
      name: formData.get('name'),
      description: formData.get('description'),
      frequency: formData.get('frequency'),
      department: formData.get('department'),
    };

    const result = updateTaskTemplateSchema.safeParse(rawData);

    if (!result.success) {
      return {
        success: false,
        issues: result.error.issues.map((issue) => ({
          path: issue.path.map(String),
          message: issue.message,
        })),
      };
    }

    const { id, name, description, frequency, department } = result.data;

    const updatedTask = await db.frameworkEditorTaskTemplate.update({
      where: { id },
      data: {
        name,
        description: description || '',
        frequency,
        department,
      },
    });

    revalidatePath('/tasks');

    return {
      success: true,
      message: 'Task Template updated successfully!',
      data: updatedTask,
    };
  } catch (error) {
    console.error('Error updating task template:', error);
    return {
      success: false,
      error: 'Failed to update task template. Please try again.',
    };
  }
} 