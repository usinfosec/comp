"use client";

import { Button } from "@bubba/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@bubba/ui/dropdown-menu";
import { MoreHorizontal, UserCog, UserMinus } from "lucide-react";
import { useState } from "react";
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
} from "@bubba/ui/alert-dialog";
import { updateMemberRole } from "@/actions/organization/update-member-role";
import { removeMember } from "@/actions/organization/remove-member";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@bubba/ui/dialog";
import { Label } from "@bubba/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@bubba/ui/select";
import type { User, Role, Member } from "@prisma/client";
import { useI18n } from "@/locales/client";

interface MemberActionsProps {
	permission: Member & { user: User };
	currentUserRole?: Role;
}

export function MemberActions({
	permission,
	currentUserRole,
}: MemberActionsProps) {
	const t = useI18n();
	const [isRemoving, setIsRemoving] = useState(false);
	const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
	const [newRole, setNewRole] = useState<Role>(permission.role);
	const [isUpdatingRole, setIsUpdatingRole] = useState(false);

	const memberName = permission.user.name || permission.user.email || "";

	const handleRemoveMember = async () => {
		setIsRemoving(true);
		try {
			const result = await removeMember({
				memberId: permission.id,
			});

			if (result?.data?.success) {
				toast.success(
					`${memberName} ${t("settings.team.member_actions.toast.remove_success")}`,
				);
			} else {
				toast.error(t("settings.team.member_actions.toast.remove_error"));
			}
		} catch (error) {
			toast.error(t("settings.team.member_actions.toast.remove_unexpected"));
		} finally {
			setIsRemoving(false);
		}
	};

	const handleUpdateRole = async () => {
		setIsUpdatingRole(true);
		try {
			const result = await updateMemberRole({
				memberId: permission.id,
				role: newRole,
			});

			if (result?.data?.success) {
				toast.success(
					`${memberName} ${t("settings.team.member_actions.toast.update_role_success")} ${newRole}`,
				);
				setIsRoleDialogOpen(false);
			} else {
				toast.error(t("settings.team.member_actions.toast.update_role_error"));
			}
		} catch (error) {
			toast.error(
				t("settings.team.member_actions.toast.update_role_unexpected"),
			);
		} finally {
			setIsUpdatingRole(false);
		}
	};

	const canChangeRole =
		currentUserRole === ("owner" as Role) ||
		permission.role !== ("admin" as Role);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon">
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>
						{t("settings.team.member_actions.actions")}
					</DropdownMenuLabel>
					{canChangeRole && (
						<DropdownMenuItem onSelect={() => setIsRoleDialogOpen(true)}>
							<UserCog className="h-4 w-4 mr-2" />
							{t("settings.team.member_actions.change_role")}
						</DropdownMenuItem>
					)}
					<DropdownMenuSeparator />
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
								<UserMinus className="h-4 w-4 mr-2" />
								{t("settings.team.member_actions.remove_member")}
							</DropdownMenuItem>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									{t("settings.team.member_actions.remove_confirm.title")}
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
									onClick={handleRemoveMember}
									disabled={isRemoving}
								>
									{t("common.actions.delete")}
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{t("settings.team.member_actions.role_dialog.title")}
						</DialogTitle>
						<DialogDescription>
							{t("settings.team.member_actions.role_dialog.description_prefix")}{" "}
							{memberName}
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="role">
								{t("settings.team.member_actions.role_dialog.role_label")}
							</Label>
							<Select
								value={newRole}
								onValueChange={(value) => setNewRole(value as Role)}
							>
								<SelectTrigger id="role">
									<SelectValue
										placeholder={t(
											"settings.team.member_actions.role_dialog.role_placeholder",
										)}
									/>
								</SelectTrigger>
								<SelectContent>
									{currentUserRole === ("owner" as Role) && (
										<SelectItem value="admin">
											{t("settings.team.members.role.admin")}
										</SelectItem>
									)}
									<SelectItem value="member">
										{t("settings.team.members.role.member")}
									</SelectItem>
									<SelectItem value="viewer">
										{t("settings.team.members.role.viewer")}
									</SelectItem>
								</SelectContent>
							</Select>
							<p className="text-sm text-muted-foreground mt-2">
								{newRole === ("admin" as Role) &&
									t(
										"settings.team.member_actions.role_dialog.role_descriptions.admin",
									)}
								{newRole === ("member" as Role) &&
									t(
										"settings.team.member_actions.role_dialog.role_descriptions.member",
									)}
								{newRole === ("viewer" as Role) &&
									t(
										"settings.team.member_actions.role_dialog.role_descriptions.viewer",
									)}
							</p>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsRoleDialogOpen(false)}
						>
							{t("settings.team.member_actions.role_dialog.cancel")}
						</Button>
						<Button onClick={handleUpdateRole} disabled={isUpdatingRole}>
							{t("settings.team.member_actions.role_dialog.update")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
