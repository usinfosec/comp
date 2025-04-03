"use client";

import { TableHead, TableHeader, TableRow } from "@comp/ui/table";
import type { Table } from "@tanstack/react-table";
import type { ControlTableType } from "./ControlsTableColumns";

type Props = {
	table: Table<ControlTableType>;
};

export function ControlsTableHeader({ table }: Props) {
	return (
		<TableHeader>
			<TableRow className="hover:bg-transparent">
				{table.getAllColumns().map((column) => (
					<TableHead
						key={column.id}
						className="h-11 px-4 text-left align-middle font-medium"
					>
						{column.columnDef.header as string}
					</TableHead>
				))}
			</TableRow>
		</TableHeader>
	);
}
