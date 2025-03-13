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
import { EvidenceListColumns } from "./EvidenceListColumns";
import { EvidenceListHeader } from "./EvidenceListHeader";
import type { EvidenceTaskRow } from "../../types";
import { cn } from "@bubba/ui/cn";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function EvidenceListTable({ data }: { data: EvidenceTaskRow[] }) {
	const router = useRouter();
	const [sorting, setSorting] = useState<SortingState>([
		{
			id: "name",
			desc: false,
		},
	]);

	const table = useReactTable({
		data,
		columns: EvidenceListColumns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		enableColumnResizing: true,
		columnResizeMode: "onChange",
		defaultColumn: {
			minSize: 40,
			size: 150,
		},
		state: {
			sorting,
			columnSizing: {
				// Make the relevance column smaller
				relevance: 100,
			},
		},
		onSortingChange: setSorting,
	});

	const handleRowClick = (evidenceId: string) => {
		router.push(`/evidence/${evidenceId}`);
	};

	return (
		<div className="relative w-full border">
			<div
				className="overflow-x-auto"
				style={{ WebkitOverflowScrolling: "touch" }}
			>
				<Table>
					<EvidenceListHeader table={table} />
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className="hover:bg-muted/50 cursor-pointer"
									onClick={() => handleRowClick(row.original.id)}
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
												cell.column.id === "relevance" && "max-w-[100px]",
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
												onClick={(e) => {
													// Stop propagation to prevent row click when resizing
													e.stopPropagation();
												}}
											/>
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={EvidenceListColumns.length}
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
