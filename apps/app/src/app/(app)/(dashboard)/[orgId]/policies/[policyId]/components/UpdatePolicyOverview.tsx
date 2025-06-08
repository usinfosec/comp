"use client";

import type { Member, Policy, User } from "@comp/db/types";
import { Button } from "@comp/ui/button";
import { Loader2 } from "lucide-react";
import { usePolicyOverviewForm } from "../hooks/usePolicyOverviewForm";
import { PolicyOverviewHeader } from "./PolicyOverviewHeader";
import { SubmitApprovalDialog } from "./SubmitApprovalDialog";
import { PolicyFieldsGroup } from "./fields/PolicyFieldsGroup";

interface UpdatePolicyOverviewProps {
	policy: Policy & {
		approver: (Member & { user: User }) | null;
	};
	assignees: (Member & { user: User })[];
	isPendingApproval: boolean;
}

export function UpdatePolicyOverview({
	policy,
	assignees,
	isPendingApproval,
}: UpdatePolicyOverviewProps) {
	const {
		name,
		description,
		fields,
		isSubmitting,
		isApprovalDialogOpen,
		setIsApprovalDialogOpen,
		selectedApproverId,
		setSelectedApproverId,
		handleFieldsChange,
		handleNameChange,
		handleDescriptionChange,
		handleSubmit,
		handleConfirmApproval,
		buttonText,
		fieldsDisabled,
		hasFormChanges,
		updatePolicyForm,
		submitForApproval,
	} = usePolicyOverviewForm({ policy, assignees, isPendingApproval });

	return (
		<>
			<form id="policy-form" onSubmit={handleSubmit} className="space-y-6">
				<PolicyOverviewHeader
					policy={policy}
					name={name}
					description={description}
					onNameChange={handleNameChange}
					onDescriptionChange={handleDescriptionChange}
					fieldsDisabled={fieldsDisabled}
					isPendingApproval={isPendingApproval}
					dropdownOpen={false}
					setDropdownOpen={() => {}}
					setOpen={() => {}}
					setArchiveOpen={() => {}}
					setDeleteDialogOpen={() => {}}
				/>

				<PolicyFieldsGroup
					value={fields}
					assignees={assignees}
					onChange={handleFieldsChange}
					fieldsDisabled={fieldsDisabled}
				/>

				<div className="col-span-1 md:col-span-2 flex justify-end gap-2">
					{!isPendingApproval && (
						<Button
							type="submit"
							disabled={
								!hasFormChanges ||
								isSubmitting ||
								updatePolicyForm.isExecuting ||
								submitForApproval.isExecuting
							}
						>
							{(isSubmitting ||
								updatePolicyForm.isExecuting ||
								submitForApproval.isExecuting) && (
								<Loader2 className="animate-spin mr-2" />
							)}
							{buttonText}
						</Button>
					)}
				</div>
			</form>

			<SubmitApprovalDialog
				isOpen={isApprovalDialogOpen}
				onOpenChange={setIsApprovalDialogOpen}
				assignees={assignees}
				selectedApproverId={selectedApproverId}
				onSelectedApproverIdChange={setSelectedApproverId}
				onConfirm={handleConfirmApproval}
				isSubmitting={isSubmitting}
			/>
		</>
	);
}
