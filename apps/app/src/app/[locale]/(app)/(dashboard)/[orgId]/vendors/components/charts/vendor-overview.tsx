"use server";

import { getI18n } from "@/locales/server";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { VendorsByCategory } from "./vendors-by-category";
import { VendorsByStatus } from "./vendors-by-status";

interface VendorOverviewProps {
  organizationId: string;
}

export async function VendorOverview({ organizationId }: VendorOverviewProps) {
  const t = await getI18n();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-between gap-2">
              {t("vendors.dashboard.title")}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="w-full h-full">
              <VendorsByStatus organizationId={organizationId} />
            </div>
            <div className="w-full h-full">
              <VendorsByCategory organizationId={organizationId} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}