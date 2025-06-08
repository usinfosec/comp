"use client";

import { authClient } from "@/utils/auth-client";
import type { Control, Member, Policy, User } from "@comp/db/types";
import { Card, CardContent, CardHeader } from "@comp/ui/card";
import { useQueryState } from "nuqs";
import { usePolicyOverview } from "../../hooks/usePolicyOverview";
import { PolicyArchiveSheet } from "./PolicyArchiveSheet";
import { PolicyControlMappings } from "./PolicyControlMappings";
import { PolicyPendingApprovalAlert } from "./PolicyPendingApprovalAlert";
import { PolicyStatusAlerts } from "./PolicyStatusAlerts";
import { UpdatePolicyOverview } from "../UpdatePolicyOverview/UpdatePolicyOverview";
import { PolicyActionDialogs } from "../Dialogs/PolicyActionDialogs";

export function PolicyOverview({
	policy,
	assignees,
	mappedControls,
	allControls,
	isPendingApproval,
}: {
	policy: Policy & { approver: (Member & { user: User }) | null };
	assignees: (Member & { user: User })[];
	mappedControls: Control[];
	allControls: Control[];
	isPendingApproval: boolean;
}) {
	const { data: activeMember } = authClient.useActiveMember();
	const [, setArchiveOpen] = useQueryState("archive-policy-sheet");
	const canCurrentUserApprove = policy?.approverId === activeMember?.id;

	const {
		approveDialogOpen,
		setApproveDialogOpen,
		denyDialogOpen,
		setDenyDialogOpen,
		deleteDialogOpen,
		setDeleteDialogOpen,
		handleApprove,
		handleDeny,
	} = usePolicyOverview(policy);

	return (
		<div className="space-y-4">
			<PolicyPendingApprovalAlert
				policy={policy}
				isPendingApproval={isPendingApproval}
				canCurrentUserApprove={canCurrentUserApprove}
				activeMemberId={activeMember?.id}
				setApproveDialogOpen={setApproveDialogOpen}
				setDenyDialogOpen={setDenyDialogOpen}
			/>
			<PolicyStatusAlerts policy={policy} setArchiveOpen={setArchiveOpen} />

			<Card>
				<CardContent className="py-4">
					<UpdatePolicyOverview
						isPendingApproval={isPendingApproval}
						policy={policy}
						assignees={assignees}
					/>
				</CardContent>
			</Card>

			<PolicyControlMappings
				mappedControls={mappedControls}
				allControls={allControls}
				isPendingApproval={isPendingApproval}
			/>

			<PolicyArchiveSheet policy={policy} />
			<PolicyActionDialogs
				policy={policy}
				approveDialogOpen={approveDialogOpen}
				setApproveDialogOpen={setApproveDialogOpen}
				handleApprove={handleApprove}
				denyDialogOpen={denyDialogOpen}
				setDenyDialogOpen={setDenyDialogOpen}
				handleDeny={handleDeny}
				deleteDialogOpen={deleteDialogOpen}
				setDeleteDialogOpen={setDeleteDialogOpen}
			/>
		</div>
	);
}
