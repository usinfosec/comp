"use client";

import {
  DisplayFrameworkStatus,
  type StatusType,
} from "@/components/frameworks/framework-status";
import { useI18n } from "@/locales/client";
import type { ArtifactType, ComplianceStatus } from "@bubba/db";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export type OrganizationControlType = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  status: ComplianceStatus;
  frameworkId: string;
  category: string;
};

export function columns(): ColumnDef<OrganizationControlType>[] {
  const t = useI18n();

  return [
    {
      id: "name",
      accessorKey: "name",
      header: t("frameworks.controls.table.control"),
      cell: ({ row }) => {
        return (
          <div className="flex flex-col w-[300px]">
            <Link
              href={`/controls/${row.original.id}`}
              className="flex flex-col"
            >
              <span className="font-medium truncate">{row.original.name}</span>
              <span className="text-sm text-muted-foreground truncate">
                {row.original.code}
              </span>
            </Link>
          </div>
        );
      },
    },
    {
      id: "category",
      accessorKey: "category",
      header: t("risk.vendor.table.category"),
      cell: ({ row }) => (
        <div className="w-[200px]">
          <span className="text-sm">{row.original.category}</span>
        </div>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: t("frameworks.controls.table.status"),
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <div className="w-[200px]">
            <DisplayFrameworkStatus
              status={status.toLowerCase() as StatusType}
            />
          </div>
        );
      },
    },
  ];
}
