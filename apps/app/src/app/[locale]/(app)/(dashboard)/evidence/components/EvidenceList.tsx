"use client";

import { useI18n } from "@/locales/client";
import { useEvidenceTable } from "../hooks/useEvidenceTableContext";
import { DataTable } from "./data-table/EvidenceListTable";
import {
	ActiveFilterBadges,
	FilterDropdown,
	PaginationControls,
	SearchInput,
} from "./EvidenceFilters";
import { SkeletonTable } from "./SkeletonTable";
import { EvidenceSummaryCards } from "./EvidenceSummaryCards";
import { useRouter } from "next/navigation";
import { StatusPolicies } from "@/components/status-policies";
import type { EvidenceTaskRow } from "./data-table/types";
import { Skeleton } from "@bubba/ui/skeleton";

// Mobile skeleton loader
function MobileSkeletonLoader() {
	return (
		<div className="flex flex-col gap-2">
			{[
				"skeleton-item-1",
				"skeleton-item-2",
				"skeleton-item-3",
				"skeleton-item-4",
				"skeleton-item-5",
			].map((id) => (
				<div
					key={id}
					className="p-3 bg-card rounded-md border shadow-sm flex items-center justify-between"
				>
					<Skeleton className="h-5 w-3/4" />
					<Skeleton className="h-5 w-20" />
				</div>
			))}
		</div>
	);
}

// Mobile view evidence list item
function MobileEvidenceList({ data }: { data: EvidenceTaskRow[] }) {
	const router = useRouter();

	return (
		<div className="flex flex-col gap-2">
			{data.map((item) => (
				<div
					key={item.id}
					className="p-3 bg-card rounded-md border shadow-sm flex items-center justify-between hover:bg-muted/50 cursor-pointer"
					onClick={() => router.push(`/evidence/${item.id}`)}
				>
					<div className="font-medium truncate flex-1">{item.name}</div>
					<StatusPolicies
						status={item.published ? "published" : "draft"}
						className="shrink-0"
					/>
				</div>
			))}
		</div>
	);
}

export function EvidenceList() {
	const t = useI18n();
	const { evidenceTasks = [], isLoading, error } = useEvidenceTable();

	if (error) return <div>Error: {error.message}</div>;

	return (
		<div className="w-full flex flex-col gap-4">
			<div className="flex flex-col gap-4">
				<EvidenceSummaryCards />

				<div className="flex flex-wrap items-center gap-2">
					<div className="w-full max-w-sm">
						<SearchInput placeholder={t("common.filters.search")} />
					</div>

					<FilterDropdown />

					<ActiveFilterBadges />
				</div>
			</div>

			{isLoading ? (
				<>
					<div className="hidden md:block">
						<SkeletonTable />
					</div>
					<div className="md:hidden">
						<MobileSkeletonLoader />
					</div>
				</>
			) : (
				<>
					{evidenceTasks.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							No evidence tasks found. Try adjusting your filters.
						</div>
					) : (
						<>
							{/* Show table on larger screens, hide on mobile */}
							<div className="hidden md:block">
								<DataTable data={evidenceTasks} />
							</div>

							{/* Show list on mobile, hide on larger screens */}
							<div className="md:hidden">
								<MobileEvidenceList data={evidenceTasks} />
							</div>
						</>
					)}

					<PaginationControls />
				</>
			)}
		</div>
	);
}
