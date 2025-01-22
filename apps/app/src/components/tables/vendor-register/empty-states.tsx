"use client";

import { CreateVendorSheet } from "@/components/sheets/create-vendor-sheet";
import { useI18n } from "@/locales/client";
import { Button } from "@bubba/ui/button";
import { Icons } from "@bubba/ui/icons";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";

export function NoVendors() {
  const t = useI18n();
  const router = useRouter();

  const [open, setOpen] = useQueryState("create-vendor-sheet");

  return (
    <div className="mt-24 absolute w-full top-0 left-0 flex items-center justify-center z-20">
      <div className="text-center max-w-sm mx-auto flex flex-col items-center justify-center">
        <h2 className="text-xl font-medium mb-2">
          {t("risk.vendor.empty_states.no_vendors.title")}
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          {t("risk.vendor.empty_states.no_vendors.description")}
        </p>
        <Button onClick={() => setOpen("true")} className="hidden sm:flex">
          <Plus className="h-4 w-4 mr-2" />
          {t("common.actions.create")}
        </Button>
      </div>

      <CreateVendorSheet />
    </div>
  );
}

export function NoResults({ hasFilters }: { hasFilters: boolean }) {
  const t = useI18n();
  const router = useRouter();

  return (
    <div className="mt-24 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <Icons.Transactions2 className="mb-4" />
        <div className="text-center mb-6 space-y-2">
          <h2 className="font-medium text-lg">
            {t("risk.vendor.empty_states.no_results.title")}
          </h2>
          <p className="text-muted-foreground text-sm">
            {hasFilters
              ? t(
                  "risk.vendor.empty_states.no_results.description_with_filters",
                )
              : t("risk.vendor.empty_states.no_results.description")}
          </p>
        </div>

        {hasFilters && (
          <Button variant="outline" onClick={() => router.push("/vendors")}>
            {t("common.actions.clear")}
          </Button>
        )}
      </div>
    </div>
  );
}
