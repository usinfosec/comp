"use client";

import { useI18n } from "@/locales/client";
import type { User, Vendors } from "@bubba/db";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@bubba/ui/sheet";
import { useQueryState } from "nuqs";
import { UpdateVendorOverviewForm } from "../forms/vendors/update-vendor-overview-form";

interface VendorOverviewSheetProps {
  vendor: Vendors & {
    owner: User | null;
  };
}

export function VendorOverviewSheet({ vendor }: VendorOverviewSheetProps) {
  const t = useI18n();
  const [open, setOpen] = useQueryState("vendor-overview-sheet");

  return (
    <Sheet
      open={open === "true"}
      onOpenChange={(value) => setOpen(value ? "true" : null)}
    >
      <SheetContent className="w-full sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>{t("risk.vendor.form.update_vendor")}</SheetTitle>
        </SheetHeader>
        <div className="mt-8">
          <UpdateVendorOverviewForm vendor={vendor} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
