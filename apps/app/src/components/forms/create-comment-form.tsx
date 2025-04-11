"use client";

import { addCommentAction } from "@/actions/add-comment";
import { addCommentSchema } from "@/actions/schema";
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
import { Textarea } from "@comp/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function CreateCommentForm({
	entityId,
}: {
	entityId: string;
}) {
	const addComment = useAction(addCommentAction, {
		onSuccess: () => {
			toast.success("Comment added successfully");
			form.reset();
		},
		onError: () => {
			toast.error("Error adding comment");
		},
	});

	const onSubmit = (data: z.infer<typeof addCommentSchema>) => {
		addComment.execute({
			...data,
			entityId,
		});
	};

	const form = useForm<z.infer<typeof addCommentSchema>>({
		resolver: zodResolver(addCommentSchema),
		defaultValues: {
			content: "",
			entityId,
		},
		mode: "onChange",
	});

	const t = useI18n();

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="scrollbar-hide overflow-auto">
					<div>
						<Accordion type="multiple" defaultValue={["comment"]}>
							<AccordionItem value="comment">
								<AccordionTrigger>Comment</AccordionTrigger>
								<AccordionContent>
									<div className="space-y-4">
										<FormField
											control={form.control}
											name="content"
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<Textarea {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="flex justify-end mt-4">
										<Button
											type="submit"
											variant="action"
											disabled={
												addComment.status ===
												"executing"
											}
										>
											<div className="flex items-center justify-center">
												{t("common.actions.create")}
												<ArrowRightIcon className="ml-2 h-4 w-4" />
											</div>
										</Button>
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
				</div>
			</form>
		</Form>
	);
}
