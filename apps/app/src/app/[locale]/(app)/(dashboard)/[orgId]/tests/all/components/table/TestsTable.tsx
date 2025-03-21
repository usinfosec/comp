"use client";

import { DataTable } from "@/components/ui/data-table";
import { useParams, useRouter } from "next/navigation";
import { getFilterCategories } from "./filterCategories";
import { getColumns } from "./columns";
import type { TestsTableProps } from "../../types";
import { useTestsTable } from "../../hooks/useTestsTableContext";
import { RefreshCcw } from "lucide-react";
import { refreshTestsAction } from "../../actions/refreshTests";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { useI18n } from "@/locales/client";

export function TestsTable({ users }: TestsTableProps) {
  const router = useRouter();
  const { orgId } = useParams<{ orgId: string }>();
  const t = useI18n();
  
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    tests,
    total,
    search,
    setSearch,
    status,
    setStatus,
    provider,
    setProvider,
    hasActiveFilters,
    clearFilters,
    isLoading,
    isSearching,
  } = useTestsTable();

  const refreshTests = useAction(refreshTestsAction, {
    onSuccess: () => {
      toast.success(t("tests.actions.refresh_success"));
      window.location.reload();
    },
    onError: () => {
      toast.error(t("tests.actions.refresh_error"));
    },
  });

  const handleRowClick = (testId: string) => {
    router.replace(`/${orgId}/tests/all/${testId}`);
  };

  const activeFilterCount = [status, provider].filter(Boolean).length;

  const filterCategories = getFilterCategories({
    status,
    setStatus,
    severity: provider,
    setSeverity: setProvider,
    setPage,
  });

  // Calculate pagination values only when total is defined
  const pagination =
    total !== undefined
      ? {
          page: Number(page),
          pageSize: Number(pageSize),
          totalCount: total,
          totalPages: Math.ceil(total / Number(pageSize)),
          hasNextPage: Number(page) * Number(pageSize) < total,
          hasPreviousPage: Number(page) > 1,
        }
      : undefined;

  return (
    <DataTable
      data={tests || []}
      columns={getColumns(handleRowClick)}
      onRowClick={(row) => handleRowClick(row.id)}
      emptyMessage="No tests found."
      isLoading={isLoading || isSearching}
      pagination={pagination}
      onPageChange={(page) => setPage(page.toString())}
      onPageSizeChange={(pageSize) => setPageSize(pageSize.toString())}
      search={{
        value: search || "",
        onChange: setSearch,
        placeholder: "Search tests...",
      }}
      filters={{
        categories: filterCategories,
        hasActiveFilters,
        onClearFilters: clearFilters,
        activeFilterCount,
      }}
      ctaButton={{
        label: "Refresh Tests",
        onClick: () => refreshTests.execute(),
        icon: <RefreshCcw className="h-4 w-4" />,
      }}
    />
  );
}