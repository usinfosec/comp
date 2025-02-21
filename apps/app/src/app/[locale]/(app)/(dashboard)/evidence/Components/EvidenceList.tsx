"use client";

import { useOrganizationEvidenceTasks } from "../hooks/useEvidenceTasks";
import { DataTable } from "./data-table/data-table";
import { Input } from "@bubba/ui/input";
import { useQueryState } from "nuqs";
import { useCallback } from "react";
import { debounce } from "lodash";
import { useI18n } from "@/locales/client";
import { SkeletonTable } from "./SkeletonTable";

export const EvidenceList = () => {
  const t = useI18n();
  const [search, setSearch] = useQueryState("search");
  const {
    data: evidenceTasks,
    isLoading,
    error,
  } = useOrganizationEvidenceTasks({ search });

  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearch(value || null);
    }, 300),
    [setSearch]
  );

  if (error) return <div>Error loading evidence tasks</div>;
  if (!evidenceTasks && !isLoading) return null;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Review and upload evidence</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder={t("common.filters.search")}
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={search || ""}
            className="max-w-sm"
          />
        </div>
      </div>
      {isLoading ? <SkeletonTable /> : <DataTable data={evidenceTasks || []} />}
    </div>
  );
};
