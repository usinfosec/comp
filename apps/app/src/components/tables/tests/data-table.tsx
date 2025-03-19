"use client";

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

import { useI18n } from "@/locales/client";
import { Button } from "@bubba/ui/button";
import { cn } from "@bubba/ui/cn";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@bubba/ui/table";
import { Badge } from "@bubba/ui/badge";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import type { TestType } from "./columns";
import { DataTableHeader } from "./data-table-header";
import { DataTablePagination } from "./data-table-pagination";
import { AssignedUser } from "@/components/assigned-user";

import { integrations } from "@bubba/integrations";

interface DataTableProps {
	columnHeaders: {
		severity: string;
		result: string;
		title: string;
		provider: string;
		createdAt: string;
		assignedUser: string;
	};
	data: TestType[];
	pageCount: number;
	currentPage: number;
}

const getSeverityBadge = (severity: string | null) => {
  if (!severity) return <Badge>Unknown</Badge>;
  
  switch(severity.toUpperCase()) {
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
}

// Format the test status for display with appropriate badge color
const getResultsBadge = (status: string) => {
  switch(status.toUpperCase()) {
    case "PASSED":
      return <Badge className="bg-green-500">{status}</Badge>;
    case "IN_PROGRESS":
      return <Badge className="bg-yellow-500">{status}</Badge>;
    case "FAILED":
      return <Badge className="bg-red-500">{status}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

// Get provider logo with proper typing
const getProviderLogo = (provider: string): string => {
  const integration = integrations.find((i) => i.id === provider);
  // Ensure we return a string for the image src
  return typeof integration?.logo === 'string' ? integration.logo : '';
};

function getColumns(): ColumnDef<TestType>[] {
	const t = useI18n();

	return [
		{
			id: "severity",
			accessorKey: "severity",
			header: ({ column }) => (
				<TableHead>
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						{t("tests.table.severity")}
					</Button>
				</TableHead>
			),
      cell: ({ row }) => {
        return getSeverityBadge(row.original.severity);
      },
		},
		{
			id: "result",
			accessorKey: "result",
			header: ({ column }) => (
				<TableHead>
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						{t("tests.table.result")}
					</Button>
				</TableHead>
			),
      cell: ({ row }) => {
        return getResultsBadge(row.original.result);
      },
		},
		{
			id: "title",
			accessorKey: "title",
			header: ({ column }) => (
				<TableHead>
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						{t("tests.table.title")}
					</Button>
				</TableHead>
			),
		},
		{
			id: "provider",
			accessorKey: "provider",
			header: ({ column }) => (
				<TableHead>
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						{t("tests.table.provider")}
					</Button>
				</TableHead>
			),
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
			accessorKey: "createdAt",
			header: ({ column }) => (
				<TableHead>
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						{t("tests.table.createdAt")}
					</Button>
				</TableHead>
			),
		},
		{
			id: "assignedUser",
			accessorKey: "assignedUser",
			header: ({ column }) => (
				<TableHead>
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						{t("tests.table.assignedUser")}
					</Button>
				</TableHead>
			),
			cell: ({ row }) => {
				const assignedUser = row.original.assignedUser;
				if (!assignedUser) {
					return (
						<span className="text-muted-foreground text-sm">
							{t("tests.table.assignedUserEmpty")}
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

export function DataTable({
	columnHeaders,
	data,
	pageCount,
	currentPage,
}: DataTableProps) {
	const { orgId } = useParams<{ orgId: string }>();
	const router = useRouter();
	const clientColumns = getColumns();
	const columns = clientColumns.map((col) => ({
		...col,
		header: columnHeaders[col.id as keyof typeof columnHeaders],
		accessorFn: (row: TestType) => row[col.id as keyof TestType],
	}));

	const table = useReactTable({
		data,
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
								className="cursor-pointer hover:bg-muted/50"
								onClick={() => {
									const test = row.original;
									router.push(`/${orgId}/tests/all/${test.id}`);
								}}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell
										key={cell.id}
										className={cn({
											"hidden md:table-cell":
												cell.column.id === "severity" ||
												cell.column.id === "result" ||
												cell.column.id === "title" ||
												cell.column.id === "provider" ||
												cell.column.id === "createdAt" ||
												cell.column.id === "assignedUser",
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
