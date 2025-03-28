"use client";

import { useOrganizationAdmins } from "@/app/[locale]/(app)/(dashboard)/[orgId]/hooks/useOrganizationAdmins";
import { SelectUser } from "@/components/select-user";
import { useI18n } from "@/locales/client";
import { VendorCategory, VendorStatus } from "@bubba/db/types";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@bubba/ui/accordion";
import { Button } from "@bubba/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@bubba/ui/form";
import { Input } from "@bubba/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@bubba/ui/select";
import { Textarea } from "@bubba/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createVendorAction } from "../actions/create-vendor-action";


const createVendorSchema = z.object({
	name: z.string().min(1, "Name is required"),
	website: z.string().url("Must be a valid URL").optional(),
	description: z.string().optional(),
	category: z.nativeEnum(VendorCategory),
	status: z.nativeEnum(VendorStatus).default(VendorStatus.not_assessed),
	ownerId: z.string().optional(),
});

export function CreateVendorForm() {
	const t = useI18n();
	const session = useSession();

	// Get the same query parameters as the table
	const [search] = useQueryState("search");
	const [page] = useQueryState("page", {
		defaultValue: 1,
		parse: Number.parseInt,
	});
	const [pageSize] = useQueryState("pageSize", {
		defaultValue: 10,
		parse: Number,
	});
	const [status] = useQueryState<VendorStatus | null>("status", {
		defaultValue: null,
		parse: (value) => value as VendorStatus | null,
	});
	const [category] = useQueryState<VendorCategory | null>("category", {
		defaultValue: null,
		parse: (value) => value as VendorCategory | null,
	});
	const [assigneeId] = useQueryState<string | null>("assigneeId", {
		defaultValue: null,
		parse: (value) => value,
	});

	const router = useRouter();

	const { data: admins, isLoading: isLoadingAdmins } = useOrganizationAdmins();

	const createVendor = useAction(createVendorAction, {
		onSuccess: async (data) => {
			const organizationId = session.data?.user?.organizationId;

			if (!organizationId) {
				toast.error(t("vendors.form.create_vendor_error"));
				return;
			}

			toast.success(t("vendors.form.create_vendor_success"));

			router.push(`/${organizationId}/vendors/${data.data?.data?.id}`);
		},
		onError: () => {
			toast.error(t("vendors.form.create_vendor_error"));
		},
	});

	const form = useForm<z.infer<typeof createVendorSchema>>({
		resolver: zodResolver(createVendorSchema),
		defaultValues: {
			name: "",
			description: "",
			category: VendorCategory.cloud,
			status: VendorStatus.not_assessed,
		},
	});

	const onSubmit = (data: z.infer<typeof createVendorSchema>) => {
		createVendor.execute(data);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="h-[calc(100vh-250px)] scrollbar-hide overflow-auto">
					<div>
						<Accordion type="multiple" defaultValue={["vendor"]}>
							<AccordionItem value="vendor">
								<AccordionTrigger>
									{t("vendors.form.vendor_details")}
								</AccordionTrigger>
								<AccordionContent>
									<div className="space-y-4">
										<FormField
											control={form.control}
											name="name"
											render={({ field }) => (
												<FormItem>
													<FormLabel>{t("vendors.form.vendor_name")}</FormLabel>
													<FormControl>
														<Input
															{...field}
															autoFocus
															className="mt-3"
															placeholder={t("vendors.form.vendor_name_placeholder")}
															autoCorrect="off"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="website"
											render={({ field }) => (
												<FormItem>
													<FormLabel>{t("vendors.form.vendor_website")}</FormLabel>
													<FormControl>
														<Input
															{...field}
															className="mt-3"
															placeholder={t("vendors.form.vendor_website_placeholder")}
															type="url"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="description"
											render={({ field }) => (
												<FormItem>
													<FormLabel>{t("vendors.form.vendor_description")}</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															className="mt-3 min-h-[80px]"
															placeholder={t("vendors.form.vendor_description_placeholder")}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="category"
											render={({ field }) => (
												<FormItem>
													<FormLabel>{t("vendors.form.vendor_category")}</FormLabel>
													<FormControl>
														<Select
															{...field}
															value={field.value}
															onValueChange={field.onChange}
														>
															<SelectTrigger>
																<SelectValue
																	placeholder={t("vendors.form.vendor_category_placeholder")}
																/>
															</SelectTrigger>
															<SelectContent>
																{Object.values(VendorCategory).map((category) => {
																	const formattedCategory = category
																		.toLowerCase()
																		.split("_")
																		.map(
																			(word) =>
																				word.charAt(0).toUpperCase() +
																				word.slice(1),
																		)
																		.join(" ");
																	return (
																		<SelectItem key={category} value={category}>
																			{formattedCategory}
																		</SelectItem>
																	);
																})}
															</SelectContent>
														</Select>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="status"
											render={({ field }) => (
												<FormItem>
													<FormLabel>{t("vendors.form.vendor_status")}</FormLabel>
													<FormControl>
														<Select
															{...field}
															value={field.value}
															onValueChange={field.onChange}
														>
															<SelectTrigger>
																<SelectValue
																	placeholder={t("vendors.form.vendor_status_placeholder")}
																/>
															</SelectTrigger>
															<SelectContent>
																{Object.values(VendorStatus).map((status) => {
																	const formattedStatus = status
																		.toLowerCase()
																		.split("_")
																		.map(
																			(word) =>
																				word.charAt(0).toUpperCase() +
																				word.slice(1),
																		)
																		.join(" ");
																	return (
																		<SelectItem key={status} value={status}>
																			{formattedStatus}
																		</SelectItem>
																	);
																})}
															</SelectContent>
														</Select>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="ownerId"
											render={({ field }) => (
												<FormItem>
													<FormLabel>{t("common.assignee.label")}</FormLabel>
													<FormControl>
														<Select
															value={field.value}
															onValueChange={field.onChange}
														>
															<SelectTrigger>
																<SelectValue
																	placeholder={t("common.assignee.placeholder")}
																/>
															</SelectTrigger>
															<SelectContent>
																<SelectUser
																	users={admins || []}
																	isLoading={isLoadingAdmins}
																	onSelect={field.onChange}
																	selectedId={field.value}
																/>
															</SelectContent>
														</Select>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>

					<div className="flex justify-end mt-4">
						<Button
							type="submit"
							variant="action"
							disabled={createVendor.status === "executing"}
						>
							<div className="flex items-center justify-center">
								{t("vendors.actions.create")}
								<ArrowRightIcon className="ml-2 h-4 w-4" />
							</div>
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
