"use client";

import { DataTable } from "@/components/ui/data-table";
import { useI18n } from "@/locales/client";
import type { Member, User, Vendor } from "@comp/db/types";
import { Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { CreateVendorSheet } from "../../components/create-vendor-sheet";
import { columns } from "./VendorRegisterColumns";

export type VendorRegisterTableRow = Vendor & {
	assignee: {
		user: User;
	} | null;
};

export const VendorRegisterTable = ({
	data,
	assignees,
}: {
	data: VendorRegisterTableRow[];
	assignees: (Member & { user: User })[];
}) => {
	const t = useI18n();
	// State
	const [search, setSearch] = useState("");
	const [open, setOpen] = useQueryState("createVendorSheet");

	const [page, setPage] = useQueryState("page", {
		defaultValue: 1,
		parse: Number.parseInt,
	});
	const [pageSize, setPageSize] = useQueryState("pageSize", {
		defaultValue: 10,
		parse: Number,
	});

	return (
		<>
			<DataTable
				columns={columns}
				data={data}
				search={{
					value: search,
					onChange: setSearch,
				}}
				pagination={{
					page: Number(page),
					pageSize: Number(pageSize),
					totalCount: data.length,
					totalPages: Math.ceil(data.length / Number(pageSize)),
					hasNextPage: Number(page) < Math.ceil(data.length / Number(pageSize)),
					hasPreviousPage: Number(page) > 1,
				}}
				onPageChange={(newPage) => setPage(newPage)}
				onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
				ctaButton={{
					label: t("vendors.register.create_new"),
					onClick: () => setOpen("true"),
					icon: <Plus className="h-4 w-4 mr-2" />,
				}}
			/>
			<CreateVendorSheet assignees={assignees} />
		</>
	);
};
