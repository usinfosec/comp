"use client";

import { DataTable } from "@/components/ui/data-table";
import { useI18n } from "@/locales/client";
import type { Departments, RiskStatus, User, Vendor } from "@bubba/db/types";
import { Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { useOrganizationAdmins } from "@/app/[locale]/(app)/(dashboard)/[orgId]/hooks/useOrganizationAdmins";
import { CreateVendorSheet } from "../components/create-vendor-sheet";
import { columns } from "./components/table/RiskRegisterColumns";

type VendorRegisterTableRow = Vendor & { owner: User | null };

export const VendorRegisterTable = ({
	data,
}: { data: VendorRegisterTableRow[] }) => {
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
	const [status, setStatus] = useQueryState<RiskStatus | null>("status", {
		defaultValue: null,
		parse: (value) => value as RiskStatus | null,
	});
	const [department, setDepartment] = useQueryState<Departments | null>(
		"department",
		{
			defaultValue: null,
			parse: (value) => value as Departments | null,
		},
	);
	const [assigneeId, setAssigneeId] = useQueryState<string | null>(
		"assigneeId",
		{
			defaultValue: null,
			parse: (value) => value,
		},
	);

	const hasActiveFilters = Boolean(status || department || assigneeId);

	const handleClearFilters = () => {
		setStatus(null);
		setDepartment(null);
		setAssigneeId(null);
		setPage(1);
	};

	const departments: Departments[] = [
		"none",
		"it",
		"hr",
		"admin",
		"gov",
		"itsm",
		"qms",
	] as const;

	const { data: admins } = useOrganizationAdmins();

	// const filterCategories = RiskRegisterFilters({
	// 	setPage: (newPage: number) => setPage(newPage),
	// 	departments: departments,
	// 	assignees: admins || [],
	// 	status,
	// 	setStatus,
	// 	department,
	// 	setDepartment,
	// 	assigneeId,
	// 	setAssigneeId,
	// });

	return (
		<>
			<DataTable<Vendor>
				columns={columns}
				data={data}
				// isLoading={isLoading}
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
				// filters={{
				// 	categories: filterCategories,
				// 	hasActiveFilters,
				// 	onClearFilters: handleClearFilters,
				// 	activeFilterCount: [status, department, assigneeId].filter(Boolean)
				// 		.length,
				// }}
				ctaButton={{
					label: t("vendors.register.create_new"),
					onClick: () => setOpen("true"),
					icon: <Plus className="h-4 w-4 mr-2" />,
				}}
			/>
			<CreateVendorSheet />
		</>
	);
};
