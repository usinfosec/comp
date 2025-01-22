"use client";

import { AssignedUser } from "@/components/assigned-user";
import { VendorStatus } from "@/components/vendor-status";
import { useI18n } from "@/locales/client";
import type { Vendors } from "@bubba/db";
import { Badge } from "@bubba/ui/badge";
import { Button } from "@bubba/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export type VendorRegisterType = Vendors & {
  owner: {
    name: string | null;
    image: string | null;
  } | null;
};

export function columns(): ColumnDef<VendorRegisterType>[] {
  const t = useI18n();

  return [
    {
      id: "name",
      accessorKey: "name",
      header: t("risk.vendor.table.name"),
      cell: ({ row }) => {
        return (
          <span className="truncate">
            <Button variant="link" className="p-0" asChild>
              <Link href={`/vendors/${row.original.id}`}>
                {row.getValue("name")}
              </Link>
            </Button>
          </span>
        );
      },
    },
    {
      id: "status",
      accessorKey: "status",
      header: t("risk.vendor.table.status"),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <VendorStatus status={row.getValue("status")} />
          </div>
        );
      },
    },
    {
      id: "category",
      accessorKey: "category",
      header: t("risk.vendor.table.category"),
      cell: ({ row }) => {
        const category = row.original.category;

        if (!category) {
          return <span className="hidden sm:table-cell">—</span>;
        }

        return (
          <div className="hidden sm:table-cell">
            <Badge variant="secondary">
              {category.replace(/_/g, " ").toUpperCase()}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "owner",
      accessorKey: "owner",
      header: t("risk.vendor.table.owner"),
      cell: ({ row }) => {
        const owner = row.original.owner;
        return (
          <div className="hidden sm:table-cell">
            <AssignedUser fullName={owner?.name} avatarUrl={owner?.image} />
          </div>
        );
      },
    },
  ];
}
