"use client";

import React, { useState } from "react";
import { MoreHorizontal } from "lucide-react";

import { useI18n } from "@/locales/client";
import { Avatar, AvatarFallback, AvatarImage } from "@comp/ui/avatar";
import { Badge } from "@comp/ui/badge";
import { Button } from "@comp/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@comp/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@comp/ui/dropdown-menu";
import { Label } from "@comp/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@comp/ui/select";
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
import type { Role } from "@prisma/client";

import type { MemberWithUser } from "./TeamMembers";

interface MemberRowProps {
	member: MemberWithUser;
	onRemove: (memberId: string) => Promise<void>;
	onUpdateRole: (memberId: string, newRole: Role) => Promise<void>;
}

// Helper to get initials
function getInitials(name?: string | null, email?: string | null): string {
	if (name) {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase();
	}
	if (email) {
		return email.substring(0, 2).toUpperCase();
	}
	return "??";
}

export function MemberRow({ member, onRemove, onUpdateRole }: MemberRowProps) {
	const t = useI18n();
	const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
	const [isRemoveAlertOpen, setIsRemoveAlertOpen] = useState(false);
	const [selectedRole, setSelectedRole] = useState<Role>(member.role as Role); // Assuming member.role is compatible
	const [isUpdating, setIsUpdating] = useState(false);
	const [isRemoving, setIsRemoving] = useState(false);

	const memberName = member.user.name || member.user.email || "Member";
	const memberEmail = member.user.email || "";
	const memberAvatar = member.user.image;
	const memberId = member.id;
	const currentRole = member.role as Role; // Cast for safety

	// Prevent changing role of owner or removing owner/self
	const canChangeRole = currentRole !== "owner";
	const canRemove = currentRole !== "owner"; // Add self-removal check if needed

	const handleUpdateRoleClick = async () => {
		if (!canChangeRole || selectedRole === currentRole) return;
		setIsUpdating(true);
		await onUpdateRole(memberId, selectedRole);
		setIsUpdating(false);
		setIsRoleDialogOpen(false); // Close dialog on success/failure (handled by parent toast)
	};

	const handleRemoveClick = async () => {
		if (!canRemove) return;
		setIsRemoving(true);
		await onRemove(memberId);
		setIsRemoving(false);
		setIsRemoveAlertOpen(false); // Close alert dialog
	};

	return (
		<>
			<div className="flex items-center justify-between p-4 hover:bg-muted/50">
				<div className="flex items-center gap-3">
					<Avatar>
						<AvatarImage src={memberAvatar || undefined} />
						<AvatarFallback>
							{getInitials(member.user.name, member.user.email)}
						</AvatarFallback>
					</Avatar>
					<div>
						<div className="font-medium">{memberName}</div>
						<div className="text-sm text-muted-foreground">
							{memberEmail}
						</div>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Badge variant="outline">{currentRole}</Badge>
					{currentRole !== "owner" && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="h-8 w-8 p-0"
								>
									<MoreHorizontal className="h-4 w-4" />
									<span className="sr-only">Open menu</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{canChangeRole && (
									<DropdownMenuItem
										onSelect={() =>
											setIsRoleDialogOpen(true)
										}
									>
										{t(
											"settings.team.member_actions.change_role",
										)}
									</DropdownMenuItem>
								)}
								{canRemove && (
									<>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											className="text-red-600"
											onSelect={() =>
												setIsRemoveAlertOpen(true)
											}
										>
											{t(
												"settings.team.member_actions.remove_member",
											)}
										</DropdownMenuItem>
									</>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</div>

			{/* Change Role Dialog */}
			<Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{t(
								"settings.team.member_actions.role_dialog.title",
							)}
						</DialogTitle>
						<DialogDescription>
							{t(
								"settings.team.member_actions.role_dialog.description_prefix",
							)}{" "}
							{memberName}
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor={`role-${memberId}`}>
								{t(
									"settings.team.member_actions.role_dialog.role_label",
								)}
							</Label>
							<Select
								value={selectedRole}
								onValueChange={(value) =>
									setSelectedRole(value as Role)
								}
							>
								<SelectTrigger id={`role-${memberId}`}>
									<SelectValue
										placeholder={t(
											"settings.team.member_actions.role_dialog.role_placeholder",
										)}
									/>
								</SelectTrigger>
								<SelectContent>
									{/* Use actual Role enum values from prisma */}
									<SelectItem value="admin">
										{t("settings.team.members.role.admin")}
									</SelectItem>
									<SelectItem value="auditor">
										{t(
											"settings.team.members.role.auditor",
										)}
									</SelectItem>
									{/* Add employee/member if applicable */}
								</SelectContent>
							</Select>
							{/* Optional: Role descriptions */}
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsRoleDialogOpen(false)}
						>
							{t(
								"settings.team.member_actions.role_dialog.cancel",
							)}
						</Button>
						<Button
							onClick={handleUpdateRoleClick}
							disabled={isUpdating}
						>
							{t(
								"settings.team.member_actions.role_dialog.update",
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Remove Member Alert Dialog */}
			<AlertDialog
				open={isRemoveAlertOpen}
				onOpenChange={setIsRemoveAlertOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{t(
								"settings.team.member_actions.remove_confirm.title",
							)}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t(
								"settings.team.member_actions.remove_confirm.description_prefix",
							)}{" "}
							{memberName}?{" "}
							{t(
								"settings.team.member_actions.remove_confirm.description_suffix",
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>
							{t("common.actions.cancel")}
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleRemoveClick}
							disabled={isRemoving}
							// className="bg-red-600 hover:bg-red-700" // Use default destructive style if available
						>
							{t("common.actions.remove")}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
