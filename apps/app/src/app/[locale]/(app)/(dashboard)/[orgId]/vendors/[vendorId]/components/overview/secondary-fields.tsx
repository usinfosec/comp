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
import { UpdateVendorOverview } from "../update-vendor-overview";

export function SecondaryFields({
  vendor,
  users,
}: {
  vendor: Vendor & { owner: User | null };
  users: User[];
}) {
  const t = useI18n();

  return (
    <div className="space-y-4">
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
