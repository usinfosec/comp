"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { CreatePolicySheet } from "@/components/sheets/create-policy-sheet";
import { useDataTable } from "@/hooks/use-data-table";
import { useParams } from "next/navigation";
import { ControlWithRelations, getControls } from "../data/queries";
import { getControlColumns } from "./controls-table-columns";

interface ControlsTableProps {
	promises: Promise<[{ data: ControlWithRelations[]; pageCount: number }]>;
}

export function ControlsTable({ promises }: ControlsTableProps) {
	const [{ data, pageCount }] = React.use(promises);
	const { orgId } = useParams();
	const columns = React.useMemo(() => getControlColumns(), []);

	const { table } = useDataTable({
		data,
		columns,
		pageCount,
		initialState: {
			sorting: [{ id: "name", desc: true }],
			columnPinning: { right: ["actions"] },
		},
		getRowId: (originalRow: ControlWithRelations) => originalRow.id,
		shallow: false,
		clearOnDefault: true,
	});

	return (
		<>
			<DataTable
				table={table}
				getRowId={(row) => row.id}
				rowClickBasePath={`/${orgId}/controls`}
			>
				<DataTableToolbar table={table}>
					{/* <DataTableSortList table={table} align="end" /> */}
				</DataTableToolbar>
			</DataTable>
			<CreatePolicySheet />
		</>
	);
}
