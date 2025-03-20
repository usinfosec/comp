"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { TestRow, TestResult, TestSeverity } from "./types";
import { Badge } from "@bubba/ui/badge";
import Image from "next/image";
import { integrations } from "@bubba/integrations";
import { AssignedUser } from "@/components/assigned-user";

const getSeverityBadge = (severity: TestSeverity) => {
  if (!severity) return <Badge>Unknown</Badge>;
  
  switch(severity) {
    case "LOW":
      return <Badge className="bg-muted-foreground">{severity}</Badge>;
    case "MEDIUM":
      return <Badge className="bg-white">{severity}</Badge>;
    case "HIGH":
      return <Badge className="bg-blue-500">{severity}</Badge>;
    case "CRITICAL":
      return <Badge className="bg-red-500">{severity}</Badge>;
    default:
      return <Badge>{severity}</Badge>;
  }
};

const getResultsBadge = (result: TestResult) => {
  switch(result) {
    case "PASSED":
      return <Badge className="bg-green-500">{result}</Badge>;
    case "IN_PROGRESS":
      return <Badge className="bg-yellow-500">{result}</Badge>;
    case "FAILED":
      return <Badge className="bg-red-500">{result}</Badge>;
    default:
      return <Badge>{result}</Badge>;
  }
};

const getProviderLogo = (provider: string): string => {
  const integration = integrations.find((i) => i.id === provider);
  return typeof integration?.logo === 'string' ? integration.logo : '';
};

export function getColumns(
  handleRowClick: (testId: string) => void,
): ColumnDef<TestRow>[] {
  return [
    {
      id: "severity",
      header: "Severity",
      accessorKey: "severity",
      cell: ({ row }) => {
        return getSeverityBadge(row.original.severity);
      },
    },
    {
      id: "result",
      header: "Result",
      accessorKey: "result",
      cell: ({ row }) => {
        return getResultsBadge(row.original.result);
      },
    },
    {
      id: "title",
      header: "Title",
      accessorKey: "title",
      cell: ({ row }) => {
        const title = row.original.title;
        return (
          <div className="flex flex-col gap-1">
            <button
              type="button"
              className="text-left hover:underline"
              onClick={() => handleRowClick(row.original.id)}
            >
              <span className="truncate">{title}</span>
            </button>
          </div>
        );
      },
    },
    {
      id: "provider",
      header: "Provider",
      accessorKey: "provider",
      cell: ({ row }) => {
        const provider = row.original.provider;
        const logo = getProviderLogo(provider);
        
        return (
          <div className="flex items-center gap-2">
            {logo && (
              <Image 
                src={logo} 
                alt={provider} 
                width={20} 
                height={20} 
                className="rounded-sm"
              />
            )}
            <span>{provider}</span>
          </div>
        );
      },
    },
    {
      id: "createdAt",
      header: "Created",
      accessorKey: "createdAt",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return (
          <div className="text-muted-foreground">
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        );
      },
    },
    {
      id: "assignedUser",
      header: "Assigned To",
      accessorKey: "assignedUser",
      cell: ({ row }) => {
        const assignedUser = row.original.assignedUser;
        if (!assignedUser) {
          return (
            <span className="text-muted-foreground text-sm">
              Not assigned
            </span>
          );
        }
        return (
          <AssignedUser
            avatarUrl={assignedUser.image}
            fullName={assignedUser.name}
          />
        );
      },
    },
  ];
} 