import { Onboarding } from "@comp/db/types";

export const onboardingSteps = [
	"policies",
	"employees",
	"vendors",
	"risk",
	"tasks",
	"callBooked",
] as const; // Use 'as const' for literal types

export type OnboardingStep = (typeof onboardingSteps)[number];

export interface ChecklistItemProps {
	title: string;
	description?: string;
	href?: string;
	docs: string;
	dbColumn?: Exclude<keyof Onboarding, "organizationId">;
	completed?: boolean;
	buttonLabel: string;
	icon: React.ReactNode;
	type?: "default" | "wizard" | "calendar";
	wizardPath?: string;
	calendarPath?: string;
	// For wizards, allow specifying a completion boolean directly
	wizardCompleted?: boolean;
	calendarCompleted?: boolean;
}
