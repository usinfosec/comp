"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@bubba/ui/cn";
import { Table, TableBody, TableCell, TableRow } from "@bubba/ui/table";
import { type TestType, columns as getColumns } from "./columns";
import { DataTableHeader } from "./data-table-header";
import { DataTablePagination } from "./data-table-pagination";
import { Loading } from "./loading";

interface DataTableProps<TData, TValue> {
  columnHeaders: {
    severity: string;
    result: string;
    title: string;
    provider: string;
    createdAt: string;
    assignedUser: string;
  };
  data: TData[];
  pageCount: number;
  currentPage: number;
}

export function DataTable<TData, TValue>({
  columnHeaders,
  data,
  pageCount,
  currentPage,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const { orgId } = useParams<{ orgId: string }>();
  const clientColumns = getColumns();
  const columns = clientColumns.map((col) => ({
    ...col,
    header: columnHeaders[col.id as keyof typeof columnHeaders],
  }));

  const table = useReactTable({
    data: data as TestType[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
  });

  return (
    <Suspense fallback={<Loading isEmpty={false} />}>
      <div className="w-full overflow-auto">
        <Table>
          <DataTableHeader table={table} />

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    const test = row.original;
                    router.push(`/${orgId}/tests/all/${test.id}`);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        (cell.column.id === "severity" ||
                          cell.column.id === "result" ||
                          cell.column.id === "provider" ||
                          cell.column.id === "createdAt" ||
                          cell.column.id === "assignedUser") &&
                          "hidden md:table-cell",
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <DataTablePagination pageCount={pageCount} currentPage={currentPage} />
      </div>
    </Suspense>
  );
}
