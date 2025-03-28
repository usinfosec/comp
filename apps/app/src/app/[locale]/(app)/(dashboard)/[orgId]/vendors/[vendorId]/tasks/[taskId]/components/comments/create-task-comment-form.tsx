"use client";

import { createTaskCommentAction } from "../../../../actions/task/create-task-comment";
import { createVendorTaskCommentSchema } from "../../../../actions/schema";
import { useI18n } from "@/locales/client";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import { useQueryState } from "nuqs";
import type { VendorTask, VendorTaskComment } from "@bubba/db/types";
import type { z } from "zod";
import { Button } from "@bubba/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@bubba/ui/form";
import { Textarea } from "@bubba/ui/textarea";
import { toast } from "sonner";

type TaskWithComments = VendorTask & { 
  comments: (VendorTaskComment & { 
    owner: { 
      name: string | null; 
      image: string | null; 
    } 
  })[] 
};

export function CreateTaskCommentForm({
  task,
}: {
  task: TaskWithComments;
}) {
  const t = useI18n();
  const params = useParams<{ vendorId: string; taskId: string }>();
  const [_, setTaskCommentSheet] = useQueryState("task-comment-sheet");

  const createComment = useAction(createTaskCommentAction, {
    onSuccess: () => {
      toast.success(t("common.comments.success"));
      setTaskCommentSheet(null);
      form.reset();
    },
    onError: () => {
      toast.error(t("common.comments.error"));
    },
  });

  const form = useForm<z.infer<typeof createVendorTaskCommentSchema>>({
    resolver: zodResolver(createVendorTaskCommentSchema),
    defaultValues: {
      vendorId: params.vendorId,
      vendorTaskId: params.taskId,
      content: "",
    },
  });

  const onSubmit = (data: z.infer<typeof createVendorTaskCommentSchema>) => {
    createComment.execute(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder={t("common.comments.placeholder")}
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={createComment.status === "executing"}
          >
            {t("common.comments.save")}
          </Button>
        </div>
      </form>
    </Form>
  );
} 