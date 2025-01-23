"use client";
import { AssignedUser } from "@/components/assigned-user";
import { Status, type StatusType } from "@/components/status";
import { StatusDate } from "@/components/status-date";
import { useI18n } from "@/locales/client";
import type { RiskTaskStatus } from "@bubba/db";
import { Button } from "@bubba/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export type RiskTaskType = {
  id: string;
  riskId: string;
  title: string;
  status: RiskTaskStatus;
  dueDate: string;
  ownerId: string;
  owner: {
    image: string;
    name: string;
  };
};

export function columns(): ColumnDef<RiskTaskType>[] {
  const t = useI18n();

  return [
    {
      id: "title",
      accessorKey: "title",
      header: t("risk.tasks.title"),
      cell: ({ row }) => {
        return (
          <span className="truncate">
            <Button variant="link" className="p-0" asChild>
              <Link
                href={`/risk/${row.original.riskId}/tasks/${row.original.id}`}
              >
                {row.original.title}
              </Link>
            </Button>
          </span>
        );
      },
    },
    {
      id: "status",
      accessorKey: "status",
      header: t("common.table.status"),
      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <div className="flex items-center gap-2">
            <Status status={status.toLowerCase() as StatusType} />
          </div>
        );
      },
    },
    {
      id: "dueDate",
      accessorKey: "dueDate",
      header: () => (
        <span className="hidden sm:table-cell">
          {t("common.table.due_date")}
        </span>
      ),
      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <div className="hidden sm:table-cell">
            <StatusDate
              date={new Date(row.original.dueDate)}
              isClosed={status === "closed"}
            />
          </div>
        );
      },
    },
    {
      id: "ownerId",
      accessorKey: "ownerId",
      header: () => (
        <span className="hidden sm:table-cell">
          {t("common.table.assigned_to")}
        </span>
      ),
      cell: ({ row }) => {
        return (
          <div className="hidden sm:table-cell">
            <AssignedUser
              fullName={row.original.owner?.name}
              avatarUrl={row.original.owner?.image}
            />
          </div>
        );
      },
    },
  ];
}
