"use server";

import { z } from "zod";
import { db } from "@comp/db";
import { CreatePolicySchema } from "./schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPolicyAction(formData: z.infer<typeof CreatePolicySchema>) {
  const validatedFields = CreatePolicySchema.safeParse(formData);

  if (!validatedFields.success) {
    // Consider returning a more structured error for the form
    // For now, throwing an error or returning a simple error object
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Policy not created.",
    };
  }

  const { name, description, frequency, department } = validatedFields.data;

  try {
    const newPolicy = await db.frameworkEditorPolicyTemplate.create({
      data: {
        name,
        description,
        frequency,
        department,
        content: {}, // Defaulting content to an empty object as it's not in the form but required by schema
      },
    });

    revalidatePath("/policies");
    // Redirect will be handled on the client after a successful response
    // or we can redirect here and handle the response on the client to show a success message before redirect
    return { success: true, policyId: newPolicy.id };

  } catch (error) {
    console.error("Error creating policy:", error);
    return {
      errors: null,
      message: "An error occurred while creating the policy.",
    };
  }
} 