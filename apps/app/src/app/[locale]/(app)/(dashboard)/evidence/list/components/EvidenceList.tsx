"use client";

import { useEvidenceTasksStats } from "../../hooks/useEvidenceTasksStats";
import { useEvidenceTable } from "../hooks/useEvidenceTableContext";
import {
	EvidenceListEmpty,
	EvidenceListError,
	EvidenceListSkeleton,
} from "./EvidenceListUIStates";
import { EvidenceSummaryCards } from "./EvidenceSummaryCards";
import { FilterDropdown, SearchInput } from "./table/EvidenceFilters";
import { PaginationControls } from "./table/EvidenceFilters/PaginationControls";
import { EvidenceListTable } from "./table/EvidenceListTable";

export function EvidenceList() {
	const {
		evidenceTasks,
		isLoading,
		error,
		mutate,
		hasActiveFilters,
		clearFilters,
		pagination,
	} = useEvidenceTable();

	// Also track the loading state of the stats
	const { isLoading: isStatsLoading } = useEvidenceTasksStats();

	// Show loading state if either the list or stats are loading
	if (isLoading || isStatsLoading) {
		return <EvidenceListSkeleton />;
	}

	if (error) {
		return <EvidenceListError error={error} onRetry={mutate} />;
	}

	return (
		<div className="space-y-4 w-full max-w-full">
			<div className="flex items-center gap-3">
				<SearchInput />
				<FilterDropdown />
			</div>

			{evidenceTasks && evidenceTasks.length === 0 ? (
				<EvidenceListEmpty
					hasFilters={hasActiveFilters}
					onClearFilters={clearFilters}
				/>
			) : (
				<div className="w-full max-w-full">
					<EvidenceListTable data={evidenceTasks || []} />
					{pagination && <PaginationControls />}
				</div>
			)}
		</div>
	);
}
