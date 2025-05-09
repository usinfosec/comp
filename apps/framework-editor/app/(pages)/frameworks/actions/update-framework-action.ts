'use server'

import { z } from 'zod'
import { db } from '@comp/db'
import { revalidatePath } from 'next/cache'
import { createSafeActionClient } from 'next-safe-action'
import type { ActionResponse } from '@/app/actions/actions' // Assuming this path is correct based on instructions
import type { FrameworkEditorFramework } from '@prisma/client'

const UpdateFrameworkSchema = z.object({
  id: z.string().min(1, { message: 'Framework ID is required.' }),
  name: z.string().min(1, { message: 'Framework name is required.' }),
  description: z.string().min(1, { message: 'Framework description is required.' }),
  version: z.string().min(1, { message: 'Version is required.' }).regex(/^\d+\.\d+\.\d+$/, { message: "Version must be in format X.Y.Z (e.g., 1.0.0)"}),
})

export type UpdateFrameworkInput = z.infer<typeof UpdateFrameworkSchema>;
export type UpdateFrameworkSuccessData = Pick<FrameworkEditorFramework, 'id' | 'name' | 'description' | 'version'>;


// Define appErrors and AppError if they are standard in your project, or adjust error handling
// For now, using a generic error structure.
const appErrors = {
  UNEXPECTED_ERROR: { message: 'An unexpected error occurred.' },
  UPDATE_FAILED: { message: 'Failed to update framework in the database.' },
  NOT_FOUND: { message: 'Framework not found.'}
};
class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
  }
}


export const updateFrameworkAction = createSafeActionClient()
  .schema(UpdateFrameworkSchema)
  .action(async (input): Promise<ActionResponse<UpdateFrameworkSuccessData>> => {
    try {
      const { id, name, description, version } = input;

      const existingFramework = await db.frameworkEditorFramework.findUnique({
        where: { id },
      });

      if (!existingFramework) {
        return { success: false, error: appErrors.NOT_FOUND };
      }

      const updatedFramework = await db.frameworkEditorFramework.update({
        where: { id },
        data: {
          name,
          description,
          version,
        },
        select: { // Select only the necessary fields for the response
            id: true,
            name: true,
            description: true,
            version: true,
        }
      });

      revalidatePath('/frameworks');
      revalidatePath(`/frameworks/${id}`); // Revalidate the specific framework page

      return { success: true, data: updatedFramework };
    } catch (error) {
      console.error('Failed to update framework:', error);
      // More specific error handling can be added here
      return { 
        success: false, 
        error: error instanceof AppError ? error : appErrors.UPDATE_FAILED, 
      };
    }
  }); 