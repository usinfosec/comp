"use client";

import { submitPolicyForApprovalAction } from "@/actions/policies/submit-policy-for-approval-action";
import { updatePolicyFormAction } from "@/actions/policies/update-policy-form-action";
import { updatePolicyFormSchema } from "@/actions/schema";
import { SelectAssignee } from "@/components/SelectAssignee";
import { StatusIndicator } from "@/components/status-indicator";
import { useI18n } from "@/locales/client";
import {
	Departments,
	Frequency,
	Member,
	type Policy,
	PolicyStatus,
	User,
} from "@comp/db/types";
import { Button } from "@comp/ui/button";
import { Calendar } from "@comp/ui/calendar";
import { cn } from "@comp/ui/cn";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@comp/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@comp/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@comp/ui/select";
import { Switch } from "@comp/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { SubmitApprovalDialog } from "./SubmitApprovalDialog";

interface UpdatePolicyOverviewProps {
	policy: Policy & {
		approver: (Member & { user: User }) | null;
	};
	assignees: (Member & { user: User })[];
	isPendingApproval: boolean;
}

export function UpdatePolicyOverview({
	policy,
	assignees,
	isPendingApproval,
}: UpdatePolicyOverviewProps) {
	const t = useI18n();

	const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
	const [selectedApproverId, setSelectedApproverId] = useState<string | null>(
		null,
	);

	// Add state for date picker
	const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
	const [tempDate, setTempDate] = useState<Date | undefined>(undefined);
	const popoverRef = useRef<HTMLDivElement>(null);

	// State to track if form has been modified
	const [isFormModified, setIsFormModified] = useState(false);

	const fieldsDisabled = isPendingApproval;

	const updatePolicyForm = useAction(updatePolicyFormAction, {
		onSuccess: () => {
			toast.success(t("policies.overview.form.update_policy_success"));
		},
		onError: () => {
			toast.error(t("policies.overview.form.update_policy_error"));
		},
	});

	const submitForApproval = useAction(submitPolicyForApprovalAction, {
		onSuccess: () => {
			toast.success("Policy submitted for approval successfully!");
		},
		onError: () => {
			toast.error("Failed to submit policy for approval.");
		},
	});

	const calculateReviewDate = (): Date => {
		if (!policy.reviewDate) {
			return new Date();
		}
		return new Date(policy.reviewDate);
	};

	const reviewDate = calculateReviewDate();

	// Function to handle date confirmation
	const handleDateConfirm = (date: Date | undefined) => {
		if (date) {
			form.setValue("review_date", date, { shouldDirty: true });
		}
		setTempDate(undefined);
		setIsDatePickerOpen(false);
	};

	const form = useForm<z.infer<typeof updatePolicyFormSchema>>({
		resolver: zodResolver(updatePolicyFormSchema),
		defaultValues: {
			id: policy.id,
			status: policy.status,
			assigneeId: policy.assigneeId ?? "",
			department: policy.department ?? Departments.admin,
			review_frequency: policy.frequency ?? Frequency.monthly,
			review_date: reviewDate,
			isRequiredToSign: policy.isRequiredToSign
				? "required"
				: "not_required",
			approverId: null,
			entityId: policy.id,
		},
	});

	const onSubmit = (data: z.infer<typeof updatePolicyFormSchema>) => {
		console.log("onSubmit");
		const newStatus = data.status as PolicyStatus;

		// Check if the policy is published and if there are changes
		const isPublishedWithChanges =
			policy.status === "published" && isFormModified;

		// If policy is draft and being published OR policy is published and has changes
		if (
			(policy.status === "draft" && newStatus === "published") ||
			isPublishedWithChanges
		) {
			setIsApprovalDialogOpen(true);
		} else {
			updatePolicyForm.execute({
				...data,
				status: newStatus,
			});
		}
	};

	const handleConfirmApproval = () => {
		if (!selectedApproverId) {
			// Using hardcoded English string as fallback since the translation key is missing
			toast.error("Approver is required.");
			return;
		}
		const formData = form.getValues();
		submitForApproval.execute({
			...formData,
			status: "published" as PolicyStatus,
			approverId: selectedApproverId,
		});
		setIsApprovalDialogOpen(false);
		setSelectedApproverId(null);
	};

	// Watch for form changes to detect modifications
	form.watch();

	// Update isFormModified when form state changes
	useEffect(() => {
		const subscription = form.formState.isDirty;
		setIsFormModified(subscription);
		return () => {};
	}, [form.formState.isDirty]);

	const currentStatus = form.watch("status");
	const originalStatus = policy.status;

	let buttonText = t("common.actions.save");
	if (
		(originalStatus === "draft" && currentStatus === "published") ||
		(originalStatus === "published" && isFormModified)
	) {
		// Using hardcoded English string as fallback since the translation key is missing
		buttonText = "Submit for Approval";
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="status"
						disabled={fieldsDisabled}
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									{t("policies.overview.form.status")}
								</FormLabel>
								<FormControl>
									<Select
										value={field.value}
										onValueChange={field.onChange}
										disabled={fieldsDisabled}
									>
										<SelectTrigger>
											<SelectValue
												placeholder={t(
													"policies.overview.form.status_placeholder",
												)}
											>
												{field.value && (
													<StatusIndicator
														status={field.value}
													/>
												)}
											</SelectValue>
										</SelectTrigger>
										<SelectContent>
											{Object.values(PolicyStatus)
												.filter(
													(status) =>
														status !==
														"needs_review",
												)
												.map((status) => (
													<SelectItem
														key={status}
														value={status}
													>
														<StatusIndicator
															status={status}
														/>
													</SelectItem>
												))}
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="review_frequency"
						disabled={fieldsDisabled}
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									{t(
										"policies.overview.form.review_frequency",
									)}
								</FormLabel>
								<FormControl>
									<Select
										value={field.value}
										onValueChange={field.onChange}
										disabled={fieldsDisabled}
									>
										<SelectTrigger>
											<SelectValue
												placeholder={t(
													"policies.overview.form.review_frequency_placeholder",
												)}
											/>
										</SelectTrigger>
										<SelectContent>
											{Object.values(Frequency).map(
												(frequency) => (
													<SelectItem
														key={frequency}
														value={frequency}
													>
														{t(
															`common.frequency.${frequency}`,
														)}
													</SelectItem>
												),
											)}
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="department"
						disabled={fieldsDisabled}
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									{t(
										"policies.overview.form.policy_department",
									)}
								</FormLabel>
								<FormControl>
									<Select
										{...field}
										value={field.value}
										onValueChange={field.onChange}
										disabled={fieldsDisabled}
									>
										<SelectTrigger>
											<SelectValue
												placeholder={t(
													"policies.overview.form.policy_department_placeholder",
												)}
											/>
										</SelectTrigger>
										<SelectContent>
											{Object.values(Departments).map(
												(department) => {
													const formattedDepartment =
														department.toUpperCase();

													return (
														<SelectItem
															key={department}
															value={department}
														>
															{
																formattedDepartment
															}
														</SelectItem>
													);
												},
											)}
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="assigneeId"
						disabled={fieldsDisabled}
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									{t(
										"policies.overview.form.policy_assignee",
									)}
								</FormLabel>
								<FormControl>
									<SelectAssignee
										assignees={assignees}
										onAssigneeChange={field.onChange}
										assigneeId={field.value ?? null}
										disabled={fieldsDisabled}
										withTitle={false}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="review_date"
						disabled={fieldsDisabled}
						render={({ field }) => (
							<FormItem className="flex flex-col mt-2">
								<FormLabel>
									{t("policies.overview.form.review_date")}
								</FormLabel>
								<FormControl>
									<Popover
										open={isDatePickerOpen}
										onOpenChange={(open) => {
											setIsDatePickerOpen(open);
											if (!open) {
												setTempDate(undefined);
											}
										}}
									>
										<PopoverTrigger
											asChild
											disabled={fieldsDisabled}
											className={cn(
												fieldsDisabled &&
													"select-none cursor-not-allowed pointer-events-none",
											)}
										>
											<div className="pt-1.5">
												<Button
													type="button" // Explicitly set type to button to prevent form submission
													variant={"outline"}
													disabled={fieldsDisabled}
													className={cn(
														"pl-3 text-left font-normal w-full",
														!field.value &&
															"text-muted-foreground",
													)}
												>
													{field.value ? (
														format(
															field.value,
															"PPP",
														)
													) : (
														<span>
															{t(
																"policies.overview.form.review_date_placeholder",
															)}
														</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</div>
										</PopoverTrigger>
										<PopoverContent
											className="w-auto"
											align="start"
											ref={popoverRef}
										>
											<div className="p-1">
												<Calendar
													mode="single"
													selected={
														tempDate || field.value
													}
													onSelect={(date) => {
														// Store in temporary state instead of directly in form
														setTempDate(date);
													}}
													disabled={(date) =>
														date <= new Date()
													}
													initialFocus
												/>
												<div className="mt-4 flex justify-end gap-2">
													<Button
														type="button"
														size="sm"
														variant="outline"
														onClick={() => {
															setIsDatePickerOpen(
																false,
															);
														}}
													>
														Cancel
													</Button>
													<Button
														type="button"
														size="sm"
														onClick={() =>
															handleDateConfirm(
																tempDate,
															)
														}
													>
														Confirm Date
													</Button>
												</div>
											</div>
										</PopoverContent>
									</Popover>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="isRequiredToSign"
						disabled={fieldsDisabled}
						render={({ field }) => (
							<FormItem className="flex flex-col gap-2 mt-2">
								<FormLabel>
									Employee Signature Requirement
								</FormLabel>
								<FormControl>
									<Switch
										disabled={fieldsDisabled}
										checked={field.value === "required"}
										onCheckedChange={(checked) => {
											field.onChange(
												checked
													? "required"
													: "not_required",
											);
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="col-span-1 md:col-span-2 flex justify-end gap-2">
					{!isPendingApproval && (
						<Button
							type="submit"
							disabled={
								updatePolicyForm.isExecuting ||
								submitForApproval.isExecuting ||
								// Disable button if there are no changes from initial state
								!isFormModified
							}
						>
							{(updatePolicyForm.isExecuting ||
								submitForApproval.isExecuting) && (
								<Loader2 className="animate-spin mr-2" />
							)}
							{buttonText}
						</Button>
					)}
				</div>
			</form>
			<SubmitApprovalDialog
				isOpen={isApprovalDialogOpen}
				onOpenChange={setIsApprovalDialogOpen}
				assignees={assignees}
				selectedApproverId={selectedApproverId}
				onSelectedApproverIdChange={setSelectedApproverId}
				onConfirm={handleConfirmApproval}
				isSubmitting={submitForApproval.isExecuting}
			/>
		</Form>
	);
}
