"use client";

import { Mail, Search, UserPlus, X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

import { useI18n } from "@/locales/client";
import { authClient } from "@/utils/auth-client";
import { Button } from "@comp/ui/button";
import { Card, CardContent } from "@comp/ui/card";
import { Input } from "@comp/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@comp/ui/select";
import { Separator } from "@comp/ui/separator";
import type { Invitation, Role } from "@prisma/client";

import { MemberRow } from "./MemberRow";
import { PendingInvitationRow } from "./PendingInvitationRow";
import type { MemberWithUser, TeamMembersData } from "./TeamMembers";

// Import the server actions themselves to get their types
import { removeMember } from "@/actions/organization/remove-member";
import { revokeInvitation } from "@/actions/organization/revoke-invitation";
import { updateMemberRole } from "@/actions/organization/update-member-role";
import { invalidateMembers } from "./invalidateMembers";

// Define prop types using typeof for the actions
interface TeamMembersClientProps {
	data: TeamMembersData;
	organizationId: string; // Add organizationId prop
	removeMemberAction: typeof removeMember;
	updateMemberRoleAction: typeof updateMemberRole;
	revokeInvitationAction: typeof revokeInvitation;
}

// Define a simplified type for merged list items
interface DisplayItem extends Partial<MemberWithUser>, Partial<Invitation> {
	type: "member" | "invitation";
	displayName: string;
	displayEmail: string;
	displayRole: string; // Simplified role display
	displayStatus: "active" | "pending";
	displayId: string; // Use member.id or invitation.id
}

export function TeamMembersClient({
	data,
	organizationId,
	removeMemberAction,
	updateMemberRoleAction,
	revokeInvitationAction,
}: TeamMembersClientProps) {
	const t = useI18n();
	const [searchQuery, setSearchQuery] = useState("");
	const [inviteEmail, setInviteEmail] = useState("");
	const [inviteRole, setInviteRole] = useState<Role>("auditor");
	const [showInviteForm, setShowInviteForm] = useState(false);
	const [isInviting, setIsInviting] = useState(false);

	// Combine and type members and invitations for filtering/display
	const allItems: DisplayItem[] = [
		...data.members.map((member) => ({
			...member,
			type: "member" as const,
			displayName: member.user.name || member.user.email || "",
			displayEmail: member.user.email || "",
			displayRole: member.role, // Use Prisma role
			displayStatus: "active" as const,
			displayId: member.id,
		})),
		...data.pendingInvitations.map((invitation) => ({
			...invitation,
			type: "invitation" as const,
			displayName: invitation.email.split("@")[0], // Or just email
			displayEmail: invitation.email,
			displayRole: invitation.role, // Use Prisma role
			displayStatus: "pending" as const,
			displayId: invitation.id,
		})),
	];

	const filteredItems = allItems.filter(
		(item) =>
			item.displayName
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			item.displayEmail.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const activeMembers = filteredItems.filter(
		(item) => item.type === "member",
	);
	const pendingInvites = filteredItems.filter(
		(item) => item.type === "invitation",
	);

	const handleInvite = async (e: React.FormEvent) => {
		e.preventDefault();
		if (inviteEmail && inviteRole && !isInviting) {
			setIsInviting(true);
			try {
				await authClient.organization.inviteMember({
					email: inviteEmail,
					role: inviteRole,
				});

				await invalidateMembers({ organizationId });

				toast.success(t("settings.team.invite.toast.success"), {});
				setInviteEmail("");
			} catch (error) {
				console.error("Invite Error:", error);
				const errorMessage =
					error instanceof Error
						? error.message
						: t("settings.team.invite.toast.failure");
				toast.error(errorMessage, {});
			} finally {
				setIsInviting(false);
			}
		}
	};

	const handleCancelInvitation = async (invitationId: string) => {
		const result = await revokeInvitationAction({ invitationId });
		if (result?.data) {
			// Success case
			// toast.success(t("settings.team.pending.toast.cancel_success"), {}); // Removed toast
			// Data revalidates server-side via action's revalidatePath
		} else {
			// Error case
			const errorMessage =
				result?.serverError ||
				t("settings.team.pending.toast.cancel_failure");
			console.error("Cancel Invitation Error:", errorMessage);
		}
	};

	const handleRemoveMember = async (memberId: string) => {
		const result = await removeMemberAction({ memberId });
		if (result?.data) {
			// Success case
			// toast.success(t("settings.team.member_actions.toast.remove_success"), {}); // Removed toast
			// Data revalidates server-side via action's revalidatePath
		} else {
			// Error case
			const errorMessage =
				result?.serverError ||
				t("settings.team.member_actions.toast.remove_error");
			console.error("Remove Member Error:", errorMessage);
		}
	};

	const handleUpdateRole = async (memberId: string, role: Role) => {
		const result = await updateMemberRoleAction({ memberId, role });
		if (result?.data) {
			// Success case
			// toast.success(t("settings.team.member_actions.toast.update_role_success"),{}); // Removed toast
			// Data revalidates server-side via action's revalidatePath
		} else {
			// Error case
			const errorMessage =
				result?.serverError ||
				t("settings.team.member_actions.toast.update_role_error");
			console.error("Update Role Error:", errorMessage);
		}
	};

	return (
		<div className="">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">
					{t("settings.team.title")}
				</h1>
				<Button onClick={() => setShowInviteForm(!showInviteForm)}>
					<UserPlus className="mr-2 h-4 w-4" />
					{t("settings.team.invite.button.send")}
				</Button>
			</div>
			<Card className="border shadow-sm">
				<CardContent className="p-0">
					<div className="p-4 border-b">
						<div className="relative">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder={t(
									"settings.team.search.placeholder",
								)}
								className="pl-8"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
							{searchQuery && (
								<Button
									variant="ghost"
									size="sm"
									className="absolute right-1 top-1 h-7 w-7 p-0"
									onClick={() => setSearchQuery("")}
								>
									<X className="h-4 w-4" />
									<span className="sr-only">
										{t("common.actions.clear")}
									</span>
								</Button>
							)}
						</div>
					</div>

					{showInviteForm && (
						<div className="p-4 bg-muted/30 border-b">
							<form
								onSubmit={handleInvite}
								className="flex flex-col sm:flex-row gap-3"
							>
								<Input
									placeholder={t(
										"settings.team.invite.form.email.placeholder",
									)}
									type="email"
									value={inviteEmail}
									onChange={(e) =>
										setInviteEmail(e.target.value)
									}
									required
									className="flex-1"
								/>
								<Select
									value={inviteRole}
									onValueChange={(value) =>
										setInviteRole(value as Role)
									}
								>
									<SelectTrigger className="w-full sm:w-[140px]">
										<SelectValue
											placeholder={t(
												"settings.team.invite.form.role.placeholder",
											)}
										/>
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="admin">
											{t(
												"settings.team.members.role.admin",
											)}
										</SelectItem>
										<SelectItem value="auditor">
											{t(
												"settings.team.members.role.auditor",
											)}
										</SelectItem>
										<SelectItem value="employee">
											{t(
												"settings.team.members.role.employee",
											)}
										</SelectItem>
									</SelectContent>
								</Select>
								<Button
									type="submit"
									className="w-full sm:w-auto"
									disabled={isInviting}
								>
									{isInviting
										? t(
												"settings.team.invite.button.sending",
											)
										: t("settings.team.invite.button.send")}
								</Button>
							</form>
						</div>
					)}

					<div className="divide-y">
						{activeMembers.map((member) => (
							<MemberRow
								key={member.displayId}
								member={member as MemberWithUser}
								onRemove={handleRemoveMember}
								onUpdateRole={handleUpdateRole}
							/>
						))}
					</div>

					{pendingInvites.length > 0 && (
						<>
							<Separator />
							<div className="p-3 bg-muted/20">
								<h3 className="text-sm font-medium text-muted-foreground px-3 mb-2">
									{t("settings.team.invitations.title")}
								</h3>
								<div className="divide-y divide-dashed">
									{pendingInvites.map((invitation) => (
										<PendingInvitationRow
											key={invitation.displayId}
											invitation={
												invitation as Invitation
											}
											onCancel={handleCancelInvitation}
										/>
									))}
								</div>
							</div>
						</>
					)}

					{activeMembers.length === 0 &&
						pendingInvites.length === 0 && (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<Mail className="h-12 w-12 text-muted-foreground/30" />
								<h3 className="mt-4 text-lg font-medium">
									{t("settings.team.empty.title")}
								</h3>
								<p className="mt-2 text-sm text-muted-foreground max-w-xs">
									{t("settings.team.empty.description")}
								</p>
								<Button
									className="mt-4"
									onClick={() => setShowInviteForm(true)}
								>
									<UserPlus className="mr-2 h-4 w-4" />
									{t("settings.team.invite.button.send")}
								</Button>
							</div>
						)}
				</CardContent>
			</Card>
		</div>
	);
}
