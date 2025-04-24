"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { Role } from "@prisma/client";

import { bulkInviteMembers } from "../actions/bulkInviteMembers";
import type { ActionResponse } from "@/actions/types";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@comp/ui/tabs";
import { MultiRoleCombobox } from "./MultiRoleCombobox";

// --- Constants for Roles ---
const selectableRoles = [
	"admin",
	"auditor",
	"employee",
] as const satisfies Readonly<Role[]>;
type InviteRole = (typeof selectableRoles)[number];
const DEFAULT_ROLES: InviteRole[] = ["employee"];

// --- Schemas ---
const manualInviteSchema = z.object({
	email: z.string().email({ message: "Invalid email address." }),
	roles: z
		.array(z.enum(selectableRoles))
		.min(1, { message: "Please select at least one role." }),
});

// Define base schemas for each mode
const manualModeSchema = z.object({
	mode: z.literal("manual"),
	manualInvites: z
		.array(manualInviteSchema)
		.min(1, { message: "Please add at least one invite." }),
	csvFile: z.any().optional(), // Optional here, validated by union
});

const csvModeSchema = z.object({
	mode: z.literal("csv"),
	manualInvites: z.array(manualInviteSchema).optional(), // Optional here
	csvFile: z
		.any()
		.refine((val) => val instanceof FileList && val.length === 1, {
			message: "Please select a single CSV file.",
		}),
});

// Combine using discriminatedUnion
const formSchema = z.discriminatedUnion("mode", [
	manualModeSchema,
	csvModeSchema,
]);

type FormData = z.infer<typeof formSchema>;

interface InviteMembersModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	organizationId: string;
}

interface BulkInviteResultData {
	successfulInvites: number;
	failedItems: {
		input: string | { email: string; role: InviteRole | InviteRole[] };
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
	const [csvFileName, setCsvFileName] = useState<string | null>(null);
	const [lastResult, setLastResult] =
		useState<ActionResponse<BulkInviteResultData> | null>(null);

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			mode: "manual",
			manualInvites: [{ email: "", roles: DEFAULT_ROLES }],
			csvFile: undefined,
		},
		mode: "onChange",
	});

	// Log form errors on change
	useEffect(() => {
		if (Object.keys(form.formState.errors).length > 0) {
			console.error("Form Validation Errors:", form.formState.errors);
		}
	}, [form.formState.errors]);

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "manualInvites",
	});

	async function onSubmit(values: FormData) {
		console.log("onSubmit triggered", { values });
		setIsLoading(true);
		const formData = new FormData();
		formData.append("type", values.mode);

		if (values.mode === "manual") {
			console.log("Processing manual mode");
			if (!values.manualInvites || values.manualInvites.length === 0) {
				console.error("Manual mode validation failed: No invites.");
				toast.error("Please add at least one member to invite.");
				setIsLoading(false);
				return;
			}
			console.log("Manual invites to stringify:", values.manualInvites);
			const invalidInvites = values.manualInvites.filter(
				(invite) => !invite.roles || invite.roles.length === 0,
			);
			if (invalidInvites.length > 0) {
				console.error(
					`Manual mode validation failed: No roles selected for: ${invalidInvites.map((i) => i.email || "invite").join(", ")}`,
				);
				toast.error(
					`Please select at least one role for: ${invalidInvites.map((i) => i.email || "invite").join(", ")}`,
				);
				setIsLoading(false);
				return;
			}
			formData.append("invites", JSON.stringify(values.manualInvites));
		} else if (values.mode === "csv") {
			console.log("Processing CSV mode");
			if (
				!values.csvFile ||
				!(values.csvFile instanceof FileList) ||
				values.csvFile.length !== 1
			) {
				console.error(
					"CSV mode validation failed: No valid file selected.",
				);
				form.setError("csvFile", {
					message: "A valid CSV file is required.",
				});
				setIsLoading(false);
				return;
			}
			const file = values.csvFile[0];
			if (file.type !== "text/csv") {
				console.error(
					"CSV mode validation failed: Incorrect file type.",
					{ type: file.type },
				);
				form.setError("csvFile", { message: "File must be a CSV." });
				setIsLoading(false);
				return;
			}
			if (file.size > 5 * 1024 * 1024) {
				console.error("CSV mode validation failed: File too large.", {
					size: file.size,
				});
				form.setError("csvFile", {
					message: "File size must be less than 5MB.",
				});
				setIsLoading(false);
				return;
			}
			console.log("Appending CSV file to FormData:", file.name);
			formData.append("csvFile", file);
		}

		try {
			console.log("Calling bulkInviteMembers server action directly...");
			const result = await bulkInviteMembers(formData);
			setLastResult(result as ActionResponse<BulkInviteResultData>);

			if (result.success && result.data) {
				console.log("Server action success", { data: result.data });
				const { successfulInvites, failedItems } = result.data;
				const messages: string[] = [];
				if (successfulInvites > 0) {
					messages.push(
						`Successfully invited ${successfulInvites} member(s).`,
					);
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
				console.warn("Server action failed or returned no data", {
					result,
				});
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
			console.error(
				"Error calling bulkInviteMembers (catch block):",
				error,
			);
			toast.error("An unexpected client-side error occurred.");
		} finally {
			console.log("onSubmit finished");
			setIsLoading(false);
		}
	}

	const handleModeChange = (newMode: string) => {
		if (newMode === "manual" || newMode === "csv") {
			setMode(newMode);
			form.setValue("mode", newMode, { shouldValidate: true });

			if (newMode === "manual") {
				if (fields.length === 0) {
					append({ email: "", roles: DEFAULT_ROLES });
				}
				form.setValue("csvFile", undefined);
				setCsvFileName(null);
			} else if (newMode === "csv") {
				form.setValue("manualInvites", undefined);
			}

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
					<DialogTitle>{t("people.invite.title")}</DialogTitle>
					<DialogDescription>
						{t("people.invite.description")}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<Tabs value={mode} onValueChange={handleModeChange}>
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="manual">Manual</TabsTrigger>
								<TabsTrigger value="csv">CSV</TabsTrigger>
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
																"people.invite.email.label",
															)}
														</FormLabel>
													)}
													<FormControl>
														<Input
															placeholder={t(
																"people.invite.email.placeholder",
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
										<Controller
											control={form.control}
											name={`manualInvites.${index}.roles`}
											render={({
												field: { onChange, value },
												fieldState: { error },
											}) => (
												<FormItem className="w-[200px]">
													{index === 0 && (
														<FormLabel>
															{t(
																"people.invite.role.label",
															)}
														</FormLabel>
													)}
													<MultiRoleCombobox
														selectedRoles={
															value || []
														}
														onSelectedRolesChange={
															onChange
														}
														placeholder={t(
															"people.invite.role.placeholder",
														)}
													/>
													<FormMessage>
														{error?.message}
													</FormMessage>
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
											aria-label="Remove invite"
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
											roles: DEFAULT_ROLES,
										})
									}
								>
									<PlusCircle className="mr-2 h-4 w-4" />
									Add Another
								</Button>
								<FormDescription>
									{t("people.invite.description")}
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
											<FormLabel>CSV File</FormLabel>
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
												CSV Template
											</FormDescription>
											<a
												href={csvTemplateDataUri}
												download="comp_invite_template.csv"
												className="text-xs text-muted-foreground underline hover:text-foreground transition-colors"
											>
												Download Template
											</a>
											<FormMessage />
										</FormItem>
									)}
								/>
							</TabsContent>
						</Tabs>

						<DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0">
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
								disabled={isLoading}
								className="w-full sm:w-auto"
							>
								{t("common.actions.cancel")}
							</Button>
							<Button
								type="submit"
								disabled={isLoading}
								className="w-full sm:w-auto"
							>
								{isLoading && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								{isLoading
									? t("people.invite.submitting")
									: t("people.invite.submit")}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
