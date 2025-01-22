"use client";

import { updateVendorRiskAction } from "@/actions/vendor/update-vendor-risk-action";
import { useI18n } from "@/locales/client";
import type { Vendors } from "@bubba/db";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { cn } from "@bubba/ui/cn";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@bubba/ui/select";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

interface VendorAssessmentProps {
  vendor: Vendors;
}

export function VendorAssessment({ vendor }: VendorAssessmentProps) {
  const t = useI18n();

  const updateRisk = useAction(updateVendorRiskAction, {
    onSuccess: () => {
      toast.success(t("risk.vendor.assessment.update_success"));
    },
    onError: () => {
      toast.error(t("risk.vendor.assessment.update_error"));
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("risk.vendor.assessment.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            {t("risk.vendor.assessment.inherent_risk")}
            <Select
              value={vendor.inherent_risk}
              onValueChange={(value) =>
                updateRisk.execute({
                  id: vendor.id,
                  inherent_risk: value as "low" | "medium" | "high" | "unknown",
                })
              }
            >
              <SelectTrigger
                className={cn(
                  "mt-2",
                  vendor.inherent_risk === "high" && "text-destructive",
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  {t("risk.vendor.risk_level.low")}
                </SelectItem>
                <SelectItem value="medium">
                  {t("risk.vendor.risk_level.medium")}
                </SelectItem>
                <SelectItem value="high" className="text-destructive">
                  {t("risk.vendor.risk_level.high")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            {t("risk.vendor.assessment.residual_risk")}
            <Select
              value={vendor.residual_risk}
              onValueChange={(value) =>
                updateRisk.execute({
                  id: vendor.id,
                  residual_risk: value as "low" | "medium" | "high" | "unknown",
                })
              }
            >
              <SelectTrigger
                className={cn(
                  "mt-2",
                  vendor.residual_risk === "high" && "text-destructive",
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  {t("risk.vendor.risk_level.low")}
                </SelectItem>
                <SelectItem value="medium">
                  {t("risk.vendor.risk_level.medium")}
                </SelectItem>
                <SelectItem value="high" className="text-destructive">
                  {t("risk.vendor.risk_level.high")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
