"use client";

import { Mail, Search, UserPlus, X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { parseAsString, useQueryState } from "nuqs";

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
import { bulkInviteMembers } from "../actions/bulkInviteMembers";
import { removeMember } from "../actions/removeMember";
import { revokeInvitation } from "../actions/revokeInvitation";
import { updateMemberRole } from "../actions/updateMemberRole";
import { invalidateMembers } from "../actions/invalidateMembers";

import { InviteMembersModal } from "./InviteMembersModal";

// Define prop types using typeof for the actions
interface TeamMembersClientProps {
	data: TeamMembersData;
	organizationId: string;
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
	const [searchQuery, setSearchQuery] = useQueryState(
		"search",
		parseAsString.withDefault(""),
	);
	const [roleFilter, setRoleFilter] = useQueryState(
		"role",
		parseAsString.withDefault("all"),
	);

	// Add state for the modal
	const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

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

	const filteredItems = allItems.filter((item) => {
		const matchesSearch =
			item.displayName
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			item.displayEmail.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesRole =
			roleFilter === "all" ||
			(item.type === "member" && item.role === roleFilter) ||
			(item.type === "invitation" && item.role === roleFilter);

		return matchesSearch && matchesRole;
	});

	const activeMembers = filteredItems.filter(
		(item) => item.type === "member",
	);
	const pendingInvites = filteredItems.filter(
		(item) => item.type === "invitation",
	);

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
				t("settings.team.invitations.toast.cancel_failure");
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
			{/* Render the Invite Modal */}
			<InviteMembersModal
				open={isInviteModalOpen}
				onOpenChange={setIsInviteModalOpen}
				organizationId={organizationId}
			/>

			<div className="flex items-center justify-between mb-6 gap-4">
				<div className="relative flex-1">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder={t("settings.team.search.placeholder")}
						className="pl-8"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value || null)}
					/>
					{searchQuery && (
						<Button
							variant="ghost"
							size="sm"
							className="absolute right-1 top-1 h-7 w-7 p-0"
							onClick={() => setSearchQuery(null)}
						>
							<X className="h-4 w-4" />
							<span className="sr-only">
								{t("common.actions.clear")}
							</span>
						</Button>
					)}
				</div>
				<Select
					value={roleFilter}
					onValueChange={(value) =>
						setRoleFilter(value === "all" ? null : value)
					}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue
							placeholder={t(
								"settings.team.filter.role.placeholder",
							)}
						/>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">
							{t("settings.team.filter.role.all")}
						</SelectItem>
						<SelectItem value="admin">
							{t("settings.team.members.role.admin")}
						</SelectItem>
						<SelectItem value="auditor">
							{t("settings.team.members.role.auditor")}
						</SelectItem>
						<SelectItem value="employee">
							{t("settings.team.members.role.employee")}
						</SelectItem>
					</SelectContent>
				</Select>
				<Button onClick={() => setIsInviteModalOpen(true)}>
					<UserPlus className="mr-2 h-4 w-4" />
					{t("settings.team.invite.button.send")}
				</Button>
			</div>
			<Card className="border">
				<CardContent className="p-0">
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

					{/* Conditionally render separator only if both sections have content */}
					{activeMembers.length > 0 && pendingInvites.length > 0 && (
						<Separator />
					)}

					{pendingInvites.length > 0 && (
						<div className="p-3 bg-muted/20">
							<h3 className="text-sm font-medium text-muted-foreground px-3 mb-2">
								{t("settings.team.invitations.title")}
							</h3>
							<div className="divide-y divide-dashed">
								{pendingInvites.map((invitation) => (
									<PendingInvitationRow
										key={invitation.displayId}
										invitation={invitation as Invitation}
										onCancel={handleCancelInvitation}
									/>
								))}
							</div>
						</div>
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
									onClick={() => setIsInviteModalOpen(true)}
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
