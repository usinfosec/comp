"use client";

import type { Table } from "@tanstack/react-table";
import { TableHead, TableHeader, TableRow } from "@bubba/ui/table";
import type { EvidenceTaskRow } from "./types";

export function DataTableHeader({ table }: { table: Table<EvidenceTaskRow> }) {
  return (
    <TableHeader>
      <TableRow>
        {table.getAllColumns().map((column) => (
          <TableHead key={column.id} className="p-4">
            {column.columnDef.header as string}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
