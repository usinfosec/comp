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
	displayRole: string | string[]; // Simplified role display, could be comma-separated
	displayStatus: "active" | "pending";
	displayId: string; // Use member.id or invitation.id
	processedRoles: Role[];
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
		...data.members.map((member) => {
			// Process the role to handle comma-separated values
			const roles =
				typeof member.role === "string" && member.role.includes(",")
					? (member.role.split(",") as Role[])
					: Array.isArray(member.role)
						? member.role
						: [member.role as Role];

			return {
				...member,
				type: "member" as const,
				displayName: member.user.name || member.user.email || "",
				displayEmail: member.user.email || "",
				displayRole: member.role, // Keep original for filtering
				displayStatus: "active" as const,
				displayId: member.id,
				// Add processed roles for rendering
				processedRoles: roles,
			};
		}),
		...data.pendingInvitations.map((invitation) => {
			// Process the role to handle comma-separated values
			const roles =
				typeof invitation.role === "string" &&
				invitation.role.includes(",")
					? (invitation.role.split(",") as Role[])
					: Array.isArray(invitation.role)
						? invitation.role
						: [invitation.role as Role];

			return {
				...invitation,
				type: "invitation" as const,
				displayName: invitation.email.split("@")[0], // Or just email
				displayEmail: invitation.email,
				displayRole: invitation.role, // Keep original for filtering
				displayStatus: "pending" as const,
				displayId: invitation.id,
				// Add processed roles for rendering
				processedRoles: roles,
			};
		}),
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
				result?.serverError || t("people.invite.error");
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
				t("people.member_actions.toast.remove_error");
			console.error("Remove Member Error:", errorMessage);
		}
	};

	// Update handleUpdateRole to accept Role[]
	const handleUpdateRole = async (memberId: string, roles: Role[]) => {
		// Ensure roles is always an array, even if the action expects one (future proofing)
		const rolesArray = Array.isArray(roles) ? roles : [roles];
		// Basic validation: ensure owner role isn't being removed if it exists
		// More robust validation should happen server-side in the action
		const member = data.members.find((m) => m.id === memberId);
		if (
			member &&
			member.role === "owner" &&
			!rolesArray.includes("owner")
		) {
			console.error("Cannot remove owner role."); // Maybe show toast
			// Optionally revert UI change or show error
			return;
		}

		const result = await updateMemberRoleAction({
			memberId,
			roles: rolesArray,
		}); // Pass array

		// Check for success by looking for the presence of the data property
		if (result?.data) {
			// Success: Data revalidates server-side via action's revalidatePath
			// toast.success(t("settings.team.member_actions.toast.update_role_success"));
		} else {
			// Error case
			const errorMessage =
				(result?.validationErrors // Use plural validationErrors
					? Object.values(result.validationErrors).flat().join(", ")
					: result?.serverError) ||
				t("people.member_actions.toast.update_role_error");
			console.error("Update Role Error:", errorMessage);
			// toast.error(errorMessage);
			// TODO: Consider reverting optimistic UI updates if any were made
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
						placeholder={t("people.filters.search")}
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
						<SelectValue placeholder={t("people.filters.role")} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">{t("people.all")}</SelectItem>
						<SelectItem value="owner">
							{t("people.roles.owner")}
						</SelectItem>
						<SelectItem value="admin">
							{t("people.roles.admin")}
						</SelectItem>
						<SelectItem value="auditor">
							{t("people.roles.auditor")}
						</SelectItem>
						<SelectItem value="employee">
							{t("people.roles.employee")}
						</SelectItem>
					</SelectContent>
				</Select>
				<Button onClick={() => setIsInviteModalOpen(true)}>
					<UserPlus className="mr-2 h-4 w-4" />
					{t("people.actions.invite")}
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
								{t("people.invite.title")}
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
									{t("people.empty.no_employees.title")}
								</h3>
								<p className="mt-2 text-sm text-muted-foreground max-w-xs">
									{t("people.empty.no_employees.description")}
								</p>
								<Button
									className="mt-4"
									onClick={() => setIsInviteModalOpen(true)}
								>
									<UserPlus className="mr-2 h-4 w-4" />
									{t("people.actions.invite")}
								</Button>
							</div>
						)}
				</CardContent>
			</Card>
		</div>
	);
}
