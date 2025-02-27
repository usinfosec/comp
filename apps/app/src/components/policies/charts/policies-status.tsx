"use client";

import { PieChart } from "@/components/ui/pie-chart";
import { COLORS } from "@/constants/colors";
import { useI18n } from "@/locales/client";
import type {
  Framework,
  OrganizationControl,
  OrganizationFramework,
  OrganizationPolicy,
} from "@bubba/db";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { cn } from "@bubba/ui/cn";

interface Props {
  totalPolicies: number;
  publishedPolicies: number;
  draftPolicies: number;
  archivedPolicies: number;
}

export function PoliciesStatus({
  totalPolicies,
  publishedPolicies,
  draftPolicies,
  archivedPolicies,
}: Props) {
  const t = useI18n();

  const statusCounts = {
    published: publishedPolicies,
    draft: draftPolicies,
    archived: archivedPolicies,
  };

  const data = [
    {
      name: t("policies.status.published"),
      value: statusCounts.published,
      color: "var(--chart-closed)",
      colorClass: "bg-[var(--chart-closed)]",
    },
    {
      name: t("policies.status.draft"),
      value: statusCounts.draft,
      color: "var(--chart-open)",
      colorClass: "bg-[var(--chart-open)]",
    },
    {
      name: t("policies.status.archived"),
      value: statusCounts.archived,
      color: "var(--chart-pending)",
      colorClass: "bg-[var(--chart-pending)]",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("policies.dashboard.policy_status")}</CardTitle>
      </CardHeader>
      <CardContent>
        <PieChart data={data} />
        <div className="mt-4 2xl:grid 2xl:grid-cols-3 gap-4 text-sm">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className={cn("h-3 w-3", item.colorClass)} />
              <span>{item.name}</span>
              <span className="ml-auto font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
