'use server';

import { z } from 'zod';
import { db } from '@comp/db';
import { revalidatePath } from 'next/cache';
import { Frequency, Departments } from '@prisma/client';

const createTaskTemplateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  frequency: z.nativeEnum(Frequency),
  department: z.nativeEnum(Departments),
});

export type CreateTaskTemplateActionState = {
  success: boolean;
  error?: string;
  issues?: z.ZodIssue[];
  data?: any;
  message?: string;
};

export async function createTaskTemplateAction(
  prevState: CreateTaskTemplateActionState | undefined,
  formData: FormData
): Promise<CreateTaskTemplateActionState> {
  try {
    const rawData = {
      name: formData.get('name'),
      description: formData.get('description'),
      frequency: formData.get('frequency'),
      department: formData.get('department'),
    };

    const result = createTaskTemplateSchema.safeParse(rawData);

    if (!result.success) {
      return {
        success: false,
        issues: result.error.issues,
      };
    }

    const taskTemplate = await db.frameworkEditorTaskTemplate.create({
      data: {
        name: result.data.name,
        description: result.data.description || '',
        frequency: result.data.frequency,
        department: result.data.department,
      },
    });

    revalidatePath('/tasks');

    return {
      success: true,
      data: taskTemplate,
      message: 'Task template created successfully',
    };
  } catch (error) {
    console.error('Error creating task template:', error);
    return {
      success: false,
      error: 'Failed to create task template',
    };
  }
} 