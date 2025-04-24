"use client";

import { useState } from "react";
import { useI18n } from "@/locales/client";
import { Button } from "@comp/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@comp/ui/dialog";
import { Textarea } from "@comp/ui/textarea";
import { Label } from "@comp/ui/label";
import { toast } from "sonner";
// Import the actual action type and function
import type { bulkInviteEmployees } from "@/actions/organization/bulk-invite-employees";
import { invalidateEmployees } from "./invalidateEmployees";

interface BulkInviteDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	organizationId: string;
	// Add the bulk invite action prop type
	bulkInviteAction: typeof bulkInviteEmployees;
}

// Define the expected structure of the results in the action response data
interface InviteResult {
	email: string;
	success: boolean;
	error?: string;
}

export function BulkInviteDialog({
	open,
	onOpenChange,
	organizationId,
	// Destructure the bulk invite action prop
	bulkInviteAction,
}: BulkInviteDialogProps) {
	const t = useI18n();
	const [emails, setEmails] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async () => {
		setIsSubmitting(true);
		const emailList = emails
			.split(",")
			.map((email) => email.trim().toLowerCase()) // Trim and lowercase
			.filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)); // Basic email format check

		if (emailList.length === 0) {
			toast.error("Please enter at least one valid email address."); // TODO: Add translation
			setIsSubmitting(false);
			return;
		}

		try {
			// Call the actual server action
			const result = await bulkInviteAction({
				emails: emailList,
				organizationId: organizationId,
			});

			if (result?.data && Array.isArray(result.data)) {
				// Assuming result.data contains the InviteResult[] array
				const results = result.data as InviteResult[];
				const successes = results.filter((r) => r.success);
				const failures = results.filter((r) => !r.success);

				if (failures.length === 0) {
					// All succeeded
					toast.success(
						`Successfully invited ${successes.length} employee(s).`,
					); // TODO: Add translation
				} else if (successes.length === 0) {
					// All failed
					toast.error(
						`Failed to invite ${failures.length} employee(s). Check emails and try again.`,
						{
							description: failures
								.map(
									(f) =>
										`${f.email}: ${f.error || "Unknown error"}`,
								)
								.join("\n"),
						},
					); // TODO: Add translation
				} else {
					// Partial success
					toast.warning(
						`Invited ${successes.length} employee(s). Failed to invite ${failures.length}.`,
						{
							description: failures
								.map(
									(f) =>
										`${f.email}: ${f.error || "Unknown error"}`,
								)
								.join("\n"),
						},
					); // TODO: Add translation
				}

				if (successes.length > 0) {
					await invalidateEmployees({ organizationId }); // Invalidate list if at least one succeeded
					setEmails(""); // Clear input
					onOpenChange(false); // Close dialog
				}
			} else if (result?.serverError || result?.validationErrors) {
				// Handle server or validation errors from safe-action
				const errorMsg =
					result?.serverError ||
					JSON.stringify(result?.validationErrors) || // Stringify validation errors
					"Failed to send invitations."; // TODO: Add translation
				toast.error(errorMsg);
			} else {
				// Fallback for unexpected issues
				toast.error(
					"An unexpected error occurred while sending invitations.",
				); // TODO: Add translation
			}
		} catch (error) {
			console.error("Bulk Invite Submit Error:", error);
			const errorMessage =
				error instanceof Error
					? error.message
					: "An unexpected network error occurred."; // TODO: Add translation
			toast.error(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					{/* TODO: Add specific title translation key */}
					<DialogTitle>Invite Employees</DialogTitle>
					{/* Updated Title */}
					{/* TODO: Add specific description translation key */}
					<DialogDescription>
						Enter one or more email addresses separated by commas.
						Invited users will receive an email to join the
						organization as employees.
					</DialogDescription>
					{/* Updated Description */}
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid w-full gap-1.5">
						<Label htmlFor="emails">Emails</Label>
						<Textarea
							id="emails"
							placeholder="e.g., employee1@example.com, employee2@example.com"
							value={emails}
							onChange={(e) => setEmails(e.target.value)}
							rows={5}
							disabled={isSubmitting}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isSubmitting}
					>
						{/* TODO: Add specific cancel translation key */}
						Cancel
					</Button>
					<Button
						type="button"
						onClick={handleSubmit}
						disabled={isSubmitting || !emails.trim()}
					>
						{/* TODO: Add specific submit translation keys */}
						{isSubmitting ? "Sending Invites..." : "Send Invites"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
