"use client";

import { useQueryState } from "nuqs";
import { useI18n } from "@/locales/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@bubba/ui/sheet";
import { CreateTaskCommentForm } from "./create-task-comment-form";
import type { VendorTask, VendorTaskComment } from "@bubba/db/types";

type TaskWithComments = VendorTask & { 
  comments: (VendorTaskComment & { 
    owner: { 
      name: string | null; 
      image: string | null; 
    } 
  })[] 
};

export function TaskCommentSheet({
  task,
}: {
  task: TaskWithComments;
}) {
  const [open, setOpen] = useQueryState("task-comment-sheet");
  const t = useI18n();

  return (
    <Sheet open={open === "true"} onOpenChange={(isOpen) => setOpen(isOpen ? "true" : null)}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t("common.comments.add")}</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <CreateTaskCommentForm task={task} />
        </div>
      </SheetContent>
    </Sheet>
  );
} 