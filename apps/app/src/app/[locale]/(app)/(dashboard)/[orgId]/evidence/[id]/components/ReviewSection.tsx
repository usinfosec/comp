"use client";

import { calculateNextReview } from "@/lib/utils/calculate-next-review";
import type {
	Frequency,
	Evidence,
	Member,
	User as UserType,
	Departments,
} from "@bubba/db/types";
import { Button } from "@bubba/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { format } from "date-fns";
import { Building, CalendarClock, RefreshCw, User, Save } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { publishEvidence } from "../actions/publishEvidence";
import { toggleRelevance } from "../actions/toggleRelevance";
import { updateEvidenceDetails } from "../actions/updateEvidenceDetails";
import { useEvidence } from "../hooks/useEvidence";
import { AssigneeSection } from "./AssigneeSection";
import { DepartmentSection } from "./DepartmentSection";
import { FrequencySection } from "./FrequencySection";
import { useState, useEffect } from "react";

interface ReviewSectionProps {
	evidence: Evidence;
	evidenceId: string;
	lastPublishedAt: Date | null;
	frequency: Frequency | null;
	department: string | null;
	currentAssigneeId: string | null | undefined;
	onSuccess: () => Promise<void>;
	id: string;
	assignees: (Member & {
		user: UserType;
	})[];
}

export function ReviewSection({
	evidenceId,
	lastPublishedAt,
	frequency: initialFrequency,
	department: initialDepartment,
	currentAssigneeId,
	onSuccess,
	id,
	evidence,
	assignees,
}: ReviewSectionProps) {
	const { mutate } = useEvidence({ id });
	const reviewInfo = calculateNextReview(lastPublishedAt, initialFrequency);

	// State for tracking form values
	const [frequency, setFrequency] = useState<Frequency | null>(
		initialFrequency,
	);
	const [department, setDepartment] = useState<Departments | null>(
		initialDepartment as Departments | null,
	);
	const [assigneeId, setAssigneeId] = useState<string | null>(
		currentAssigneeId || null,
	);
	const [hasChanges, setHasChanges] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	// Check for changes whenever form values change
	useEffect(() => {
		const hasFrequencyChanged = frequency !== initialFrequency;
		const hasDepartmentChanged =
			department !== (initialDepartment as Departments | null);
		const hasAssigneeChanged = assigneeId !== currentAssigneeId;

		setHasChanges(
			hasFrequencyChanged || hasDepartmentChanged || hasAssigneeChanged,
		);
	}, [
		frequency,
		department,
		assigneeId,
		initialFrequency,
		initialDepartment,
		currentAssigneeId,
	]);

	const { execute: toggleRelevanceAction, isExecuting: isTogglingRelevance } =
		useAction(toggleRelevance, {
			onSuccess: () => {
				toast.success("Evidence relevance updated successfully");
				mutate();
			},
			onError: () => {
				toast.error("Failed to update evidence relevance, please try again.");
			},
		});

	const { execute: publishAction, isExecuting: isPublishing } = useAction(
		publishEvidence,
		{
			onSuccess: () => {
				toast.success("Evidence published successfully");
				mutate();
			},
			onError: () => {
				toast.error("Failed to publish evidence, please try again.");
			},
		},
	);

	const { execute: updateDetailsAction } = useAction(updateEvidenceDetails, {
		onSuccess: async () => {
			toast.success("Evidence details updated successfully");
			setIsSaving(false);
			await onSuccess();
		},
		onError: () => {
			toast.error("Failed to update evidence details");
			setIsSaving(false);
		},
	});

	const handleSaveChanges = () => {
		setIsSaving(true);
		updateDetailsAction({
			id,
			frequency,
			department,
			assigneeId,
		});
	};

	const handleDepartmentChange = (value: string | null) => {
		setDepartment(value as Departments | null);
	};

	return (
		<Card className="overflow-hidden">
			<CardHeader>
				<CardTitle className="text-base flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div>
						<h2 className="text-lg font-medium">Evidence Overview</h2>
						<h3 className="text-sm text-muted-foreground">
							Manage review frequency, department assignment, and track upcoming
							review dates
						</h3>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() =>
							toggleRelevanceAction({
								id,
								isNotRelevant: !evidence.isNotRelevant,
							})
						}
						disabled={isTogglingRelevance}
						className="text-xs whitespace-nowrap"
					>
						{evidence.isNotRelevant
							? "Mark as relevant"
							: "Mark as not relevant"}
					</Button>
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4 pt-2">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-1.5">
							<Building className="h-3.5 w-3.5 text-muted-foreground" />
							<h3 className="text-xs font-medium text-muted-foreground">
								DEPARTMENT
							</h3>
						</div>
						<DepartmentSection
							evidenceId={evidenceId}
							currentDepartment={initialDepartment}
							onDepartmentChange={handleDepartmentChange}
							department={department as string | null}
							disabled={isSaving}
						/>
					</div>

					<div className="flex-1">
						<div className="flex items-center gap-2 mb-1.5">
							<RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
							<h3 className="text-xs font-medium text-muted-foreground">
								FREQUENCY
							</h3>
						</div>
						<FrequencySection
							onFrequencyChange={setFrequency}
							frequency={frequency}
							disabled={isSaving}
						/>
					</div>

					<div>
						<div className="flex items-center gap-2 mb-1.5">
							<CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
							<h3 className="text-xs font-medium text-muted-foreground">
								NEXT REVIEW
							</h3>
						</div>
						{!reviewInfo ? (
							<p className="text-red-500 font-medium text-sm">ASAP</p>
						) : (
							<div
								className={`text-sm font-medium ${reviewInfo.isUrgent ? "text-red-500" : ""}`}
							>
								{reviewInfo.daysUntil} days (
								{format(reviewInfo.nextReviewDate, "MM/dd/yyyy")})
							</div>
						)}
					</div>
					<div>
						<div className="flex items-center gap-2 mb-1.5">
							<User className="h-3.5 w-3.5 text-muted-foreground" />
							<h3 className="text-xs font-medium text-muted-foreground">
								ASSIGNEE
							</h3>
						</div>
						<AssigneeSection
							evidenceId={evidenceId}
							currentAssigneeId={currentAssigneeId}
							onAssigneeChange={setAssigneeId}
							assigneeId={assigneeId}
							assignees={assignees}
							disabled={isSaving}
						/>
					</div>
				</div>

				<div className="flex flex-col xs:flex-row gap-2 justify-end mt-2">
					<Button
						size="sm"
						onClick={handleSaveChanges}
						disabled={isSaving || !hasChanges}
						className="w-full xs:w-auto order-1 xs:order-none"
					>
						<Save className="h-4 w-4 mr-2" />
						Save Changes
					</Button>

					{!evidence.published && (
						<Button
							size="sm"
							variant="outline"
							className="w-full xs:w-auto"
							onClick={() => publishAction({ id })}
							disabled={isPublishing || isSaving}
						>
							{isPublishing ? "Publishing..." : "Publish"}
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
