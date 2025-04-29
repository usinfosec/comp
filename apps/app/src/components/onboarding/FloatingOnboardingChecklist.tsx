"use client";

import { Progress } from "@comp/ui/progress";
import { cn } from "@comp/ui/cn";
import Link from "next/link";
import { Button } from "@comp/ui/button";
import type {
	ChecklistItemProps,
	OnboardingStep,
} from "@/app/[locale]/(app)/(dashboard)/[orgId]/implementation/types";
import { usePathname, useRouter } from "next/navigation";
import { Checkbox } from "@comp/ui/checkbox";
import { markOnboardingStep } from "@/app/[locale]/(app)/(dashboard)/[orgId]/implementation/actions";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface FloatingOnboardingChecklistProps {
	orgId: string;
	completedItems: number;
	totalItems: number;
	checklistItems: ChecklistItemProps[];
	className?: string;
}

export function FloatingOnboardingChecklist({
	orgId,
	completedItems: initialCompletedItems,
	totalItems,
	checklistItems: initialChecklistItems,
	className,
}: FloatingOnboardingChecklistProps) {
	const pathname = usePathname();
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	// Local state for optimistic updates
	const [checklistItems, setChecklistItems] = useState(initialChecklistItems);
	const [completedItems, setCompletedItems] = useState(initialCompletedItems);

	const incompleteItems = checklistItems.filter((item) => !item.completed);
	const remainingItems = totalItems - completedItems;
	const progressPercentage = (completedItems / totalItems) * 100;

	const implementationPathRegex = /\/[^/]+\/implementation(\/.*)?$/;

	if (remainingItems === 0 || implementationPathRegex.test(pathname)) {
		return null;
	}

	const handleCheckedChange = (
		step: OnboardingStep,
		newCompletedState: boolean,
	) => {
		// Optimistic update
		setChecklistItems((prevItems) =>
			prevItems.map((item) =>
				item.dbColumn === step
					? { ...item, completed: newCompletedState }
					: item,
			),
		);
		setCompletedItems((prevCount) =>
			newCompletedState ? prevCount + 1 : prevCount - 1,
		);

		startTransition(async () => {
			try {
				const result = await markOnboardingStep({
					orgId,
					step,
					completed: newCompletedState,
				});
				if (!result.success) {
					throw new Error(result.error || "Failed to update step.");
				}
				// On successful action, refresh server data
				router.refresh();
			} catch (error) {
				console.error("Onboarding step update failed:", error);
				toast.error(
					`Error: ${error instanceof Error ? error.message : "Could not update step."}`,
				);
				// Revert optimistic update on error
				setChecklistItems(initialChecklistItems);
				setCompletedItems(initialCompletedItems);
			}
		});
	};

	return (
		<div
			className={cn(
				"fixed bottom-4 right-4 z-50 w-80 rounded-sm border bg-card p-4 text-card-foreground shadow-lg",
				className,
			)}
		>
			<div className="mb-3">
				<h4 className="mb-1 font-medium leading-none">
					Implementation Progress
				</h4>
				<div className="flex justify-between text-xs text-muted-foreground mb-2">
					<span>{completedItems} Completed</span>
					<span>{remainingItems} Remaining</span>
				</div>
				<Progress value={progressPercentage} className="h-1.5" />
			</div>

			<div className="mb-3 grid gap-2 max-h-40 overflow-y-auto">
				{checklistItems.map((item) => {
					const isWizard = item.type === "wizard";
					const href = isWizard
						? (item.wizardPath ?? "#")
						: (item.href ?? "#");
					return (
						<div
							key={item.dbColumn}
							className="group flex items-center gap-3"
						>
							<Checkbox
								id={`checklist-${item.dbColumn}`}
								checked={item.completed}
								onCheckedChange={(checked) => {
									if (isWizard) return; // Prevent marking wizard as done/undone
									handleCheckedChange(
										item.dbColumn as OnboardingStep,
										!!checked,
									);
								}}
								disabled={isPending || isWizard}
								aria-label={
									isWizard
										? `${item.title} (complete in wizard)`
										: `Mark ${item.title} as ${item.completed ? "incomplete" : "complete"}`
								}
								className="shrink-0"
							/>
							<Link
								href={href}
								className={cn(
									"flex-1 cursor-pointer text-sm font-medium hover:text-primary",
									item.completed &&
										"line-through text-muted-foreground hover:text-muted-foreground",
									isPending &&
										"opacity-50 cursor-not-allowed",
								)}
								tabIndex={isPending ? -1 : 0}
								aria-disabled={isPending}
							>
								{item.title}
							</Link>
						</div>
					);
				})}
			</div>

			<Link href={`/${orgId}/implementation`} passHref>
				<Button
					variant="secondary"
					size="sm"
					className="w-full"
					aria-disabled={isPending}
					disabled={isPending}
				>
					View All Steps
				</Button>
			</Link>
		</div>
	);
}
