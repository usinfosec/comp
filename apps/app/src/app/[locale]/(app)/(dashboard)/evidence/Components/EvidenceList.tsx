"use client";

import { DataTable } from "./data-table/EvidenceListTable";
import { useI18n } from "@/locales/client";
import { SkeletonTable } from "./SkeletonTable";
import {
  FilterDropdown,
  ActiveFilterBadges,
  PaginationControls,
  SearchInput,
} from "./EvidenceFilters";
import { useEvidenceTable } from "../hooks/useEvidenceTableContext";
import { EvidenceSummaryCards } from "./EvidenceSummaryCards";

export function EvidenceList() {
  const t = useI18n();
  const { evidenceTasks = [], isLoading, error } = useEvidenceTable();

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Evidence Tasks</h1>

        {/* Summary Cards - handles its own loading state */}
        <EvidenceSummaryCards />

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="w-full max-w-sm">
            <SearchInput placeholder={t("common.filters.search")} />
          </div>

          {/* Filter Dropdown */}
          <FilterDropdown />

          {/* Active Filter Badges */}
          <ActiveFilterBadges />
        </div>
      </div>

      {isLoading ? (
        <SkeletonTable />
      ) : (
        <>
          {evidenceTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No evidence tasks found. Try adjusting your filters.
            </div>
          ) : (
            <DataTable data={evidenceTasks} />
          )}

          {/* Pagination Controls */}
          <PaginationControls />
        </>
      )}
    </div>
  );
}
