"use client";

import { researchVendorAction } from "@/actions/research-vendor";
import { SelectAssignee } from "@/components/SelectAssignee";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useI18n } from "@/locales/client";
import { Member, User, VendorCategory, VendorStatus } from "@comp/db/types";
import { GlobalVendors } from "@comp/db/types";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@comp/ui/accordion";
import { Button } from "@comp/ui/button";
import { cn } from "@comp/ui/cn";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@comp/ui/command";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@comp/ui/form";
import { Input } from "@comp/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@comp/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@comp/ui/select";
import { Textarea } from "@comp/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, ChevronsUpDown } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createVendorAction } from "../actions/create-vendor-action";
import { searchGlobalVendorsAction } from "../actions/search-global-vendors-action";

const createVendorSchema = z.object({
	name: z.string().min(1, "Name is required"),
	website: z.string().url("Must be a valid URL").optional(),
	description: z.string().optional(),
	category: z.nativeEnum(VendorCategory),
	status: z.nativeEnum(VendorStatus).default(VendorStatus.not_assessed),
	assigneeId: z.string().optional(),
});

export function CreateVendorForm({
	assignees,
}: { assignees: (Member & { user: User })[] }) {
	const t = useI18n();
	const [_, setCreateVendorSheet] = useQueryState("createVendorSheet");

	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<GlobalVendors[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [popoverOpen, setPopoverOpen] = useState(false);

	const createVendor = useAction(createVendorAction, {
		onSuccess: async () => {
			toast.success(t("vendors.form.create_vendor_success"));
			setCreateVendorSheet(null);
		},
		onError: () => {
			toast.error(t("vendors.form.create_vendor_error"));
		},
	});

	const researchVendor = useAction(researchVendorAction);

	const searchVendors = useAction(searchGlobalVendorsAction, {
		onExecute: () => setIsSearching(true),
		onSuccess: (result) => {
			if (result.data?.success && result.data.data?.vendors) {
				setSearchResults(result.data.data.vendors);
			} else {
				setSearchResults([]);
			}
			setIsSearching(false);
		},
		onError: () => {
			setSearchResults([]);
			setIsSearching(false);
		},
	});

	// Debounced search function using the custom hook
	const debouncedSearch = useDebouncedCallback((query: string) => {
		if (query.trim().length > 1) { // Only search if query is longer than 1 char
			searchVendors.execute({ name: query });
		} else {
			setSearchResults([]); // Clear results if query is too short
		}
	}, 300); // 300ms debounce delay

	const form = useForm<z.infer<typeof createVendorSchema>>({
		resolver: zodResolver(createVendorSchema),
		defaultValues: {
			name: "",
			website: "",
			description: "",
			category: VendorCategory.cloud,
			status: VendorStatus.not_assessed,
		},
	});

	const onSubmit = async (data: z.infer<typeof createVendorSchema>) => {
		createVendor.execute(data);

		if (data.website) {
			await researchVendor.execute({
				website: data.website,
			});
		}
	};

	const handleSelectVendor = (vendor: GlobalVendors) => {
		form.setValue("name", vendor.company_name ?? vendor.legal_name ?? "");
		form.setValue("website", vendor.website ?? "");
		form.setValue("description", vendor.company_description ?? "");
		setSearchQuery(vendor.company_name ?? vendor.legal_name ?? ""); // Update search query display
		setSearchResults([]); // Clear results
		setPopoverOpen(false); // Close popover
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
												<FormItem className="flex flex-col">
													<FormLabel>
														{t(
															"vendors.form.vendor_name",
														)}
													</FormLabel>
													<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
														<PopoverTrigger asChild>
															<FormControl>
																{/* We use a Button as the trigger, but use CommandInput inside Popover */}
																<Button
																	variant="outline"
																	role="combobox"
																	aria-expanded={popoverOpen}
																	className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
																>
																	{field.value || t("vendors.form.vendor_name_placeholder")}
																	<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
																</Button>
															</FormControl>
														</PopoverTrigger>
														<PopoverContent className="w-[--radix-popover-trigger-width] p-0">
															<Command shouldFilter={false}> {/* Disable default filtering */}
																<CommandInput
																	placeholder={t("vendors.form.search_vendor_placeholder")} // Add a new translation key
																	value={searchQuery}
																	onValueChange={(value) => {
																		setSearchQuery(value);
																		// Also update the form field in real-time if user types without selecting
																		// This allows creating a custom vendor
																		field.onChange(value);
																		// Trigger debounced search
																		debouncedSearch(value);
																	}}
																	autoFocus
																/>
																<CommandList>
																	<CommandEmpty>
																		{isSearching ? t("common.loading") : t("vendors.form.no_vendor_found")} {/* Add new translation keys */}
																	</CommandEmpty>
																	<CommandGroup heading={t("vendors.form.suggestions")}> {/* Add new translation key */}
																		{searchResults.map((vendor) => (
																			<CommandItem
																				key={vendor.website}
																				value={vendor.company_name ?? vendor.website} // Use a unique value for CommandItem
																				onSelect={() => handleSelectVendor(vendor)}
																				className="cursor-pointer"
																			>
																				{/* Check icon can be used if needed, but maybe confusing here */}
																				{/* <Check
																					className={cn(
																						"mr-2 h-4 w-4",
																						(form.getValues("name") === vendor.company_name || form.getValues("name") === vendor.legal_name) ? "opacity-100" : "opacity-0",
																					)}
																				/> */}
																				{vendor.company_name ?? vendor.legal_name ?? vendor.website}
																			</CommandItem>
																		))}
																		{/* Option to explicitly create the custom vendor typed */}
																		{searchQuery && !isSearching && searchResults.length === 0 && (
																			<CommandItem
																				key="custom"
																				value={searchQuery}
																				onSelect={() => {
																					field.onChange(searchQuery); // Ensure form field has the typed value
																					setPopoverOpen(false);
																				}}
																				className="cursor-pointer italic"
																			>
																				{t("vendors.form.create_custom_vendor", { name: searchQuery })} {/* Add new translation key */}
																			</CommandItem>
																		)}
																	</CommandGroup>
																</CommandList>
															</Command>
														</PopoverContent>
													</Popover>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="website"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														{t(
															"vendors.form.vendor_website",
														)}
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															className="mt-3"
															placeholder={t(
																"vendors.form.vendor_website_placeholder",
															)}
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
													<FormLabel>
														{t(
															"vendors.form.vendor_description",
														)}
													</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															className="mt-3 min-h-[80px]"
															placeholder={t(
																"vendors.form.vendor_description_placeholder",
															)}
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
													<FormLabel>
														{t(
															"vendors.form.vendor_category",
														)}
													</FormLabel>
													<FormControl>
														<Select
															{...field}
															value={field.value}
															onValueChange={
																field.onChange
															}
														>
															<SelectTrigger>
																<SelectValue
																	placeholder={t(
																		"vendors.form.vendor_category_placeholder",
																	)}
																/>
															</SelectTrigger>
															<SelectContent>
																{Object.values(
																	VendorCategory,
																).map(
																	(
																		category,
																	) => {
																		const formattedCategory =
																			category
																				.toLowerCase()
																				.split(
																					"_",
																				)
																				.map(
																					(
																						word,
																					) =>
																						word
																							.charAt(
																								0,
																							)
																							.toUpperCase() +
																						word.slice(
																							1,
																						),
																				)
																				.join(
																					" ",
																				);
																		return (
																			<SelectItem
																				key={
																					category
																				}
																				value={
																					category
																				}
																			>
																				{
																					formattedCategory
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
											name="status"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														{t(
															"vendors.form.vendor_status",
														)}
													</FormLabel>
													<FormControl>
														<Select
															{...field}
															value={field.value}
															onValueChange={
																field.onChange
															}
														>
															<SelectTrigger>
																<SelectValue
																	placeholder={t(
																		"vendors.form.vendor_status_placeholder",
																	)}
																/>
															</SelectTrigger>
															<SelectContent>
																{Object.values(
																	VendorStatus,
																).map(
																	(
																		status,
																	) => {
																		const formattedStatus =
																			status
																				.toLowerCase()
																				.split(
																					"_",
																				)
																				.map(
																					(
																						word,
																					) =>
																						word
																							.charAt(
																								0,
																							)
																							.toUpperCase() +
																						word.slice(
																							1,
																						),
																				)
																				.join(
																					" ",
																				);
																		return (
																			<SelectItem
																				key={
																					status
																				}
																				value={
																					status
																				}
																			>
																				{
																					formattedStatus
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
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														{t(
															"common.assignee.label",
														)}
													</FormLabel>
													<FormControl>
														<SelectAssignee
															assignees={
																assignees
															}
															assigneeId={
																field.value ??
																null
															}
															withTitle={false}
															onAssigneeChange={
																field.onChange
															}
														/>
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
							variant="default"
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
