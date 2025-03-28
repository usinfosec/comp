"use client";

import { useI18n } from "@/locales/client";
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
  FormMessage,
} from "@bubba/ui/form";
import { Textarea } from "@bubba/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { createVendorCommentAction } from "../../actions/create-vendor-comment";
import { createVendorCommentSchema } from "../../actions/schema";

export function CreateVendorCommentForm() {
  const t = useI18n();
  const [_, setCreateVendorCommentSheet] = useQueryState("vendor-comment-sheet");
  const params = useParams<{ vendorId: string }>();

  const createVendorComment = useAction(createVendorCommentAction, {
    onSuccess: () => {
      toast.success(t("common.comments.success"));
      setCreateVendorCommentSheet(null);
    },
    onError: () => {
      toast.error(t("common.comments.error"));
    },
  });

  const form = useForm<z.infer<typeof createVendorCommentSchema>>({
    resolver: zodResolver(createVendorCommentSchema),
    defaultValues: {
      content: "",
      vendorId: params.vendorId,
    },
  });

  const onSubmit = (data: z.infer<typeof createVendorCommentSchema>) => {
    createVendorComment.execute(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="h-[calc(100vh-250px)] scrollbar-hide overflow-auto">
          <div>
            <Accordion type="multiple" defaultValue={["task"]}>
              <AccordionItem value="task">
                {t("common.comments.new")}
                <AccordionContent>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              {...field}
                              autoFocus
                              className="mt-3"
                              placeholder={t("common.comments.placeholder")}
                              autoCorrect="off"
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
              variant="action"
              disabled={createVendorComment.status === "executing"}
            >
              <div className="flex items-center justify-center">
                {t("common.actions.save")}
              </div>
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
