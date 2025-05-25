"use client";

import { createPolicyAction } from "@/actions/policies/create-new-policy";
import { createPolicySchema, type CreatePolicySchema } from "@/actions/schema";
import { useI18n } from "@/locales/client";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@comp/ui/accordion";
import { Button } from "@comp/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@comp/ui/form";
import { Input } from "@comp/ui/input";
import { Textarea } from "@comp/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useQueryState } from "nuqs";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function CreateNewPolicyForm() {
	const t = useI18n();
	const [_, setCreatePolicySheet] = useQueryState("create-policy-sheet");

	const createPolicy = useAction(createPolicyAction, {
		onSuccess: () => {
			toast.success(t("policies.new.success"));
			setCreatePolicySheet(null);
		},
		onError: () => {
			toast.error(t("policies.new.error"));
		},
	});

       const form = useForm<CreatePolicySchema>({
               resolver: zodResolver(createPolicySchema),
               defaultValues: {
                       title: "",
                       description: "",
               },
       });

       const onSubmit = (data: CreatePolicySchema) => {
               createPolicy.execute(data);
       };

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="h-[calc(100vh-250px)] scrollbar-hide overflow-auto">
					<div>
						<Accordion type="multiple" defaultValue={["policy"]}>
							<AccordionItem value="policy">
								<AccordionTrigger>
									{t("policies.new.details")}
								</AccordionTrigger>
								<AccordionContent>
									<div className="space-y-4">
										<FormField
											control={form.control}
											name="title"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														{t(
															"policies.new.title",
														)}
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															autoFocus
															className="mt-3"
															placeholder={t(
																"policies.new.title",
															)}
															autoCorrect="off"
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
															"policies.new.description",
														)}
													</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															className="mt-3 min-h-[80px]"
															placeholder={t(
																"policies.new.description",
															)}
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
							disabled={createPolicy.status === "executing"}
						>
							<div className="flex items-center justify-center">
								{t("common.actions.create")}
								<ArrowRightIcon className="ml-2 h-4 w-4" />
							</div>
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
