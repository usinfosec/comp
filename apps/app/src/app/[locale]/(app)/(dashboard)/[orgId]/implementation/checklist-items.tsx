import type { Onboarding } from "@comp/db/types";
import { Icons } from "@comp/ui/icons";
import {
	Briefcase,
	Calendar,
	ListCheck,
	NotebookText,
	Store,
	Users,
} from "lucide-react";
import type { ChecklistItemProps } from "./types";
import { companyDetailsObjectSchema } from "./lib/models/CompanyDetails";
import { z } from "zod";

export function generateChecklistItems(
	onboarding: Onboarding,
	orgId: string,
): ChecklistItemProps[] {
	return [
		{
			title: "Optional: Get SOC 2 or ISO 27001 in just 4 weeks",
			description: "Get SOC 2 compliant in just 4 weeks, implemented by the Comp AI team. Packages starting at $3,000/year - book a call and we'll share more..",
			href: `/${orgId}/implementation/calendar`,
			buttonLabel: "Get started",
			icon: <Calendar className="h-5 w-5" />,
			docs: "https://trycomp.ai/docs/call",
			completed: onboarding.callBooked,
			calendarPath: `/${orgId}/implementation/book-call`,
			type: "calendar",
		},
		{
			title: "Fill out company details",
			description:
				"In order to get started, you need to provide some basic details about how your company operates.",
			wizardPath: `/${orgId}/implementation/wizard/company-details`,
			completed:
				(
					onboarding.companyDetails as z.infer<
						typeof companyDetailsObjectSchema
					>
				)?.isCompleted || false,
			docs: "https://trycomp.ai/docs/details",
			buttonLabel: "Fill out details",
			icon: <Briefcase className="h-5 w-5" />,
			type: "wizard",
		},
		{
			title: "Check & Publish Policies",
			description:
				"We've given you all of the policies you need to get started. Go through them, make sure they're relevant to your organization and then publish them for your employees to sign.",
			href: `/${orgId}/policies`,
			dbColumn: "policies",
			completed: onboarding.policies,
			docs: "https://trycomp.ai/docs/policies",
			buttonLabel: "Publish Policies",
			icon: <NotebookText className="h-5 w-5" />,
		},
		{
			title: "Add Employees",
			description:
				"You should add all of your employees to Comp AI, either through an integration or by manually adding them and then ask them to sign the policies you published in the employee portal.",
			href: `/${orgId}/people`,
			dbColumn: "employees",
			completed: onboarding.employees,
			docs: "https://trycomp.ai/docs/people",
			buttonLabel: "Add an Employee",
			icon: <Users className="h-5 w-5" />,
		},
		{
			title: "Add Vendors",
			description:
				"For frameworks like SOC 2, you must assess and report on your vendors. You can add your vendors to Comp AI, and assign risk levels to them. Auditors can review the vendors and their risk levels.",
			href: `/${orgId}/vendors`,
			dbColumn: "vendors",
			completed: onboarding.vendors,
			docs: "https://trycomp.ai/docs/vendors",
			buttonLabel: "Add a Vendor",
			icon: <Store className="h-5 w-5" />,
		},
		{
			title: "Manage Risks",
			description:
				"You can manage your risks in Comp AI by adding them to your organization and then assigning them to employees or vendors. Auditors can review the risks and their status.",
			href: `/${orgId}/risk`,
			dbColumn: "risk",
			completed: onboarding.risk,
			docs: "https://trycomp.ai/docs/risks",
			buttonLabel: "Create a Risk",
			icon: <Icons.Risk className="h-5 w-5" />,
		},
		{
			title: "Complete Tasks",
			description:
				"Tasks in Comp AI are automatically generated for you, based on the frameworks you selected. Tasks are linked to controls, which are determined by your policies. By completing tasks, you can show auditors that you are following your own policies.",
			href: `/${orgId}/tasks`,
			dbColumn: "tasks",
			completed: onboarding.tasks,
			docs: "https://trycomp.ai/docs/tasks",
			buttonLabel: "Create a Task",
			icon: <ListCheck className="h-5 w-5" />,
		},
	];
}
