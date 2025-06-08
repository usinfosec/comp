"use client";
import { ShieldCheck, ShieldX } from "lucide-react";
import { PolicyActionDialog } from "./PolicyActionDialog";
import { PolicyDeleteDialog } from "./PolicyDeleteDialog";
import type { Policy, Member, User } from "@comp/db/types";
import React from "react";

interface PolicyActionDialogsProps {
  policy: (Policy & { approver: (Member & { user: User }) | null }) | null;
  approveDialogOpen: boolean;
  setApproveDialogOpen: (open: boolean) => void;
  handleApprove: () => void;
  denyDialogOpen: boolean;
  setDenyDialogOpen: (open: boolean) => void;
  handleDeny: () => void;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
}

export function PolicyActionDialogs({
  policy,
  approveDialogOpen,
  setApproveDialogOpen,
  handleApprove,
  denyDialogOpen,
  setDenyDialogOpen,
  handleDeny,
  deleteDialogOpen,
  setDeleteDialogOpen,
}: PolicyActionDialogsProps) {
  if (!policy) return null;
  return (
    <>
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

      {/* Delete Dialog */}
      <PolicyDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        policy={policy}
      />
    </>
  );
}
