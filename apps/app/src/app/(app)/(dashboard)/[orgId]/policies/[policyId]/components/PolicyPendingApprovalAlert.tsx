import { ShieldCheck, ShieldX } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@comp/ui/alert";
import { Button } from "@comp/ui/button";
import type { Policy, Member, User } from "@comp/db/types";

interface PolicyPendingApprovalAlertProps {
	policy: Policy & { approver: (Member & { user: User }) | null };
	isPendingApproval: boolean;
	canCurrentUserApprove: boolean;
	activeMemberId: string | undefined;
	setApproveDialogOpen: (open: boolean) => void;
	setDenyDialogOpen: (open: boolean) => void;
}

export function PolicyPendingApprovalAlert({
	policy,
	isPendingApproval,
	canCurrentUserApprove,
	activeMemberId,
	setApproveDialogOpen,
	setDenyDialogOpen,
}: PolicyPendingApprovalAlertProps) {
	if (!isPendingApproval) return null;

	return (
		<Alert variant="default">
			<ShieldX className="h-4 w-4" />
			<AlertTitle>
				{canCurrentUserApprove ? "Action Required by You" : "Pending Approval"}
			</AlertTitle>
			<AlertDescription className="flex flex-col gap-2">
				<div>
					This policy is awaiting approval from{" "}
					<span className="font-semibold">
						{policy.approverId === activeMemberId
							? "you"
							: `${policy?.approver?.user?.name} (${policy?.approver?.user?.email})`}
					</span>
					.
				</div>
				{canCurrentUserApprove &&
					" Please review the details and either approve or reject the changes."}
				{!canCurrentUserApprove &&
					" All fields are disabled until the policy is actioned."}
				{isPendingApproval && policy.approverId && canCurrentUserApprove && (
					<div className="flex gap-2 items-center">
						<Button variant="outline" onClick={() => setDenyDialogOpen(true)}>
							<ShieldX className="h-4 w-4" />
							Reject Changes
						</Button>
						<Button onClick={() => setApproveDialogOpen(true)}>
							<ShieldCheck className="h-4 w-4" />
							Approve
						</Button>
					</div>
				)}
			</AlertDescription>
		</Alert>
	);
}
