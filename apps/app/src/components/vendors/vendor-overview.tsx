"use client";

import { useI18n } from "@/locales/client";
import type { User, VendorContact, Vendors } from "@bubba/db";
import { Alert, AlertDescription, AlertTitle } from "@bubba/ui/alert";
import { Button } from "@bubba/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { PencilIcon, ShieldAlert } from "lucide-react";
import { useQueryState } from "nuqs";
import { UpdateVendorForm } from "../forms/vendors/update-vendor-form";
import { VendorOverviewSheet } from "../sheets/vendor-overview-sheet";
import { Icons } from "@bubba/ui/icons";

interface VendorOverviewProps {
  vendor: Vendors & {
    owner: User | null;
    VendorContact: VendorContact[];
  };
  users: User[];
}

export function VendorOverview({ vendor, users }: VendorOverviewProps) {
  const t = useI18n();
  const [open, setOpen] = useQueryState("vendor-overview-sheet");

  return (
    <div className="space-y-4">
      <Alert>
        <Icons.Vendors className="h-4 w-4" />
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
        <AlertDescription className="mt-4">
          {vendor.description}
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-between gap-2">
              {t("risk.vendor.dashboard.overview")}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UpdateVendorForm vendor={vendor} users={users} />
        </CardContent>
      </Card>

      <VendorOverviewSheet vendor={vendor} />
    </div>
  );
}
