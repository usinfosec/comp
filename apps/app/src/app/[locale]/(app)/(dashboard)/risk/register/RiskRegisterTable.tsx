"use client";

import { DataTable } from "@/components/ui/data-table";
import { useRisks } from "./hooks/useRisks";
import { columns } from "./components/table/RiskRegisterColumns";
import type { User, Risk, Departments } from "@bubba/db";
import type { RiskStatus } from "@bubba/db";
import { useState } from "react";
import { useQueryState } from "nuqs";
import { RiskRegisterFilters } from "./components/table/RiskRegisterFilters";
import { useOrganizationAdmins } from "../../evidence/[id]/hooks/useOrganizationAdmins";
import { CreateRiskSheet } from "@/components/sheets/create-risk-sheet";
import { Plus } from "lucide-react";
import { useI18n } from "@/locales/client";

type RiskRegisterTableRow = Risk & { owner: User | null };

export const RiskRegisterTable = () => {
	const t = useI18n();
	// State
	const [search, setSearch] = useState("");
	const [open, setOpen] = useQueryState("create-risk-sheet");

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

	const { data, isLoading } = useRisks({
		search: search,
		page: Number(page),
		pageSize: Number(pageSize),
		status,
		department,
		assigneeId,
	});

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

	const filterCategories = RiskRegisterFilters({
		setPage: (newPage: number) => setPage(newPage),
		departments: departments,
		assignees: admins || [],
		status,
		setStatus,
		department,
		setDepartment,
		assigneeId,
		setAssigneeId,
	});

	return (
		<>
			<DataTable<RiskRegisterTableRow>
				columns={columns}
				data={data}
				isLoading={isLoading}
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
				filters={{
					categories: filterCategories,
					hasActiveFilters,
					onClearFilters: handleClearFilters,
					activeFilterCount: [status, department, assigneeId].filter(Boolean)
						.length,
				}}
				ctaButton={{
					label: t("risk.register.empty.create_risk"),
					onClick: () => setOpen("true"),
					icon: <Plus className="h-4 w-4 mr-2" />,
				}}
			/>
			<CreateRiskSheet />
		</>
	);
};
