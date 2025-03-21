"use client";

import { useI18n } from "@/locales/client";
import { Button } from "@bubba/ui/button";
import { Card } from "@bubba/ui/card";
import { XIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function NoResults({ hasFilters }: { hasFilters: boolean }) {
  const t = useI18n();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Card className="flex flex-col items-center justify-center p-8 space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("vendors.tasks.empty.no_results")}
        </h1>
        <p className="text-muted-foreground">
          {t("vendors.tasks.empty.no_results_description")}
        </p>
      </div>

      {hasFilters && (
        <Button
          variant="outline"
          onClick={() => router.push(pathname)}
          className="gap-2"
        >
          <XIcon className="h-4 w-4" />
          {t("vendors.tasks.empty.clear_filters")}
        </Button>
      )}
    </Card>
  );
}

export function NoTasks({ isEmpty }: { isEmpty: boolean }) {
  const t = useI18n();

  return (
    <Card className="flex flex-col items-center justify-center p-8 space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("vendors.tasks.empty.no_tasks")}
        </h1>
        <p className="text-muted-foreground">
          {t("vendors.tasks.empty.no_tasks_description")}
        </p>
      </div>
    </Card>
  );
} 