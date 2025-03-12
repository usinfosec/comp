"use client";

import {
	type Column,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getSortedRowModel,
	type SortingState,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableRow } from "@bubba/ui/table";
import { columns } from "./columns";
import { DataTableHeader } from "./data-table-header";
import type { EvidenceTaskRow } from "./types";
import { cn } from "@bubba/ui/cn";
import { useState } from "react";

export function DataTable({ data }: { data: EvidenceTaskRow[] }) {
	const [sorting, setSorting] = useState<SortingState>([
		{
			id: "name",
			desc: false,
		},
	]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		enableColumnResizing: true,
		columnResizeMode: "onChange",
		state: {
			sorting,
		},
		onSortingChange: setSorting,
	});

	return (
		<div className="relative w-full">
			<div className="overflow-auto">
				<Table>
					<DataTableHeader table={table} />
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className="hover:bg-muted/50"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											className={cn(
												"p-4 relative whitespace-nowrap",
												(cell.column.id === "status" ||
													cell.column.id === "department" ||
													cell.column.id === "frequency" ||
													cell.column.id === "nextReviewDate" ||
													cell.column.id === "assignee" ||
													cell.column.id === "relevance") &&
													"hidden md:table-cell",
											)}
											style={{ width: cell.column.getSize() }}
										>
											<div>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</div>
											<div
												className={`absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none bg-border opacity-0 hover:opacity-100 ${
													table.getState().columnSizingInfo.isResizingColumn ===
													cell.column.id
														? "bg-primary opacity-100"
														: ""
												}`}
											/>
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No evidence tasks found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
