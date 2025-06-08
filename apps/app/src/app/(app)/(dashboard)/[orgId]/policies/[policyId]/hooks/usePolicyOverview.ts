import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { acceptRequestedPolicyChangesAction } from "@/actions/policies/accept-requested-policy-changes";
import { denyRequestedPolicyChangesAction } from "@/actions/policies/deny-requested-policy-changes";
import type { Policy } from "@comp/db/types";

export function usePolicyOverview(policy: Policy | null) {
  // Dialog state for approval/denial actions
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [denyDialogOpen, setDenyDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Dropdown menu state
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Deny action
  const denyPolicyChanges = useAction(denyRequestedPolicyChangesAction, {
    onSuccess: () => {
      toast.success("Policy changes denied.");
      window.location.reload();
    },
    onError: () => {
      toast.error("Failed to deny policy changes.");
    },
  });

  // Accept action
  const acceptPolicyChanges = useAction(acceptRequestedPolicyChangesAction, {
    onSuccess: () => {
      toast.success("Policy changes accepted and published!");
      window.location.reload();
    },
    onError: () => {
      toast.error("Failed to accept policy changes.");
    },
  });

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

  return {
    approveDialogOpen,
    setApproveDialogOpen,
    denyDialogOpen,
    setDenyDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    dropdownOpen,
    setDropdownOpen,
    handleApprove,
    handleDeny,
    acceptPolicyChanges,
    denyPolicyChanges,
  };
}

