"use client";

import { useI18n } from "@/locales/client";
import type { User, VendorComment, Vendors } from "@bubba/db";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@bubba/ui/sheet";
import { useQueryState } from "nuqs";
import { CreateVendorCommentForm } from "../forms/vendors/create-vendor-comment-form";

interface VendorCommentSheetProps {
  vendor: Vendors & {
    VendorComment: (VendorComment & {
      owner: User;
    })[];
  };
}

export function VendorCommentSheet({ vendor }: VendorCommentSheetProps) {
  const t = useI18n();
  const [open, setOpen] = useQueryState("vendor-comment-sheet");

  return (
    <Sheet
      open={open === "true"}
      onOpenChange={(value) => setOpen(value ? "true" : null)}
    >
      <SheetContent className="w-full sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>{t("risk.vendor.form.add_comment")}</SheetTitle>
        </SheetHeader>
        <div className="mt-8">
          <CreateVendorCommentForm vendor={vendor} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
