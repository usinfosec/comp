"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Suspense } from "react";

import { cn } from "@bubba/ui/cn";
import { Table, TableBody, TableCell, TableRow } from "@bubba/ui/table";
import { type PersonType, columns as getColumns } from "./columns";
import { DataTableHeader } from "./data-table-header";
import { DataTablePagination } from "./data-table-pagination";
import { Loading } from "./loading";

interface DataTableProps<TData, TValue> {
  columnHeaders: {
    name: string;
    email: string;
    department: string;
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
  const clientColumns = getColumns();
  const columns = clientColumns.map((col) => {
    const columnId = col.id as keyof typeof columnHeaders;
    return {
      ...col,
      header: columnHeaders[columnId],
      accessorFn: (row: any) => row[columnId],
    };
  });

  const table = useReactTable({
    data: data as PersonType[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
  });

  return (
    <div className="w-full overflow-auto">
      <Table>
        <DataTableHeader table={table} />

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn({
                      "hidden md:table-cell":
                        cell.column.id === "email" ||
                        cell.column.id === "department",
                    })}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination pageCount={pageCount} currentPage={currentPage} />
    </div>
  );
}
