"use client";

import { Loading } from "@/components/tables/risk-tasks/loading";
import { useI18n } from "@/locales/client";
import { Table, TableBody, TableCell, TableRow } from "@bubba/ui/table";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Suspense } from "react";
import { ControlsTableColumns } from "./ControlsTableColumns";
import { ControlsTableHeader } from "./ControlsTableHeader";
import type { Control } from "@bubba/db/types";

interface DataTableProps {
	data: (Control & {
		artifacts: {
			policy: { status: string } | null;
			evidence: { published: boolean } | null;
		}[];
		requirementsMapped: any[];
	})[];
}

export function ControlsTable({ data }: DataTableProps) {
	const t = useI18n();
	const columns = ControlsTableColumns();

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<Suspense fallback={<Loading isEmpty={false} />}>
			<div className="w-full overflow-auto">
				<Table>
					<ControlsTableHeader table={table} />
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									className="h-[45px]"
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="px-3 md:px-4 py-2">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
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
									{t("controls.table.no_controls_found")}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</Suspense>
	);
}
