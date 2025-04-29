"use server";

import { db } from "@comp/db";
import { generateChecklistItems } from "./checklist-items";
import type { ChecklistItemProps, OnboardingStep } from "./types";
import { onboardingSteps } from "./types"; // Keep for type checking
import { revalidatePath } from "next/cache";
import { appErrors } from "@/lib/errors";

export interface OnboardingStatus {
	checklistItems: ChecklistItemProps[];
	completedItems: number;
	totalItems: number;
}

export async function getOnboardingStatus(
	orgId: string,
): Promise<OnboardingStatus | { error: string }> {
	const onboarding = await db.onboarding.findUnique({
		where: {
			organizationId: orgId,
		},
	});

	if (!onboarding) {
		// If onboarding record doesn't exist, create one
		// This might happen for newly created orgs or if something went wrong
		try {
			const newOnboarding = await db.onboarding.create({
				data: {
					organizationId: orgId,
					// Initialize all steps to false
					policies: false,
					employees: false,
					vendors: false,
					risk: false,
					tasks: false,
				},
			});
			// Continue with the newly created record
			const checklistItems = generateChecklistItems(newOnboarding, orgId);
			const completedItems = 0;
			const totalItems = checklistItems.length;
			return { checklistItems, completedItems, totalItems };
		} catch (error) {
			console.error("Failed to create onboarding record:", error);
			return { error: "Failed to initialize onboarding status." };
		}
	}

	const checklistItems = generateChecklistItems(onboarding, orgId);
	const completedItems = checklistItems.filter(
		(item) => item.completed,
	).length;
	const totalItems = checklistItems.length;

	return { checklistItems, completedItems, totalItems };
}

// Regular Server Action to mark a step complete/incomplete
export async function markOnboardingStep({
	orgId,
	step,
	completed,
}: {
	orgId: string;
	step: OnboardingStep; // Use the specific type
	completed: boolean;
}): Promise<{ success: boolean; error?: string }> {
	// Basic validation (can add more checks if needed)
	if (!orgId || !onboardingSteps.includes(step)) {
		return { success: false, error: "Invalid input provided." };
	}

	try {
		const updatedOnboarding = await db.onboarding.update({
			where: {
				organizationId: orgId,
			},
			data: {
				[step]: completed,
			},
		});

		if (!updatedOnboarding) {
			// Return the error key directly
			return { success: false, error: appErrors.NOT_FOUND };
		}

		// Revalidate paths
		revalidatePath(`/${orgId}/implementation`);
		revalidatePath(`/${orgId}/layout`);

		return { success: true };
	} catch (error) {
		console.error("Failed to update onboarding step:", error);
		// Return the error key directly
		return { success: false, error: appErrors.UNEXPECTED_ERROR };
	}
}
