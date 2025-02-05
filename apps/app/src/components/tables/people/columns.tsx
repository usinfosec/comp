"use client";
import { useI18n } from "@/locales/client";
import type { Departments } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";

export interface PersonType {
  id: string;
  name: string;
  email: string;
  department: Departments;
}

export function columns(): ColumnDef<PersonType>[] {
  const t = useI18n();

  return [
    {
      id: "email",
      accessorKey: "email",
      header: t("people.table.email"),
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span>{row.getValue("email")}</span>
        </div>
      ),
    },
    {
      id: "name",
      accessorKey: "name",
      header: t("people.table.name"),
      cell: ({ row }) => (
        <div>
          <span>{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      id: "department",
      accessorKey: "department",
      header: t("people.table.department"),
      cell: ({ row }) => (
        <div className="hidden md:table-cell">{row.getValue("department")}</div>
      ),
    },
  ];
}
