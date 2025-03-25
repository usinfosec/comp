"use client";

import { AssignedUser } from "@/components/assigned-user";
import { useI18n } from "@/locales/client";
import type { VendorTask, VendorTaskComment } from "@bubba/db/types";
import { Button } from "@bubba/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { EmptyCard } from "@bubba/ui/empty-card";
import { format } from "date-fns";
import { MessageSquare } from "lucide-react";
import { useQueryState } from "nuqs";
import { TaskCommentSheet } from "./task-comment-sheet";

type FormattedUser = {
  id: string;
  name: string | null;
  image: string | null;
};

export default function Comments({
  task,
  users,
}: {
  task: VendorTask & { 
    comments: (VendorTaskComment & { 
      owner: { 
        name: string | null; 
        image: string | null; 
      } 
    })[] 
  };
  users: FormattedUser[];
}) {
  const [open, setOpen] = useQueryState("task-comment-sheet");
  const t = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {t("common.comments.title")}
            </div>
            <Button variant="action" onClick={() => setOpen("true")}>
              <MessageSquare className="h-4 w-4" />
              {t("common.comments.add")}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {task.comments.length > 0 ? (
          <div className="flex flex-col gap-4">
            {task.comments.map((comment) => (
              <div
                key={comment.id}
                className="group relative flex flex-col gap-3 border bg-card p-4 shadow-sm transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-card-foreground whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <AssignedUser
                    fullName={comment.owner.name}
                    avatarUrl={comment.owner.image}
                    date={format(comment.createdAt, "MMM d yyyy, h:mm a")}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyCard
            title={t("common.comments.empty.title")}
            icon={MessageSquare}
            description={t("common.comments.empty.description")}
            className="w-full"
          />
        )}
      </CardContent>

      <TaskCommentSheet task={task} />
    </Card>
  );
}