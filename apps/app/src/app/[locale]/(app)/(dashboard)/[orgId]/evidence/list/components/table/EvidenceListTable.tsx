"use client";

import { DataTable } from "@/components/ui/data-table";
import { EvidenceListColumns } from "./EvidenceListColumns";
import type { EvidenceTaskRow } from "../../types";
import { useParams, useRouter } from "next/navigation";
import { useEvidenceTable } from "../../hooks/useEvidenceTableContext";
import { getFilterCategories } from "./components/filterCategories";
import { useEffect, useMemo, useState } from "react";

export function EvidenceListTable({ data }: { data: EvidenceTaskRow[] }) {
	const router = useRouter();
	const { orgId } = useParams<{ orgId: string }>();
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkIfMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		// Initial check
		checkIfMobile();

		// Add event listener
		window.addEventListener("resize", checkIfMobile);

		// Cleanup
		return () => window.removeEventListener("resize", checkIfMobile);
	}, []);

	const {
		page,
		setPage,
		pageSize,
		setPageSize,
		pagination,
		search,
		setSearch,
		status,
		setStatus,
		frequency,
		setFrequency,
		department,
		setDepartment,
		assigneeId,
		setAssigneeId,
		frequencies,
		departments,
		assignees,
		hasActiveFilters,
		clearFilters,
		isLoading,
		isSearching,
	} = useEvidenceTable();

	const handleRowClick = (evidenceId: string) => {
		router.push(`/${orgId}/evidence/${evidenceId}`);
	};

	const activeFilterCount = [status, frequency, department, assigneeId].filter(
		Boolean,
	).length;

	const filterCategories = getFilterCategories({
		status,
		setStatus,
		frequency,
		setFrequency,
		department,
		setDepartment,
		assigneeId,
		setAssigneeId,
		frequencies,
		departments,
		assignees,
		setPage,
	});

	// Filter columns for mobile view
	const visibleColumns = useMemo(() => {
		if (isMobile) {
			// On mobile, only show the name and relevance columns
			return EvidenceListColumns.filter((column) => column.id === "name");
		}
		return EvidenceListColumns;
	}, [isMobile]);

	return (
		<DataTable
			data={data || []}
			columns={visibleColumns}
			onRowClick={(row: EvidenceTaskRow) => handleRowClick(row.id)}
			emptyMessage="No evidence tasks found."
			isLoading={isLoading || isSearching}
			pagination={{
				page: Number(page),
				pageSize: Number(pageSize),
				totalCount: pagination?.totalCount || 0,
				totalPages: pagination?.totalPages || 0,
				hasNextPage: pagination?.hasNextPage || false,
				hasPreviousPage: pagination?.hasPreviousPage || false,
			}}
			onPageChange={(page) => setPage(page.toString())}
			onPageSizeChange={(pageSize) => setPageSize(pageSize.toString())}
			search={{
				value: search || "",
				onChange: setSearch,
				placeholder: "Search evidence tasks...",
			}}
			filters={{
				categories: filterCategories,
				hasActiveFilters,
				onClearFilters: clearFilters,
				activeFilterCount,
			}}
		/>
	);
}
