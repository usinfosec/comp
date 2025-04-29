'use client';

import { Progress } from "@comp/ui/progress";
import { cn } from "@comp/ui/cn";
import Link from "next/link";
import { Button } from "@comp/ui/button";
import type { ChecklistItemProps } from "@/app/[locale]/(app)/(dashboard)/[orgId]/implementation/types";
import { Circle } from "lucide-react";
import { usePathname } from "next/navigation";

interface FloatingOnboardingChecklistProps {
	orgId: string;
	completedItems: number;
	totalItems: number;
	checklistItems: ChecklistItemProps[];
	className?: string;
}

export function FloatingOnboardingChecklist({
	orgId,
	completedItems,
	totalItems,
	checklistItems,
	className,
}: FloatingOnboardingChecklistProps) {
	const progressPercentage = (completedItems / totalItems) * 100;
	const remainingItems = totalItems - completedItems;
	const incompleteItems = checklistItems.filter((item) => !item.completed);
	const pathname = usePathname();

	const implementationPathRegex = /\/[^/]+\/implementation$/;

	if (remainingItems === 0 || implementationPathRegex.test(pathname)) {
		return null;
	}

	return (
		<div
			className={cn(
				"fixed bottom-4 right-4 z-50 w-80 rounded-sm border bg-card p-4 text-card-foreground shadow-lg",
				className,
			)}
		>
			<div className="mb-3">
				<h4 className="mb-1 font-medium leading-none">Implementation Progress</h4>
				<div className="flex justify-between text-xs text-muted-foreground mb-2">
					<span>{completedItems} Completed</span>
					<span>{remainingItems} Remaining</span>
				</div>
				<Progress value={progressPercentage} className="h-1.5" />
			</div>

			<div className="mb-3 grid gap-3 max-h-40 overflow-y-auto">
				{incompleteItems.map((item) => (
					<Link
						href={item.href}
						key={item.dbColumn}
						className="group flex items-center gap-2 text-sm hover:text-primary"
					>
						<Circle className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
						<span className="font-medium">{item.title}</span>
					</Link>
				))}
			</div>

			<Link href={`/${orgId}/implementation`} passHref>
				<Button
					variant="secondary"
					size="sm"
					className="w-full"
				>
					View All Steps
				</Button>
			</Link>
		</div>
	);
} 