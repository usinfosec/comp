"use client";

import { TableHead, TableHeader, TableRow } from "@bubba/ui/table";

type Props = {
  table?: {
    getIsAllPageRowsSelected: () => boolean;
    getIsSomePageRowsSelected: () => boolean;
    getAllLeafColumns: () => {
      id: string;
      getIsVisible: () => boolean;
    }[];
    toggleAllPageRowsSelected: (value: boolean) => void;
  };
  loading?: boolean;
};

export function DataTableHeader({ table, loading }: Props) {
  const isVisible = (id: string) =>
    loading ||
    table
      ?.getAllLeafColumns()
      .find((col) => col.id === id)
      ?.getIsVisible();

  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent">
        {isVisible("type") && (
          <TableHead className="h-11 px-4 text-left align-middle font-medium">
            Type
          </TableHead>
        )}
        {isVisible("description") && (
          <TableHead className="h-11 px-4 text-left align-middle font-medium">
            Description
          </TableHead>
        )}
        {isVisible("status") && (
          <TableHead className="h-11 px-4 text-left align-middle font-medium">
            Status
          </TableHead>
        )}
      </TableRow>
    </TableHeader>
  );
}
