"use client"

import { SelectUser } from "@/components/select-user";
import { useI18n } from "@/locales/client";
import type { User, Vendor } from "@bubba/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { Label } from "@bubba/ui/label";
import { Separator } from "@bubba/ui/separator";

interface VendorOverviewProps {
  vendor: Vendor & {
    owner: User | null;
  };
  users: User[];
}

export function VendorOverview({ vendor, users }: VendorOverviewProps) {
  const t = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{vendor.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>{t("vendors.form.vendor_description")}</Label>
            <p className="text-sm text-muted-foreground">
              {vendor.description || t("vendors.empty_states.no_results.description")}
            </p>
          </div>
          <Separator />
          <div className="grid gap-2">
            <Label>{t("vendors.form.vendor_category")}</Label>
            <p className="text-sm text-muted-foreground">
              {vendor.category
                .toLowerCase()
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </p>
          </div>
          <Separator />
          <div className="grid gap-2">
            <Label>{t("vendors.form.vendor_status")}</Label>
            <p className="text-sm text-muted-foreground">
              {vendor.status
                .toLowerCase()
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </p>
          </div>
          <Separator />
          <div className="grid gap-2">
            <Label>{t("vendors.table.owner")}</Label>
            {/* <SelectUser
              users={users}
              selectedId={vendor.owner?.id}
              isLoading={false}
              onSelect={() => {}}
            /> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 