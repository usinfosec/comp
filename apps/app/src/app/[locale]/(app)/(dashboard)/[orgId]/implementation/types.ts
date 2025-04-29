import type { Onboarding } from "@comp/db/types";

// Define valid onboarding steps based on the Onboarding model keys
export const onboardingSteps = [
	"policies",
	"employees",
	"vendors",
	"risk",
	"tasks",
] as const; // Use 'as const' for literal types

export type OnboardingStep = (typeof onboardingSteps)[number];

export interface ChecklistItemProps {
	title: string;
	description: string;
	href: string;
	dbColumn: OnboardingStep; // Use the derived literal type
	completed: boolean;
	docs: string;
	buttonLabel: string;
	icon: React.ReactNode;
} 