"use client";

import { useI18n } from "@/locales/client";
import { authClient } from "@/utils/auth-client";
import type { Member, Policy, User } from "@comp/db/types";
import { Control } from "@comp/db/types";
import { Alert, AlertDescription, AlertTitle } from "@comp/ui/alert";
import { Button } from "@comp/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { Icons } from "@comp/ui/icons";
import { format } from "date-fns";
import {
	ArchiveIcon,
	ArchiveRestoreIcon,
	PencilIcon,
	ShieldCheck,
	ShieldX,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { PolicyActionDialog } from "./PolicyActionDialog";
import { PolicyArchiveSheet } from "./PolicyArchiveSheet";
import { PolicyControlMappings } from "./PolicyControlMappings";
import { PolicyOverviewSheet } from "./PolicyOverviewSheet";
import { UpdatePolicyOverview } from "./UpdatePolicyOverview";
import { useAction } from "next-safe-action/hooks";
import { denyRequestedPolicyChangesAction } from "@/actions/policies/deny-requested-policy-changes";
import { toast } from "sonner";
import { acceptRequestedPolicyChangesAction } from "@/actions/policies/accept-requested-policy-changes";

export function PolicyOverview({
	policy,
	assignees,
	mappedControls,
	allControls,
	isPendingApproval,
}: {
	policy: (Policy & { approver: (Member & { user: User }) | null }) | null;
	assignees: (Member & { user: User })[];
	mappedControls: Control[];
	allControls: Control[];
	isPendingApproval: boolean;
}) {
	const t = useI18n();
	const { data: activeMember } = authClient.useActiveMember();
	const [, setOpen] = useQueryState("policy-overview-sheet");
	const [, setArchiveOpen] = useQueryState("archive-policy-sheet");
	const canCurrentUserApprove = policy?.approverId === activeMember?.id;

	const denyPolicyChanges = useAction(denyRequestedPolicyChangesAction, {
		onSuccess: () => {
			toast.info("Policy changes denied!");
		},
		onError: () => {
			toast.error("Failed to deny policy changes.");
		},
	});

	const acceptPolicyChanges = useAction(acceptRequestedPolicyChangesAction, {
		onSuccess: () => {
			toast.info("Policy changes accepted!");
		},
		onError: () => {
			toast.error("Failed to accept policy changes.");
		},
	});

	// Dialog state for approval/denial actions
	const [approveDialogOpen, setApproveDialogOpen] = useState(false);
	const [denyDialogOpen, setDenyDialogOpen] = useState(false);

	// Handle approve with optional comment
	const handleApprove = (comment?: string) => {
		if (policy?.id && policy.approverId) {
			acceptPolicyChanges.execute({
				id: policy.id,
				approverId: policy.approverId,
				comment,
				entityId: policy.id,
			});
		}
	};

	// Handle deny with optional comment
	const handleDeny = (comment?: string) => {
		if (policy?.id && policy.approverId) {
			denyPolicyChanges.execute({
				id: policy.id,
				approverId: policy.approverId,
				comment,
				entityId: policy.id,
			});
		}
	};

	if (!policy) {
		return null;
	}

	return (
		<div className="space-y-4">
			{isPendingApproval && (
				<Alert className="border-red-500 bg-red-50 rounded-sm">
					<ShieldX className="h-4 w-4" />
					<AlertTitle>
						{canCurrentUserApprove
							? "Action Required by You"
							: "Pending Approval"}
					</AlertTitle>
					<AlertDescription className="flex flex-col gap-2">
						<div>
							This policy is awaiting approval from{" "}
							<span className="font-semibold">
								{policy.approverId === activeMember?.id
									? "You"
									: `${policy?.approver?.user?.name} (${policy?.approver?.user?.email})`}
							</span>
							.
						</div>
						{canCurrentUserApprove &&
							" Please review the details and approve or deny."}
						{!canCurrentUserApprove &&
							" All fields are disabled until the policy is actioned."}
						{isPendingApproval &&
							policy.approverId &&
							canCurrentUserApprove && (
								<div className="flex gap-2">
									<Button
										variant="outline"
										onClick={() => setDenyDialogOpen(true)}
									>
										<ShieldX className="mr-2 h-4 w-4" />
										Deny
									</Button>
									<Button
										onClick={() =>
											setApproveDialogOpen(true)
										}
									>
										<ShieldCheck className="mr-2 h-4 w-4" />
										Approve
									</Button>
								</div>
							)}
					</AlertDescription>
				</Alert>
			)}
			{policy?.isArchived && (
				<Alert>
					<div className="flex items-center gap-2">
						<ArchiveIcon className="h-4 w-4" />
						<div className="font-medium">
							{t("policies.archive.status")}
						</div>
					</div>
					<AlertDescription className="mt-1 mb-3 text-sm text-muted-foreground">
						{policy?.isArchived && (
							<>
								{t("policies.archive.archived_on")}{" "}
								{format(
									new Date(policy?.updatedAt ?? new Date()),
									"PPP",
								)}
							</>
						)}
					</AlertDescription>
					<Button
						size="sm"
						variant="outline"
						className="h-8 gap-1 mt-1 text-foreground border-border"
						onClick={() => setArchiveOpen("true")}
					>
						<ArchiveRestoreIcon className="h-3 w-3" />
						{t("policies.archive.restore_confirm")}
					</Button>
				</Alert>
			)}

			<Card>
				<CardHeader className="pb-1">
					<CardTitle>
						<div className="flex items-center justify-between gap-2">
							<div className="flex flex-row gap-2">
								<Icons.Policies className="h-4 w-4" />
								{policy?.name}
							</div>
							<div className="flex gap-2">
								<Button
									size="icon"
									variant="ghost"
									disabled={isPendingApproval}
									className="m-0 p-2 size-auto"
									onClick={() => setArchiveOpen("true")}
									title={
										policy?.isArchived
											? t(
													"policies.archive.restore_tooltip",
												)
											: t("policies.archive.tooltip")
									}
								>
									{policy?.isArchived ? (
										<ArchiveRestoreIcon className="h-4 w-4" />
									) : (
										<ArchiveIcon className="h-4 w-4" />
									)}
								</Button>
								<Button
									size="icon"
									variant="ghost"
									disabled={isPendingApproval}
									className="p-2 m-0 size-auto"
									onClick={() => setOpen("true")}
									title={t("policies.edit.tooltip")}
								>
									<PencilIcon className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-4 text-md">
						{policy?.description}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>
						<div className="flex items-center justify-between gap-2">
							{t("policies.overview.title")}
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent>
					{policy && (
						<UpdatePolicyOverview
							isPendingApproval={isPendingApproval}
							policy={policy}
							assignees={assignees}
						/>
					)}
				</CardContent>
			</Card>

			<PolicyControlMappings
				mappedControls={mappedControls}
				allControls={allControls}
				isPendingApproval={isPendingApproval}
			/>

			{policy && (
				<>
					<PolicyOverviewSheet policy={policy} />
					<PolicyArchiveSheet policy={policy} />

					{/* Approval Dialog */}
					<PolicyActionDialog
						isOpen={approveDialogOpen}
						onClose={() => setApproveDialogOpen(false)}
						onConfirm={handleApprove}
						title="Approve Policy Changes"
						description="Are you sure you want to approve these policy changes? You can optionally add a comment that will be visible in the policy history."
						confirmText="Approve"
						confirmIcon={<ShieldCheck className="h-4 w-4" />}
					/>

					{/* Denial Dialog */}
					<PolicyActionDialog
						isOpen={denyDialogOpen}
						onClose={() => setDenyDialogOpen(false)}
						onConfirm={handleDeny}
						title="Deny Policy Changes"
						description="Are you sure you want to deny these policy changes? You can optionally add a comment explaining your decision that will be visible in the policy history."
						confirmText="Deny"
						confirmIcon={<ShieldX className="h-4 w-4" />}
						confirmVariant="destructive"
					/>
				</>
			)}
		</div>
	);
}
