import type { Onboarding } from "@comp/db/types";

export interface ChecklistItemProps {
	title: string;
	description: string;
	href: string;
	dbColumn: Exclude<keyof Onboarding, "organizationId">;
	completed: boolean;
	docs: string;
	buttonLabel: string;
	icon: React.ReactNode;
} 