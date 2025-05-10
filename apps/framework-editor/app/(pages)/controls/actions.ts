'use server'

import { db } from '@comp/db';
import { revalidatePath } from 'next/cache';
import type { SearchableItemForLinking } from '@/app/components/SearchAndLinkList'; // Assuming this path is correct

/**
 * Fetches all requirements, including their framework name.
 */
export async function getAllRequirements(): Promise<SearchableItemForLinking[]> {
  try {
    const requirements = await db.frameworkEditorRequirement.findMany({
      select: {
        id: true,
        name: true,
        framework: { // Include framework details
          select: {
            id: true, // Useful if you ever want to link to the framework itself
            name: true,
          }
        }
      },
      orderBy: {
        name: 'asc',
      },
    });
    // The return type is SearchableItemForLinking, which allows for extra properties like 'framework'.
    return requirements.map(r => ({ ...r, frameworkName: r.framework?.name })); // Optionally flatten for easier access if preferred
  } catch (error) {
    console.error("Error fetching all requirements:", error);
    throw new Error("Failed to fetch all requirements.");
  }
}

/**
 * Links a requirement to a control template.
 */
export async function linkRequirementToControl(controlId: string, requirementId: string): Promise<void> {
  if (!controlId || !requirementId) {
    throw new Error("Control ID and Requirement ID must be provided.");
  }
  try {
    await db.frameworkEditorControlTemplate.update({
      where: { id: controlId },
      data: {
        requirements: {
          connect: { id: requirementId },
        },
      },
    });
    revalidatePath(`/controls/${controlId}`);
    revalidatePath('/controls'); // Also revalidate the list page if counts are shown there
  } catch (error) {
    console.error("Error linking requirement to control:", error);
    throw new Error("Failed to link requirement.");
  }
}

/**
 * Unlinks a requirement from a control template.
 */
export async function unlinkRequirementFromControl(controlId: string, requirementId: string): Promise<void> {
  if (!controlId || !requirementId) {
    throw new Error("Control ID and Requirement ID must be provided.");
  }
  try {
    await db.frameworkEditorControlTemplate.update({
      where: { id: controlId },
      data: {
        requirements: {
          disconnect: { id: requirementId },
        },
      },
    });
    revalidatePath(`/controls/${controlId}`);
    revalidatePath('/controls');
  } catch (error) {
    console.error("Error unlinking requirement from control:", error);
    throw new Error("Failed to unlink requirement.");
  }
}

// --- Policy Template Actions ---

/**
 * Fetches all policy templates.
 */
export async function getAllPolicyTemplates(): Promise<SearchableItemForLinking[]> {
  try {
    const policyTemplates = await db.frameworkEditorPolicyTemplate.findMany({ 
      select: {
        id: true,
        name: true,
        // Add other relevant fields, e.g., category or type if needed for display
      },
      orderBy: {
        name: 'asc',
      },
    });
    return policyTemplates.map((pt: {id: string, name: string}) => ({ id: pt.id, name: pt.name })); 
  } catch (error) {
    console.error("Error fetching all policy templates:", error);
    throw new Error("Failed to fetch all policy templates.");
  }
}

/**
 * Links a policy template to a control template.
 */
export async function linkPolicyTemplateToControl(controlId: string, policyTemplateId: string): Promise<void> {
  if (!controlId || !policyTemplateId) {
    throw new Error("Control ID and Policy Template ID must be provided.");
  }
  try {
    await db.frameworkEditorControlTemplate.update({
      where: { id: controlId },
      data: {
        policyTemplates: { // Assuming a 'policyTemplates' relation exists on the control model
          connect: { id: policyTemplateId },
        },
      },
    });
    revalidatePath(`/controls/${controlId}`);
    revalidatePath('/controls');
  } catch (error) {
    console.error("Error linking policy template to control:", error);
    throw new Error("Failed to link policy template.");
  }
}

/**
 * Unlinks a policy template from a control template.
 */
export async function unlinkPolicyTemplateFromControl(controlId: string, policyTemplateId: string): Promise<void> {
  if (!controlId || !policyTemplateId) {
    throw new Error("Control ID and Policy Template ID must be provided.");
  }
  try {
    await db.frameworkEditorControlTemplate.update({
      where: { id: controlId },
      data: {
        policyTemplates: {
          disconnect: { id: policyTemplateId },
        },
      },
    });
    revalidatePath(`/controls/${controlId}`);
    revalidatePath('/controls');
  } catch (error) {
    console.error("Error unlinking policy template from control:", error);
    throw new Error("Failed to unlink policy template.");
  }
}

// --- Task Template Actions ---

/**
 * Fetches all task templates.
 */
export async function getAllTaskTemplates(): Promise<SearchableItemForLinking[]> {
  try {
    const taskTemplates = await db.frameworkEditorTaskTemplate.findMany({ 
      select: {
        id: true,
        name: true,
        // Add other relevant fields
      },
      orderBy: {
        name: 'asc',
      },
    });
    return taskTemplates.map((tt: {id: string, name: string}) => ({ id: tt.id, name: tt.name }));
  } catch (error) {
    console.error("Error fetching all task templates:", error);
    throw new Error("Failed to fetch all task templates.");
  }
}

/**
 * Links a task template to a control template.
 */
export async function linkTaskTemplateToControl(controlId: string, taskTemplateId: string): Promise<void> {
  if (!controlId || !taskTemplateId) {
    throw new Error("Control ID and Task Template ID must be provided.");
  }
  try {
    await db.frameworkEditorControlTemplate.update({
      where: { id: controlId },
      data: {
        taskTemplates: { // Assuming a 'taskTemplates' relation exists on the control model
          connect: { id: taskTemplateId },
        },
      },
    });
    revalidatePath(`/controls/${controlId}`);
    revalidatePath('/controls');
  } catch (error) {
    console.error("Error linking task template to control:", error);
    throw new Error("Failed to link task template.");
  }
}

/**
 * Unlinks a task template from a control template.
 */
export async function unlinkTaskTemplateFromControl(controlId: string, taskTemplateId: string): Promise<void> {
  if (!controlId || !taskTemplateId) {
    throw new Error("Control ID and Task Template ID must be provided.");
  }
  try {
    await db.frameworkEditorControlTemplate.update({
      where: { id: controlId },
      data: {
        taskTemplates: {
          disconnect: { id: taskTemplateId },
        },
      },
    });
    revalidatePath(`/controls/${controlId}`);
    revalidatePath('/controls');
  } catch (error) {
    console.error("Error unlinking task template from control:", error);
    throw new Error("Failed to unlink task template.");
  }
}

// --- Control Actions ---

interface UpdateControlPayload {
  name: string;
  description: string;
}

/**
 * Updates the details of a control template.
 */
export async function updateControlDetails(controlId: string, data: UpdateControlPayload): Promise<void> {
  if (!controlId) {
    throw new Error("Control ID must be provided.");
  }
  if (!data.name || data.name.trim() === "") {
    throw new Error("Control name must be provided.");
  }

  try {
    await db.frameworkEditorControlTemplate.update({
      where: { id: controlId },
      data: {
        name: data.name,
        description: data.description,
      },
    });
    revalidatePath(`/controls/${controlId}`);
    revalidatePath('/controls');
  } catch (error) {
    console.error("Error updating control details:", error);
    throw new Error("Failed to update control details.");
  }
}

/**
 * Deletes a control template.
 */
export async function deleteControl(controlId: string): Promise<void> {
  if (!controlId) {
    throw new Error("Control ID must be provided.");
  }
  try {
    // Note: Depending on DB constraints, you might need to disconnect relations first
    // if there's no onDelete: Cascade or similar set up for related items.
    await db.frameworkEditorControlTemplate.delete({
      where: { id: controlId },
    });
    revalidatePath(`/controls/${controlId}`); // Or just /controls if navigating away
    revalidatePath('/controls');
  } catch (error) {
    console.error("Error deleting control:", error);
    // Consider more specific error handling, e.g., if control not found or if relations prevent deletion
    throw new Error("Failed to delete control.");
  }
} 