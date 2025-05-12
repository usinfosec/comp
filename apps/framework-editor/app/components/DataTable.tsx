'use client'

import { useMemo, type ElementType } from 'react'
import { useQueryState } from 'nuqs'
import { Input } from "@comp/ui/input";
import { Button } from "@comp/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@comp/ui/table";
import { Search, PlusCircle, TableIcon } from 'lucide-react';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type SortingState,
  getSortedRowModel,
} from '@tanstack/react-table'
import React from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchQueryParamName?: string;
  onCreateClick?: () => void;
  createButtonLabel?: string;
  CreateButtonIcon?: ElementType;
  onRowClick?: (rowData: TData) => void;
  searchPlaceholder?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchQueryParamName = 'q',
  onCreateClick,
  createButtonLabel = "Create New",
  CreateButtonIcon = PlusCircle,
  onRowClick,
  searchPlaceholder = "Search table...",
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useQueryState(searchQueryParamName, {
    defaultValue: ''
  });
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter: globalFilter ?? '',
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  })

  const searchTerm = globalFilter ?? '';
  const { rows } = table.getRowModel();

  // Memoize filtered data for "No results" message logic
  const hasFilteredResults = useMemo(() => {
    if (!searchTerm) return data.length > 0;
    if (!data) return false;

    return data.some(item =>
      columns.some(colDef => {
        const column = colDef as any;
        let cellValueString = '';
        if (typeof column.accessorFn === 'function') {
          const cellValue = column.accessorFn(item, 0);
          cellValueString = String(cellValue);
        } else if (column.accessorKey) {
          cellValueString = String(item[column.accessorKey as keyof TData]);
        }
        return cellValueString.toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);


  if (!data || (data.length === 0 && !searchTerm)) {
    return (
      <div className="bg-card p-4 rounded-sm flex flex-col items-center justify-center py-16 text-center space-y-4" id="no-data-available">
        <div className="rounded-full bg-muted p-3 w-12 h-12 flex items-center justify-center mx-auto">
          <TableIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-medium">No data available</h3>
          <p className="text-sm text-muted-foreground mt-1">Get started by creating your first entry.</p>
        </div>
        {onCreateClick && (
          <Button onClick={onCreateClick} variant="outline">
            <CreateButtonIcon className="mr-2 h-4 w-4" />
            {createButtonLabel}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center gap-2">
        <Input
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={e => setGlobalFilter(e.target.value || null)}
          className="w-full"
          leftIcon={<Search className="h-4 w-4 text-muted-foreground" />}
        />
        {onCreateClick && (
          <Button variant="outline" className="ml-auto" onClick={onCreateClick}>
            <CreateButtonIcon className="mr-2 h-4 w-4" />
            {createButtonLabel}
          </Button>
        )}
      </div>
      {rows.length > 0 ? (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id} colSpan={header.colSpan} style={{ width: header.getSize() }}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {rows.map(row => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => onRowClick && onRowClick(row.original as TData)}
                    className={`group ${onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}`.trim()}
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
      ) : (
        searchTerm && !hasFilteredResults && data.length > 0 ? (
           <p className="py-4 text-center">No results found for "{searchTerm}".</p>
        ) : (
          !searchTerm && data.length === 0 && <p className="py-4 text-center">No data available.</p>
        )
      )}
    </div>
  );
} 