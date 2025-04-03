"use client";

import { inviteMember } from "@/actions/organization/invite-member";
import { revokeInvitation } from "@/actions/organization/revoke-invitation";
import { useI18n } from "@/locales/client";
import type { Invitation } from "@comp/db/types";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@comp/ui/alert-dialog";
import { Button } from "@comp/ui/button";
import { formatDistance } from "date-fns";
import { Loader2, Mail, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PendingInvitationItemProps {
	invitation: Invitation;
}

export function PendingInvitationItem({
	invitation,
}: PendingInvitationItemProps) {
	const t = useI18n();
	const [isResending, setIsResending] = useState(false);
	const [isRevoking, setIsRevoking] = useState(false);

	const handleResendInvitation = async () => {
		setIsResending(true);
		try {
			const result = await inviteMember({
				email: invitation.email,
				role: invitation.role as "owner" | "admin" | "member" | "auditor",
			});

			if (result?.data?.success) {
				toast.success(
					`${t("settings.team.invitations.toast.resend_success_prefix")} ${invitation.email}`,
				);
			} else {
				toast.error(t("settings.team.invitations.toast.resend_error"));
			}
		} catch (error) {
			toast.error(t("settings.team.invitations.toast.resend_unexpected"));
		} finally {
			setIsResending(false);
		}
	};

	const handleRevokeInvitation = async () => {
		setIsRevoking(true);
		try {
			const result = await revokeInvitation({
				invitationId: invitation.id,
			});

			if (result?.data?.success) {
				toast.success(
					`${t("settings.team.invitations.toast.revoke_success_prefix")} ${invitation.email} ${t("settings.team.invitations.toast.revoke_success_suffix")}`,
				);
			} else {
				toast.error(t("settings.team.invitations.toast.revoke_error"));
			}
		} catch (error) {
			toast.error(t("settings.team.invitations.toast.revoke_unexpected"));
		} finally {
			setIsRevoking(false);
		}
	};

	// Format the role for display
	const role =
		typeof invitation.role === "string"
			? invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)
			: invitation.role;

	// Safety check - don't render if no email
	if (!invitation.email) return null;

	const timeAgo = formatDistance(new Date(invitation.expiresAt), new Date(), {
		addSuffix: true,
	});

	return (
		<div className="flex items-center justify-between p-4 border">
			<div className="flex items-center gap-4">
				<div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
					<Mail className="h-5 w-5 text-muted-foreground" />
				</div>
				<div>
					<div className="font-medium">{invitation.email}</div>
					<div className="text-sm text-muted-foreground">
						{t("settings.team.invitations.expires_in")} {timeAgo}
					</div>
				</div>
			</div>
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					onClick={handleResendInvitation}
					disabled={isResending}
				>
					{isResending ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							{t("settings.team.invitations.actions.sending")}
						</>
					) : (
						t("settings.team.invitations.actions.resend")
					)}
				</Button>

				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant="destructive" size="icon" disabled={isRevoking}>
							{isRevoking ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Trash2 className="h-4 w-4" />
							)}
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								{t("settings.team.invitations.actions.revoke_title")}
							</AlertDialogTitle>
							<AlertDialogDescription>
								{t(
									"settings.team.invitations.actions.revoke_description_prefix",
								)}{" "}
								{invitation.email}?{" "}
								{t(
									"settings.team.invitations.actions.revoke_description_suffix",
								)}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>
								{t("common.actions.cancel")}
							</AlertDialogCancel>
							<AlertDialogAction onClick={handleRevokeInvitation}>
								{t("settings.team.invitations.actions.revoke")}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	);
}
