'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { db } from '@comp/db';

const deleteTaskTemplateSchema = z.object({
  id: z.string(),
});

export type DeleteTaskTemplateActionState = {
  success?: boolean;
  error?: string;
  message?: string;
};

export async function deleteTaskTemplateAction(
  _prevState: DeleteTaskTemplateActionState | undefined,
  formData: FormData
): Promise<DeleteTaskTemplateActionState> {
  try {
    const rawData = {
      id: formData.get('id'),
    };

    const result = deleteTaskTemplateSchema.safeParse(rawData);

    if (!result.success) {
      return {
        success: false,
        error: 'Invalid task template ID',
      };
    }

    const { id } = result.data;

    await db.frameworkEditorTaskTemplate.delete({
      where: { id },
    });

    revalidatePath('/tasks');

    return {
      success: true,
      message: 'Task Template deleted successfully!',
    };
  } catch (error) {
    console.error('Error deleting task template:', error);
    return {
      success: false,
      error: 'Failed to delete task template. Please try again.',
    };
  }
} 