"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@comp/ui/table";
import {
	useReactTable,
	getCoreRowModel,
	flexRender,
} from "@tanstack/react-table";
import { RequirementControlsTableColumns } from "./RequirementControlsTableColumns";
import type { Control } from "@comp/db/types";
import type { Artifact, Evidence, Policy } from "@comp/db/types";

interface RequirementControlsTableProps {
	controls: (Control & {
		artifacts: (Artifact & {
			policy: Policy | null;
			evidence: Evidence | null;
		})[];
	})[];
}

export function RequirementControlsTable({
	controls,
}: RequirementControlsTableProps) {
	const table = useReactTable({
		data: controls,
		columns: RequirementControlsTableColumns(),
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="relative w-full">
			<div className="overflow-auto">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id} className="p-4">
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="p-4">
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
									colSpan={RequirementControlsTableColumns().length}
									className="h-24 text-center"
								>
									No controls found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
