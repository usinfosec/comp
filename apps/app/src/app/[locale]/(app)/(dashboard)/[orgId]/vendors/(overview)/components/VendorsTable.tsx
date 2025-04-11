"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { useI18n } from "@/locales/client";
import type { Member, User, Vendor } from "@comp/db/types";
import { useParams } from "next/navigation";
import * as React from "react";
import { CreateVendorSheet } from "../../components/create-vendor-sheet";
import type { GetAssigneesResult, GetVendorsResult } from "../data/queries";
import { columns } from "./VendorColumns";

export const VendorsTable = ({
	promises,
}: {
	promises: Promise<[GetVendorsResult, GetAssigneesResult]>;
}) => {
	const t = useI18n();
	const { orgId } = useParams();

	// Resolve the promise data here
	const [{ data: vendors, totalCount, pageSize }, assignees] =
		React.use(promises);

	// Define columns memoized
	const memoizedColumns = React.useMemo(() => columns, []);

	const { table } = useDataTable({
		data: vendors,
		columns: memoizedColumns,
		pageCount: Math.ceil(totalCount / pageSize),
		getRowId: (row) => row.id,
		shallow: false,
		clearOnDefault: true,
	});

	return (
		<>
			<DataTable
				table={table}
				getRowId={(row) => row.id}
				rowClickBasePath={`/${orgId}/vendors`}
			>
				<DataTableToolbar
					table={table}
					sheet="createVendorSheet"
					action="Add Vendor"
				>
					<DataTableSortList table={table} align="end" />
				</DataTableToolbar>
			</DataTable>
			<CreateVendorSheet assignees={assignees} />
		</>
	);
};
