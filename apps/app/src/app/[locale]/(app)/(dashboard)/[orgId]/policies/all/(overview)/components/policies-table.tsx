"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { getPolicies } from "../data/queries";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { getPolicyColumns } from "./policies-table-columns";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

interface PoliciesTableProps {
  promises: Promise<[
    Awaited<ReturnType<typeof getPolicies>>
  ]>;
}

export function PoliciesTable({ promises }: PoliciesTableProps) {
  const [{ data, pageCount }] = React.use(promises);

  const columns = React.useMemo(() => getPolicyColumns(), []);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <>
      <DataTable
        table={table}
      >
        <DataTableToolbar table={table}>
          <DataTableSortList table={table} align="end" />
        </DataTableToolbar>
      </DataTable>
    </>
  );
}