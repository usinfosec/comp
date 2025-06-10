"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { useMemo } from "react";
import type { Host } from "../types/index";
import { getEmployeeDevicesColumns } from "./EmployeeDevicesColumns";

export const EmployeeDevicesList = ({ devices }: { devices: Host[] }) => {
	const columns = useMemo(() => getEmployeeDevicesColumns(), []);

	const { table } = useDataTable({
		data: devices,
		columns,
		pageCount: 1,
		getRowId: (originalRow) => originalRow.id.toString(),
		shallow: false,
		clearOnDefault: true,
	});

	return (
		<DataTable table={table} getRowId={(row) => row.id.toString()}>
			<DataTableToolbar table={table} />
		</DataTable>
	);
};
