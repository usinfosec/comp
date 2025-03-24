"use client";

import { useI18n } from "@/locales/client";
import type { Risk, User, Vendor } from "@bubba/db/types";
import { Alert, AlertDescription, AlertTitle } from "@bubba/ui/alert";
import { Button } from "@bubba/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { Icons } from "@bubba/ui/icons";
import { PencilIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { VendorOverviewSheet } from "./vendor-overview-sheet";
import { UpdateVendorOverview } from "./update-vendor-overview";

export function VendorOverview({
  vendor,
  users,
}: {
  vendor: Vendor & { owner: User | null };
  users: User[];
}) {
  const t = useI18n();
  const [open, setOpen] = useQueryState("vendor-overview-sheet");

  return (
    <div className="space-y-4">
      <Alert>
        <Icons.Risk className="h-4 w-4" />
        <AlertTitle>
          <div className="flex items-center justify-between gap-2">
            {vendor.name}
            <Button
              size="icon"
              variant="ghost"
              className="p-0 m-0 size-auto"
              onClick={() => setOpen("true")}
            >
              <PencilIcon className="h-3 w-3" />
            </Button>
          </div>
        </AlertTitle>
        <AlertDescription className="mt-4">{vendor.description}</AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-between gap-2">
              {t("risk.dashboard.overview")}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UpdateVendorOverview vendor={vendor} users={users} />
        </CardContent>
      </Card>

      <VendorOverviewSheet vendor={vendor} />
    </div>
  );
}
