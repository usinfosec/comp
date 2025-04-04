"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { useDataTable } from "@/hooks/use-data-table";
import { useI18n } from "@/locales/client";
import { useSession } from "@comp/auth";
import type { Member, User, Vendor } from "@comp/db/types";
import { Button } from "@comp/ui/button";
import { Input } from "@comp/ui/input";
import { Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { CreateVendorSheet } from "../../components/create-vendor-sheet";
import { columns } from "./VendorColumns";

export type VendorRegisterTableRow = Vendor & {
	assignee: {
		user: User;
	} | null;
};

export const VendorsTable = ({
	data,
	assignees,
}: {
	data: VendorRegisterTableRow[];
	assignees: (Member & { user: User })[];
}) => {
	const t = useI18n();
	const session = useSession();
	const orgId = session?.data?.session?.activeOrganizationId;
	const [_, setOpen] = useQueryState("createVendorSheet");

	// Set up the vendors table
	const table = useDataTable({
		data,
		columns: columns(orgId ?? ""),
		pageCount: Math.ceil(data.length / 10),
		getRowId: (row) => row.id,
		initialState: {
			sorting: [{ id: "name", desc: false }],
			pagination: {
				pageSize: 10,
				pageIndex: 0,
			},
		},
	});

	const [searchTerm, setSearchTerm] = useQueryState("search", {
		defaultValue: "",
	});

	return (
		<>
			<div className="flex items-center mb-4">
				<Input
					placeholder={t("vendors.filters.search_placeholder")}
					value={searchTerm || ""}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="max-w-sm"
				/>
				<div className="ml-auto flex gap-2">
					<DataTableSortList table={table.table} align="end" />
					<Button onClick={() => setOpen("true")} variant="default">
						<Plus className="h-4 w-4 mr-2" />
						{t("vendors.register.create_new")}
					</Button>
				</div>
			</div>
			<DataTable
				table={table.table}
				rowClickBasePath={`/${orgId}/vendors`}
				getRowId={(row) => row.id}
			/>
			<CreateVendorSheet assignees={assignees} />
		</>
	);
};
