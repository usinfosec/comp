"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle, Trash2, Upload } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { bulkInviteMembers } from "@/actions/organization/bulk-invite-members";
import { useI18n } from "@/locales/client";
import { invalidateMembers } from "@/app/[locale]/(app)/(dashboard)/[orgId]/settings/users/components/invalidateMembers";
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
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@comp/ui/form";
import { Input } from "@comp/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@comp/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@comp/ui/tabs";
import { Textarea } from "@comp/ui/textarea";
import type { Role } from "@prisma/client";

// --- Constants for Roles ---
const availableRoles = ["admin", "auditor", "employee"] as const;
type InviteRole = (typeof availableRoles)[number];

// --- Schemas ---

// Schema for a single manual invite row
const manualInviteSchema = z.object({
	email: z.string().email({ message: "Invalid email address." }),
	role: z.enum(availableRoles),
});

// Schema for the overall form
const formSchema = z.object({
	// Only manual invites for now
	manualInvites: z
		.array(manualInviteSchema)
		.min(1, "Please add at least one invite."), // Ensure at least one row
	// csvFile: z.any().optional(), // Removed CSV file field
});

type FormData = z.infer<typeof formSchema>;

interface InviteMembersModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	organizationId: string;
	bulkInviteAction: typeof bulkInviteMembers;
}

export function InviteMembersModal({
	open,
	onOpenChange,
	organizationId,
	bulkInviteAction,
}: InviteMembersModalProps) {
	const t = useI18n();
	// Remove mode state
	// const [mode, setMode] = useState<"manual" | "csv">("manual");

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			// mode: "manual", // Removed mode
			manualInvites: [{ email: "", role: "auditor" }],
			// csvFile: undefined, // Removed csvFile
		},
		// mode: "onChange", // Removed mode setting
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "manualInvites",
	});

	// Remove watchedMode
	// const watchedMode = form.watch("mode");

	const { execute, status } = useAction(bulkInviteAction, {
		onSuccess: async (actionResponse) => {
			if (actionResponse?.success && actionResponse.data) {
				const { successfulInvites, failedItems } = actionResponse.data;
				const messages: string[] = [];
				if (successfulInvites > 0) {
					messages.push(
						`Successfully invited ${successfulInvites} member(s).`,
					);
					await invalidateMembers({ organizationId });
					form.reset();
					onOpenChange(false);
				}
				if (failedItems.length > 0) {
					messages.push(
						`Failed to invite ${failedItems.length} member(s): ${failedItems.map((f) => (typeof f.input === "string" ? f.input : f.input.email)).join(", ")}`,
					);
				}

				if (messages.length > 0) {
					toast(messages.join(" \n "));
				} else if (
					successfulInvites === 0 &&
					failedItems.length === 0
				) {
					toast.info(
						"No new members were invited (perhaps they already exist).",
					);
				}
			} else if (actionResponse && !actionResponse.success) {
				const errorMsg =
					typeof actionResponse.error === "object" &&
					actionResponse.error !== null &&
					"message" in actionResponse.error
						? (actionResponse.error as { message: string }).message
						: typeof actionResponse.error === "string"
							? actionResponse.error
							: "An unknown server error occurred.";
				toast.error(errorMsg);

				if (
					actionResponse.data?.failedItems &&
					actionResponse.data.failedItems.length > 0
				) {
					toast.error(
						`Failed invites: ${actionResponse.data.failedItems.map((f) => (typeof f.input === "string" ? f.input : f.input.email)).join(", ")}`,
						{ duration: 5000 },
					);
				}
			} else {
				toast.error(
					"An unexpected response format was received from the server.",
				);
			}
		},
		onError: (errorResult) => {
			console.error("Bulk Invite useAction Hook Error:", errorResult);
			const error = errorResult.error;
			const message =
				error?.serverError ||
				(error?.validationErrors
					? typeof error.validationErrors === "string"
						? error.validationErrors
						: Array.isArray(error.validationErrors)
							? error.validationErrors.join(", ")
							: typeof error.validationErrors === "object" &&
									error.validationErrors !== null
								? Object.entries(error.validationErrors)
										.map(
											([key, value]) =>
												`${key}: ${value?._errors?.join(", ") || "Invalid"}`,
										)
										.join("; ")
								: "Validation Error"
					: null) ||
				"A network or client-side error occurred.";
			toast.error(message);
		},
	});

	const isLoading = status === "executing";

	async function onSubmit(values: FormData) {
		console.log("Submitting Manual Invites:", values.manualInvites);
		if (!values.manualInvites || values.manualInvites.length === 0) {
			toast.error("Please add at least one member to invite.");
			return;
		}
		execute(values.manualInvites);
	}

	// Remove handleModeChange
	// const handleModeChange = ...

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="sm:max-w-lg"
				onInteractOutside={(e) => {
					e.preventDefault();
				}}
			>
				<DialogHeader>
					<DialogTitle>
						{t("settings.team.invite.modal_title")}
					</DialogTitle>
					<DialogDescription>
						{t("settings.team.invite.modal_description_manual")}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 pt-4"
					>
						<div className="space-y-4">
							{fields.map((item, index) => (
								<div
									key={item.id}
									className="flex items-start gap-2"
								>
									<FormField
										control={form.control}
										name={`manualInvites.${index}.email`}
										render={({ field }) => (
											<FormItem className="flex-1">
												{index === 0 && (
													<FormLabel>
														Email Address
													</FormLabel>
												)}
												<FormControl>
													<Input
														placeholder="member@example.com"
														{...field}
														value={
															field.value || ""
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name={`manualInvites.${index}.role`}
										render={({ field: selectField }) => (
											<FormItem className="w-[130px]">
												{index === 0 && (
													<FormLabel>Role</FormLabel>
												)}
												<Select
													onValueChange={
														selectField.onChange
													}
													defaultValue={
														selectField.value
													}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select role" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{availableRoles.map(
															(role) => (
																<SelectItem
																	key={role}
																	value={role}
																>
																	{t(
																		`settings.team.members.role.${role}`,
																	)}
																</SelectItem>
															),
														)}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() =>
											fields.length > 1 && remove(index)
										}
										disabled={fields.length <= 1}
										className={`mt-${index === 0 ? "6" : "0"} self-center ${fields.length <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
										aria-label="Remove invite"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							))}
						</div>

						<Button
							type="button"
							variant="outline"
							size="sm"
							className="mt-2"
							onClick={() =>
								append({ email: "", role: "auditor" })
							}
						>
							<PlusCircle className="mr-2 h-4 w-4" />
							Add Another
						</Button>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
								disabled={isLoading}
							>
								{t("common.actions.cancel")}
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								{t("settings.team.invite.button.send")}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
