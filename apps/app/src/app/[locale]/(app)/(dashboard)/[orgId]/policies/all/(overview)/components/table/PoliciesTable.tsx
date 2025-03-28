"use client";

import { DataTable } from "@/components/ui/data-table";
import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { getFilterCategories } from "./components/filterCategories";
import { getColumns } from "./columns";
import type { PoliciesTableProps } from "./types";
import { usePoliciesTable } from "./hooks/usePoliciesTableContext";
import { useQueryState } from "nuqs";

export function PoliciesTable({ users }: PoliciesTableProps) {
	const router = useRouter();
	const { orgId } = useParams<{ orgId: string }>();
	const [_, setCreatePolicySheet] = useQueryState("create-policy-sheet");
	const {
		page,
		setPage,
		pageSize,
		setPageSize,
		policies,
		total,
		search,
		setSearch,
		status,
		setStatus,
		ownerId,
		setOwnerId,
		hasActiveFilters,
		clearFilters,
		isLoading,
		isSearching,
	} = usePoliciesTable();

	const handleRowClick = (policyId: string) => {
		router.replace(`/${orgId}/policies/all/${policyId}`);
	};

	const activeFilterCount = [status, ownerId].filter(Boolean).length;

	const filterCategories = getFilterCategories({
		status,
		setStatus,
		ownerId,
		setOwnerId,
		users,
		setPage,
	});

	// Calculate pagination values only when total is defined
	const pagination =
		total !== undefined
			? {
					page: Number(page),
					pageSize: Number(pageSize),
					totalCount: total,
					totalPages: Math.ceil(total / Number(pageSize)),
					hasNextPage: Number(page) * Number(pageSize) < total,
					hasPreviousPage: Number(page) > 1,
				}
			: undefined;

	return (
		<DataTable
			data={policies || []}
			columns={getColumns(handleRowClick)}
			onRowClick={(row) => handleRowClick(row.id)}
			emptyMessage="No policies found."
			isLoading={isLoading || isSearching}
			pagination={pagination}
			onPageChange={(page) => setPage(page.toString())}
			onPageSizeChange={(pageSize) => setPageSize(pageSize.toString())}
			search={{
				value: search || "",
				onChange: setSearch,
				placeholder: "Search policies...",
			}}
			filters={{
				categories: filterCategories,
				hasActiveFilters,
				onClearFilters: clearFilters,
				activeFilterCount,
			}}
			ctaButton={{
				label: "Create Policy",
				onClick: () => setCreatePolicySheet("true", { history: "push" }),
				icon: <Plus className="h-4 w-4" />,
			}}
		/>
	);
}
