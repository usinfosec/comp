"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { bulkInviteMembers } from "@/actions/organization/bulk-invite-members";
import type { ActionResponse } from "@/actions/types";
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
import type { Role } from "@prisma/client";

// --- Constants for Roles ---
const availableRoles = ["admin", "auditor", "employee"] as const;
type InviteRole = (typeof availableRoles)[number];
const DEFAULT_ROLE: InviteRole = "employee";

// --- Schemas ---
const manualInviteSchema = z.object({
	email: z.string().email({ message: "Invalid email address." }),
	role: z.enum(availableRoles),
});

const formSchema = z
	.object({
		mode: z.enum(["manual", "csv"]),
		manualInvites: z.array(manualInviteSchema).optional(),
		csvFile: z.any().optional(),
	})
	.refine(
		(data) => {
			if (data.mode === "manual") {
				return data.manualInvites && data.manualInvites.length > 0;
			}
			return true;
		},
		{ message: "Please add at least one invite.", path: ["manualInvites"] },
	)
	.refine(
		(data) => {
			if (data.mode === "csv") {
				return (
					data.csvFile instanceof FileList &&
					data.csvFile.length === 1
				);
			}
			return true;
		},
		{ message: "Please select a CSV file.", path: ["csvFile"] },
	);

type FormData = z.infer<typeof formSchema>;

interface InviteMembersModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	organizationId: string;
}

interface BulkInviteResultData {
	successfulInvites: number;
	failedItems: {
		input: string | { email: string; role: InviteRole };
		error: string;
	}[];
}

export function InviteMembersModal({
	open,
	onOpenChange,
	organizationId,
}: InviteMembersModalProps) {
	const t = useI18n();
	const [mode, setMode] = useState<"manual" | "csv">("manual");
	const [isLoading, setIsLoading] = useState(false);
	const [lastResult, setLastResult] =
		useState<ActionResponse<BulkInviteResultData> | null>(null);
	const [csvFileName, setCsvFileName] = useState<string | null>(null);

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			mode: "manual",
			manualInvites: [{ email: "", role: DEFAULT_ROLE }],
			csvFile: undefined,
		},
		mode: "onChange",
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "manualInvites",
	});

	async function onSubmit(values: FormData) {
		setIsLoading(true);
		setLastResult(null);
		const formData = new FormData();
		formData.append("type", values.mode);

		if (values.mode === "manual") {
			if (!values.manualInvites || values.manualInvites.length === 0) {
				toast.error("Please add at least one member to invite.");
				setIsLoading(false);
				return;
			}
			formData.append("invites", JSON.stringify(values.manualInvites));
		} else if (values.mode === "csv") {
			if (
				!values.csvFile ||
				!(values.csvFile instanceof FileList) ||
				values.csvFile.length !== 1
			) {
				form.setError("csvFile", {
					message: "A valid CSV file is required.",
				});
				setIsLoading(false);
				return;
			}
			const file = values.csvFile[0];
			if (file.type !== "text/csv") {
				form.setError("csvFile", { message: "File must be a CSV." });
				setIsLoading(false);
				return;
			}
			if (file.size > 5 * 1024 * 1024) {
				form.setError("csvFile", {
					message: "File size must be less than 5MB.",
				});
				setIsLoading(false);
				return;
			}
			formData.append("csvFile", file);
		}

		try {
			const result = await bulkInviteMembers(formData);
			setLastResult(result);

			if (result.success && result.data) {
				const { successfulInvites, failedItems } = result.data;
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
						`Failed to invite ${failedItems.length}: ${failedItems.map((f) => (typeof f.input === "string" ? f.input : f.input.email)).join(", ")}`,
					);
				}

				if (messages.length > 0) {
					toast(messages.join(" \n "));
				} else if (
					successfulInvites === 0 &&
					failedItems.length === 0
				) {
					toast.info(
						"No new members were invited (perhaps they already exist or the file was empty).",
					);
				}
			} else {
				const errorFromAction = result.error;
				let errorMsg: string;
				if (typeof errorFromAction === "string") {
					errorMsg = errorFromAction;
				} else if (
					typeof errorFromAction === "object" &&
					errorFromAction !== null &&
					"message" in errorFromAction &&
					typeof (errorFromAction as any).message === "string"
				) {
					errorMsg = (errorFromAction as { message: string }).message;
				} else {
					errorMsg = "An unknown server error occurred.";
				}
				toast.error(errorMsg);

				if (
					result.data?.failedItems &&
					result.data.failedItems.length > 0
				) {
					toast.error(
						`Failed items: ${result.data.failedItems.map((f) => (typeof f.input === "string" ? f.input : f.input.email)).join(", ")}`,
						{ duration: 6000 },
					);
				}
			}
		} catch (error) {
			console.error("Error calling bulkInviteMembers:", error);
			toast.error("An unexpected client-side error occurred.");
		} finally {
			setIsLoading(false);
		}
	}

	const handleModeChange = (newMode: string) => {
		if (newMode === "manual" || newMode === "csv") {
			setMode(newMode);
			form.setValue("mode", newMode, { shouldValidate: true });
			if (newMode === "manual" && fields.length === 0) {
				append({ email: "", role: DEFAULT_ROLE });
			}
			form.setValue("csvFile", undefined);
			setCsvFileName(null);
			form.clearErrors();
		}
	};

	const csvTemplate =
		"email,role\nexample@domain.com,employee\nuser2@example.com,admin";
	const csvTemplateDataUri = `data:text/csv;charset=utf-8,${encodeURIComponent(csvTemplate)}`;

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
						{t("settings.team.invite.modal_description")}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<Tabs value={mode} onValueChange={handleModeChange}>
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="manual">
									{t("settings.team.tabs.manual")}
								</TabsTrigger>
								<TabsTrigger value="csv">
									{t("settings.team.tabs.csv")}
								</TabsTrigger>
							</TabsList>

							<TabsContent
								value="manual"
								className="space-y-4 pt-4"
							>
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
															{t(
																"settings.team.invite.form.emails.label",
															)}
														</FormLabel>
													)}
													<FormControl>
														<Input
															placeholder={t(
																"settings.team.invite.form.email.placeholder",
															)}
															{...field}
															value={
																field.value ||
																""
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
											render={({
												field: selectField,
											}) => (
												<FormItem className="w-[130px]">
													{index === 0 && (
														<FormLabel>
															{t(
																"settings.team.invite.form.role.label",
															)}
														</FormLabel>
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
																<SelectValue
																	placeholder={t(
																		"settings.team.invite.form.role.placeholder",
																	)}
																/>
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{availableRoles.map(
																(role) => (
																	<SelectItem
																		key={
																			role
																		}
																		value={
																			role
																		}
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
												fields.length > 1 &&
												remove(index)
											}
											disabled={fields.length <= 1}
											className={`mt-${index === 0 ? "6" : "0"} self-center ${fields.length <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
											aria-label={t(
												"settings.team.invite.form.remove_invite_aria",
											)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								))}
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="mt-2"
									onClick={() =>
										append({
											email: "",
											role: DEFAULT_ROLE,
										})
									}
								>
									<PlusCircle className="mr-2 h-4 w-4" />
									{t("settings.team.invite.form.add_another")}
								</Button>
								<FormDescription>
									{t(
										"settings.team.invite.form.manual_description",
									)}
								</FormDescription>
							</TabsContent>

							<TabsContent value="csv" className="space-y-4 pt-4">
								<FormField
									control={form.control}
									name="csvFile"
									render={({
										field: {
											onChange,
											value,
											...fieldProps
										},
									}) => (
										<FormItem>
											<FormLabel>
												{t(
													"settings.team.invite.form.csv_label",
												)}
											</FormLabel>
											<div className="flex items-center gap-2">
												<Button
													type="button"
													variant="outline"
													onClick={() =>
														document
															.getElementById(
																"csvFileInput",
															)
															?.click()
													}
												>
													Choose File
												</Button>
												<span className="text-sm text-muted-foreground truncate">
													{csvFileName ||
														"No file chosen"}
												</span>
											</div>
											<FormControl>
												<Input
													id="csvFileInput"
													type="file"
													accept=".csv"
													{...fieldProps}
													onChange={(event) => {
														const fileList =
															event.target.files;
														onChange(fileList);
														setCsvFileName(
															fileList?.[0]
																?.name || null,
														);
													}}
													className="sr-only"
												/>
											</FormControl>
											<FormDescription>
												{t(
													"settings.team.invite.form.csv_description",
													{
														roles: availableRoles.join(
															", ",
														),
													},
												)}
											</FormDescription>
											<a
												href={csvTemplateDataUri}
												download="comp_invite_template.csv"
												className="text-xs text-muted-foreground underline hover:text-foreground transition-colors"
											>
												{t(
													"settings.team.invite.form.download_template",
												)}
											</a>
											<FormMessage />
										</FormItem>
									)}
								/>
							</TabsContent>
						</Tabs>

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
								{isLoading
									? t("settings.team.invite.button.sending")
									: t("settings.team.invite.button.send")}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
