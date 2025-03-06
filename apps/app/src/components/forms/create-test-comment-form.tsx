"use client";

import { createTestCommentAction } from "@/app/[locale]/(app)/(dashboard)/tests/[testId]/actions/createTestComment";
import { createTestCommentSchema } from "@/app/[locale]/(app)/(dashboard)/tests/[testId]/actions/types";
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
import { ArrowRightIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useParams } from "next/navigation";
import { useQueryState } from "nuqs";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

export function CreateTestCommentForm() {
  const t = useI18n();
  const [_, setTestCommentSheet] = useQueryState("test-comment-sheet");
  const params = useParams<{ testId: string }>();

  const createPolicyComment = useAction(createTestCommentAction, {
    onSuccess: () => {
      toast.success(t("common.comments.success"));
      setTestCommentSheet(null);
    },
    onError: () => {
      toast.error(t("common.comments.error"));
    },
  });

  const form = useForm<z.infer<typeof createTestCommentSchema>>({
    resolver: zodResolver(createTestCommentSchema),
    defaultValues: {
      content: "",
      testId: params.testId,
    },
  });

  const onSubmit = (data: z.infer<typeof createTestCommentSchema>) => {
    createPolicyComment.execute(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="h-[calc(100vh-250px)] scrollbar-hide overflow-auto">
          <div>
            <Accordion type="multiple" defaultValue={["policy"]}>
              <AccordionItem value="policy">
                <AccordionTrigger>{t("common.comments.new")}</AccordionTrigger>
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
              disabled={createPolicyComment.status === "executing"}
            >
              <div className="flex items-center justify-center">
                {t("common.comments.save")}
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </div>
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}