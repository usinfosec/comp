"use server";

import { db } from "@comp/db";
import { generateChecklistItems } from "./checklist-items";
import type { ChecklistItemProps } from "./types";

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
		return { error: "Organization onboarding not found" };
	}

	const checklistItems = generateChecklistItems(onboarding, orgId);

	const completedItems = checklistItems.filter((item) => item.completed).length;
	const totalItems = checklistItems.length;

	return { checklistItems, completedItems, totalItems };
} 