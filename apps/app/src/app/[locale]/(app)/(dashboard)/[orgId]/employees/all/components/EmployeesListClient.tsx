"use client";

import { bulkInviteEmployees } from "@/actions/organization/bulk-invite-employees"; // Added bulk invite import
// Removed single invite action import
// import { inviteEmployee } from "@/actions/organization/invite-employee";
import { removeEmployeeRoleOrMember } from "@/actions/organization/remove-employee";
import { useI18n } from "@/locales/client";
// Removed authClient as it's no longer used for single invite
// import { authClient } from "@/utils/auth-client";
import { Button } from "@comp/ui/button";
import { Card, CardContent } from "@comp/ui/card";
import { Input } from "@comp/ui/input";
import { Separator } from "@comp/ui/separator";
import { Search, UserPlus, X } from "lucide-react"; // Kept UserPlus for the button icon
import { useState } from "react";
import { toast } from "sonner";
import { BulkInviteDialog } from "./BulkInviteDialog"; // Import the dialog
import { EmployeeRow } from "./EmployeeRow";
import type { EmployeeWithUser } from "./EmployeesList";
import { invalidateEmployees } from "./invalidateEmployees";

// --- Removed Placeholder Types for single invite ---

// Define prop types using typeof for the actions
interface EmployeesListClientProps {
	data: EmployeeWithUser[];
	organizationId: string;
	// Removed single invite action prop
	// inviteEmployeeAction: typeof inviteEmployee;
	removeEmployeeRoleOrMemberAction: typeof removeEmployeeRoleOrMember;
	bulkInviteEmployeesAction: typeof bulkInviteEmployees; // Added bulk invite prop type
}

// Simplified type for display items
interface DisplayItem extends EmployeeWithUser {
	displayName: string;
	displayEmail: string;
	id: string; // Add id explicitly
}

export function EmployeesListClient({
	data,
	organizationId,
	// Removed single invite action prop
	// inviteEmployeeAction,
	removeEmployeeRoleOrMemberAction,
	bulkInviteEmployeesAction, // Destructure bulk invite action
}: EmployeesListClientProps) {
	const t = useI18n();
	const [searchQuery, setSearchQuery] = useState("");
	// Removed state for single invite form
	// const [inviteEmail, setInviteEmail] = useState("");
	// const [showInviteForm, setShowInviteForm] = useState(false);
	// const [isInviting, setIsInviting] = useState(false);
	const [showInviteDialog, setShowInviteDialog] = useState(false); // Renamed state for clarity

	// Prepare display items
	const allItems: DisplayItem[] = data.map((employee) => ({
		...employee,
		displayName: employee.user.name || employee.user.email || "",
		displayEmail: employee.user.email || "",
		id: employee.id,
	}));

	const filteredItems = allItems.filter(
		(item) =>
			item.displayName
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			item.displayEmail.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	// Removed handleInvite function for single invites
	/*
	const handleInvite = async (e: React.FormEvent) => {
		// ... removed ...
	};
	*/

	const handleRemoveEmployee = async (memberId: string) => {
		// Using the specific action prop for removing employees/roles
		const result = await removeEmployeeRoleOrMemberAction({ memberId });

		if (result?.data?.success) {
			await invalidateEmployees({ organizationId });
			toast.success("Employee removed successfully"); // Placeholder text
		} else {
			const errorMessage =
				result?.serverError ||
				result?.validationErrors ||
				"Failed to remove employee";
			console.error("Remove Employee Error:", result);
			toast.error(
				typeof errorMessage === "string"
					? errorMessage
					: JSON.stringify(errorMessage),
			);
		}
	};

	return (
		<div className="">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">Employees</h1>
				{/* Single Invite button */}
				<Button onClick={() => setShowInviteDialog(true)}>
					<UserPlus className="mr-2 h-4 w-4" />
					{/* TODO: Add specific button translation key */}
					Invite Employees
				</Button>
			</div>

			{/* Removed single invite form */}
			{/* {showInviteForm && (
				// ... removed ...
			)} */}

			{/* Render the consolidated invite dialog */}
			<BulkInviteDialog
				open={showInviteDialog}
				onOpenChange={setShowInviteDialog}
				organizationId={organizationId}
				bulkInviteAction={bulkInviteEmployeesAction} // Pass bulk action
			/>

			<Card className="border">
				<CardContent className="p-0">
					<div className="p-4 border-b">
						<div className="relative">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								// TODO: Add specific search placeholder translation key
								placeholder="Search by name or email..."
								className="pl-8"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
							{searchQuery && (
								<Button
									variant="ghost"
									size="icon"
									className="absolute right-1.5 top-1.5 h-7 w-7"
									onClick={() => setSearchQuery("")}
								>
									<X className="h-4 w-4" />
								</Button>
							)}
						</div>
					</div>

					{filteredItems.length > 0 ? (
						filteredItems.map((item, index) => (
							<div key={item.id}>
								<EmployeeRow
									employee={item} // Pass the full EmployeeWithUser object
									onRemove={() =>
										handleRemoveEmployee(item.id)
									} // item.id should now be valid
								/>
								{index < filteredItems.length - 1 && (
									<Separator />
								)}
							</div>
						))
					) : (
						<div className="p-4 text-center text-muted-foreground">
							{/* TODO: Add specific empty state translation key */}
							No employees found.
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
