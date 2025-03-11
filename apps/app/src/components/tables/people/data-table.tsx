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
import { useRouter } from "next/navigation";
import type { PersonType } from "./columns";
import { DataTableHeader } from "./data-table-header";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Badge } from "@bubba/ui/badge";
import { Status, type StatusType } from "@/components/status";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@bubba/ui/dropdown-menu";
import {
	EmployeeStatus,
	getEmployeeStatusFromBoolean,
} from "./employee-status";

interface DataTableProps {
	columnHeaders: {
		name: string;
		email: string;
		department: string;
		status: string;
	};
	data: PersonType[];
	pageCount: number;
	currentPage: number;
}

function getColumns(): ColumnDef<PersonType>[] {
	const t = useI18n();

	return [
		{
			id: "email",
			accessorKey: "email",
			header: ({ column }) => (
				<TableHead className="w-[30%]">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						{t("people.table.email")}
					</Button>
				</TableHead>
			),
		},
		{
			id: "name",
			accessorKey: "name",
			header: ({ column }) => (
				<TableHead className="w-[30%]">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						{t("people.table.name")}
					</Button>
				</TableHead>
			),
		},
		{
			id: "department",
			accessorKey: "department",
			header: ({ column }) => (
				<TableHead className="w-[20%]">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						{t("people.table.department")}
					</Button>
				</TableHead>
			),
			cell: ({ row }) => {
				const department = row.original.department;
				return (
					<div className="flex items-center">
						<Badge variant="marketing">{department}</Badge>
					</div>
				);
			},
		},
		{
			id: "status",
			accessorKey: "isActive",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title={t("people.table.status")}
				/>
			),
			cell: ({ row }) => {
				const isActive = row.original.isActive;
				const status = getEmployeeStatusFromBoolean(isActive);

				return <EmployeeStatus status={status} />;
			},
			enableSorting: true,
			enableHiding: true,
		},
	];
}

export function DataTable({
	columnHeaders,
	data,
	pageCount,
	currentPage,
}: DataTableProps) {
	const router = useRouter();
	const clientColumns = getColumns();
	const columns = clientColumns.map((col) => ({
		...col,
		header: columnHeaders[col.id as keyof typeof columnHeaders],
		accessorFn: (row: PersonType) => row[col.id as keyof PersonType],
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
			<Table className="table-fixed border-collapse">
				<DataTableHeader table={table} />

				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
								className="cursor-pointer hover:bg-muted/50"
								onClick={() => {
									const person = row.original;
									router.push(`/people/${person.id}`);
								}}
							>
								{row.getVisibleCells().map((cell) => {
									let cellClassName = "";

									if (cell.column.id === "name") {
										cellClassName = "w-[30%]";
									} else if (cell.column.id === "email") {
										cellClassName = "w-[30%] hidden md:table-cell";
									} else if (cell.column.id === "department") {
										cellClassName = "w-[20%]";
									} else if (cell.column.id === "status") {
										cellClassName = "w-[20%] text-center";
									}

									return (
										<TableCell key={cell.id} className={cellClassName}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									);
								})}
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
