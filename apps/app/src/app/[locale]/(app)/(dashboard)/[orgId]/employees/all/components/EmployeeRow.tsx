"use client";

import { useI18n } from "@/locales/client";
import { Avatar, AvatarFallback, AvatarImage } from "@comp/ui/avatar";
import { Button } from "@comp/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@comp/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@comp/ui/alert-dialog";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import type { EmployeeWithUser } from "./EmployeesList"; // Corrected import path
import { useParams, useRouter } from "next/navigation"; // Added imports

interface EmployeeRowProps {
	employee: EmployeeWithUser;
	onRemove: (memberId: string) => Promise<void>;
}

// Helper to get initials (can be shared or moved to utils)
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

export function EmployeeRow({ employee, onRemove }: EmployeeRowProps) {
	const t = useI18n();
	const [isRemoveAlertOpen, setIsRemoveAlertOpen] = useState(false);
	const [isRemoving, setIsRemoving] = useState(false);
	const router = useRouter(); // Added router hook
	const params = useParams<{ locale: string; orgId: string }>(); // Added params hook

	const employeeName =
		employee.user.name || employee.user.email || "Employee";
	const employeeEmail = employee.user.email || "";
	const employeeAvatar = employee.user.image;
	const memberId = employee.id; // Using the id from the placeholder type

	const handleRemoveClick = async () => {
		setIsRemoving(true);
		await onRemove(memberId);
		// State changes (isRemoving, isRemoveAlertOpen) will be handled by parent via toast/revalidation
		// If the action is successful, the row will disappear.
		// If it fails, a toast will show, and we might want to reset state here.
		// For now, assume success removes the row.
		// setIsRemoving(false); // Potentially needed on error
		// setIsRemoveAlertOpen(false); // Potentially needed on error
	};

	return (
		<>
			<div
				className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer" // Added cursor-pointer
				onClick={() =>
					// Added onClick handler
					router.push(
						`/${params.locale}/${params.orgId}/employees/${employee.id}`,
					)
				}
			>
				<div className="flex items-center gap-3">
					<Avatar>
						<AvatarImage src={employeeAvatar || undefined} />
						<AvatarFallback>
							{getInitials(
								employee.user.name,
								employee.user.email,
							)}
						</AvatarFallback>
					</Avatar>
					<div>
						<div className="font-medium">{employeeName}</div>
						<div className="text-sm text-muted-foreground">
							{employeeEmail}
						</div>
					</div>
				</div>
				<div className="flex items-center gap-2">
					{/* Role Badge removed - implicitly employee */}
					{/* Only show menu if remove is possible (currently always) */}
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
							{/* Role change removed */}
							<DropdownMenuItem
								className="text-red-600"
								onSelect={() => setIsRemoveAlertOpen(true)}
							>
								{/* TODO: Add specific remove translation key */}
								Remove Employee
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Remove Confirmation Alert Dialog */}
			<AlertDialog
				open={isRemoveAlertOpen}
				onOpenChange={setIsRemoveAlertOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{/* TODO: Add specific title translation key */}
							Are you sure?
						</AlertDialogTitle>
						<AlertDialogDescription>
							{/* TODO: Add specific description translation key */}
							This action will remove the employee role. If this
							is their only role, the member will be removed from
							the organization. This cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isRemoving}>
							{/* TODO: Add specific cancel translation key */}
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							disabled={isRemoving}
							onClick={handleRemoveClick}
							className="bg-red-600 hover:bg-red-700"
						>
							{/* TODO: Add specific confirm translation key */}
							{isRemoving ? "Removing..." : "Confirm Remove"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
