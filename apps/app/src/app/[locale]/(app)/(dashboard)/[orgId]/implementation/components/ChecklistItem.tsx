"use client";

import { Button } from "@comp/ui/button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@comp/ui/card";
import { Separator } from "@comp/ui/separator";
import { ArrowRight, CheckCheck, Circle, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { updateOnboardingItem } from "../actions/update-onboarding-item";
import type { ChecklistItemProps } from "../types/ChecklistProps.types";
import Link from "next/link";

export function ChecklistItem({
	title,
	description,
	href,
	docs,
	dbColumn,
	completed,
	buttonLabel,
	icon,
	type,
	wizardPath,
}: ChecklistItemProps) {
	const { orgId } = useParams<{ orgId: string }>();
	const linkWithOrgReplaced = href
		? href.replace(":organizationId", orgId)
		: undefined;
	const [isUpdating, setIsUpdating] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);
	const router = useRouter();

	const handleMarkAsDone = async () => {
		if (!dbColumn) return;
		try {
			setIsUpdating(true);
			setIsAnimating(true);

			const result = await updateOnboardingItem(orgId, dbColumn, true);

			if (!result.success) {
				throw new Error(result.error);
			}

			setTimeout(() => setIsAnimating(false), 600);
			router.push(linkWithOrgReplaced ?? "/");
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to update status",
			);
		} finally {
			setIsUpdating(false);
		}
	};

	const handleWizardRedirect = () => {
		if (wizardPath) {
			router.push(wizardPath.replace(":organizationId", orgId));
		}
	};

	return (
		<Card>
			<div>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 w-full">
						{completed && (
							<CheckCheck className="h-5 w-5 text-primary" />
						)}
						{!completed && <Circle className="h-5 w-5" />}
						<span className={completed ? "line-through" : ""}>
							{title}
						</span>
						{completed && (
							<Button
								className="ml-auto"
								variant="outline"
								onClick={() => {
									if (type === "wizard") {
										handleWizardRedirect();
									} else {
										handleMarkAsDone();
									}
								}}
							>
								View again <ArrowRight className="h-4 w-4" />
							</Button>
						)}
						{/* {completed && (
							<Badge variant="marketing">Completed</Badge>
						)} */}
					</CardTitle>
					{description && !completed && (
						<CardDescription className="text-sm text-muted-foreground flex flex-col gap-4">
							{description}
						</CardDescription>
					)}
				</CardHeader>
				{!completed && <Separator className="my-6" />}
				{!completed && (
					<CardFooter className="justify-end">
						{type === "wizard" ? (
							<Button
								variant={"secondary"}
								className="w-full sm:w-fit"
								onClick={handleWizardRedirect}
								disabled={isUpdating}
							>
								{buttonLabel}
								<ArrowRight className="ml-1 h-4 w-4" />
							</Button>
						) : (
							<Button
								variant={"secondary"}
								className="w-full sm:w-fit"
								onClick={handleMarkAsDone}
								disabled={isUpdating || !dbColumn}
							>
								{completed ? (
									"Completed"
								) : isUpdating ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									</>
								) : (
									<>
										{buttonLabel}
										<ArrowRight className="ml-1 h-4 w-4" />
									</>
								)}
							</Button>
						)}
					</CardFooter>
				)}
			</div>
		</Card>
	);
}
