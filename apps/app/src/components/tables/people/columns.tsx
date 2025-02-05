"use client";
import { useI18n } from "@/locales/client";
import { Button } from "@bubba/ui/button";
import type { Departments } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

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
      id: "name",
      accessorKey: "name",
      header: t("people.table.name"),
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-1">
            <Button variant="link" className="p-0 justify-start" asChild>
              <Link href={`/people/${row.original.id}`}>
                <span className="truncate">{row.original.name}</span>
              </Link>
            </Button>
          </div>
        );
      },
    },
    {
      id: "email",
      accessorKey: "email",
      header: () => (
        <span className="hidden md:table-cell">{t("people.table.email")}</span>
      ),
      cell: ({ row }) => {
        return (
          <div className="hidden md:table-cell">
            <span>{row.original.email}</span>
          </div>
        );
      },
    },
    {
      id: "department",
      accessorKey: "department",
      header: () => (
        <span className="hidden md:table-cell">
          {t("people.table.department")}
        </span>
      ),
      cell: ({ row }) => {
        return (
          <div className="hidden md:table-cell">{row.original.department}</div>
        );
      },
    },
  ];
}
