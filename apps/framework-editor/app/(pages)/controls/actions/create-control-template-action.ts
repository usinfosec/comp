"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@comp/db";
import type { FrameworkEditorControlTemplate } from "@prisma/client";
import { createControlTemplateSchema } from "../schemas";

export interface CreateControlTemplateActionState {
  success: boolean;
  data?: FrameworkEditorControlTemplate;
  error?: string;
  issues?: z.ZodIssue[];
  message?: string;
}

export async function createControlTemplateAction(
  prevState: CreateControlTemplateActionState | null, 
  formData: FormData
): Promise<CreateControlTemplateActionState> {
  const rawInput = {
    name: formData.get("name"),
    description: formData.get("description"),
  };

  const validationResult = createControlTemplateSchema.safeParse(rawInput);

  if (!validationResult.success) {
    return {
      success: false,
      error: "Invalid input.",
      issues: validationResult.error.issues,
    };
  }

  const { name, description } = validationResult.data;

  try {
    const controlTemplate = await db.frameworkEditorControlTemplate.create({
      data: {
        name,
        description: description || "", // Ensure description is not undefined
      },
    });

    revalidatePath("/controls"); // Revalidate the controls page to show the new entry

    return { 
      success: true, 
      data: controlTemplate, 
      message: "Control Template created successfully."
    };
  } catch (error) {
    console.error("Failed to create control template:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create control template in the database.";
    return {
      success: false,
      error: `Database error: ${errorMessage}`,
    };
  }
} 