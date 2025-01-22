"use client";

import { AssignedUser } from "@/components/assigned-user";
import { useI18n } from "@/locales/client";
import type { User, VendorComment, Vendors } from "@bubba/db";
import { Button } from "@bubba/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { EmptyCard } from "@bubba/ui/empty-card";
import { format } from "date-fns";
import { MessageSquare } from "lucide-react";
import { useQueryState } from "nuqs";
import { VendorCommentSheet } from "../sheets/vendor-comment-sheet";

interface VendorCommentsProps {
  vendor: Vendors & {
    VendorComment: (VendorComment & {
      owner: User;
    })[];
  };
  users: User[];
}

export function VendorComments({ vendor, users }: VendorCommentsProps) {
  const t = useI18n();
  const [open, setOpen] = useQueryState("vendor-comment-sheet");

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between gap-2">
            {t("common.comments.title")}
            <Button variant="outline" onClick={() => setOpen("true")}>
              {t("common.comments.add")}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {vendor.VendorComment.length > 0 ? (
          <div className="flex flex-col gap-2">
            {vendor.VendorComment.map((comment) => (
              <div key={comment.id} className="flex flex-col gap-2 border p-4">
                <div className="flex items-center gap-2">{comment.content}</div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <AssignedUser
                      fullName={comment.owner.name}
                      avatarUrl={comment.owner.image}
                    />
                    <span className="text-sm text-muted-foreground">
                      ({format(comment.createdAt, "MMM d, yyyy")})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyCard
            title={t("common.empty_states.no_items.title")}
            icon={MessageSquare}
            description={t("common.empty_states.no_items.description")}
            className="w-full"
          />
        )}
      </CardContent>

      <VendorCommentSheet vendor={vendor} />
    </Card>
  );
}
