"use client";

import { Progress } from "@comp/ui/progress";
import { cn } from "@comp/ui/cn";
import Link from "next/link";
import { Button } from "@comp/ui/button";
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from "@comp/ui/collapsible";
import { ChevronDown } from "lucide-react";
import type {
	ChecklistItemProps,
	OnboardingStep,
} from "@/app/[locale]/(app)/(dashboard)/[orgId]/implementation/types";
import { usePathname, useRouter } from "next/navigation";
import { Checkbox } from "@comp/ui/checkbox";
import { markOnboardingStep } from "@/app/[locale]/(app)/(dashboard)/[orgId]/implementation/actions";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { updateFloatingState } from "@/actions/floating";
import { onboardingSteps } from "@/app/[locale]/(app)/(dashboard)/[orgId]/implementation/types";

interface FloatingOnboardingChecklistProps {
	orgId: string;
	completedItems: number;
	totalItems: number;
	checklistItems: ChecklistItemProps[];
	className?: string;
	floatingOpen: boolean;
}

export function FloatingOnboardingChecklist({
	orgId,
	completedItems: initialCompletedItems,
	totalItems,
	checklistItems: initialChecklistItems,
	floatingOpen,
	className,
}: FloatingOnboardingChecklistProps) {
	const [open, setOpen] = useState(floatingOpen);
	const pathname = usePathname();
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	// Local state for optimistic updates
	const [checklistItems, setChecklistItems] = useState(initialChecklistItems);
	const [completedItems, setCompletedItems] = useState(initialCompletedItems);

	const { execute } = useAction(updateFloatingState, {
		onSuccess: () => {
			router.refresh();
		},
	});

	const incompleteItems = checklistItems.filter((item) => !item.completed);
	const remainingItems = totalItems - completedItems;
	const progressPercentage = (completedItems / totalItems) * 100;

	const implementationPathRegex = /\/[^/]+\/implementation(\/.*)?$/;

	if (remainingItems === 0 || implementationPathRegex.test(pathname)) {
		return null;
	}

	const toggleFloating = () => {
		setOpen(!open);
		execute({ floatingOpen: !open });
	};

	const handleCheckedChange = (
		step: OnboardingStep | undefined,
		newCompletedState: boolean,
	) => {
		// Validate that step is defined and is a valid OnboardingStep
		if (!step || !onboardingSteps.includes(step as any)) {
			console.error("Cannot update undefined or invalid step:", step);
			toast.error("Could not update step: Invalid step");
			return;
		}

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
		<Collapsible open={open} onOpenChange={toggleFloating}>
			<div
				className={cn(
					"bottom-4 right-4 z-50 w-80 rounded-sm border bg-card text-card-foreground shadow-lg relative",
					className,
				)}
				style={{ position: "fixed" }}
			>
				{/* Chevron at true top right, outside padding */}
				<CollapsibleTrigger asChild>
					<span
						role="button"
						tabIndex={0}
						aria-label={
							open ? "Minimize checklist" : "Expand checklist"
						}
						className="absolute top-1 right-1 m-1 z-10 cursor-pointer outline-none rounded hover:bg-muted focus:bg-muted transition-colors"
						style={{
							padding: 2,
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								setOpen(!open);
							}
						}}
					>
						<ChevronDown
							className={`size-5 transition-transform ${open ? "" : "-rotate-180"}`}
						/>
					</span>
				</CollapsibleTrigger>
				{/* Padded card content below */}
				<div className="p-4">
					<h4 className="mb-1 font-medium leading-none">
						Implementation Progress
					</h4>
					<div className="flex justify-between text-xs text-muted-foreground mb-2">
						<span>{completedItems} Completed</span>
						<span>{remainingItems} Remaining</span>
					</div>
					<Progress value={progressPercentage} className="h-1.5" />
				</div>
				<CollapsibleContent className="p-4">
					<div className="mb-3 grid gap-2 max-h-40 overflow-y-auto">
						{checklistItems.map((item, index) => {
							const isWizard = item.type === "wizard";
							const isCalendar = item.type === "calendar";
							const href = isWizard
								? (item.wizardPath ?? "#")
								: isCalendar
									? (item.calendarPath ?? item.href ?? "#")
									: (item.href ?? "#");
							// Generate a unique key using index as fallback if dbColumn is undefined
							const itemKey = item.dbColumn
								? `checklist-${item.dbColumn}`
								: `checklist-item-${index}`;
							return (
								<div
									key={itemKey}
									className="group flex items-center gap-3"
								>
									<Checkbox
										id={itemKey}
										checked={item.completed}
										onCheckedChange={(checked) => {
											if (isWizard) return; // Prevent marking wizard as done/undone

											// For calendar items, use "callBooked" as the step if dbColumn is undefined
											if (isCalendar && !item.dbColumn) {
												handleCheckedChange(
													"callBooked" as OnboardingStep,
													!!checked,
												);
												return;
											}

											// For other items, only try to update if dbColumn is defined
											if (item.dbColumn) {
												handleCheckedChange(
													item.dbColumn as OnboardingStep,
													!!checked,
												);
											}
										}}
										disabled={
											isPending ||
											isWizard ||
											(!item.dbColumn &&
												item.type !== "calendar")
										}
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
				</CollapsibleContent>
			</div>
		</Collapsible>
	);
}
