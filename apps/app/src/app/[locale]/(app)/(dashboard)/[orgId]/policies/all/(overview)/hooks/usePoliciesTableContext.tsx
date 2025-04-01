"use client";

import {
	createContext,
	useContext,
	useMemo,
	useState,
	useRef,
	useEffect,
	type ReactNode,
} from "react";
import { useQueryState } from "nuqs";
import { usePolicies } from "./usePolicies";

interface PoliciesTableContextType {
	// State
	search: string;
	status: string | null;
	ownerId: string | null;
	isArchived: string | null;
	page: string;
	pageSize: string;

	// Setters
	setSearch: (value: string) => void;
	setStatus: (value: string | null) => void;
	setOwnerId: (value: string | null) => void;
	setIsArchived: (value: string | null) => void;
	setPage: (value: string) => void;
	setPageSize: (value: string) => void;

	// Data
	policies: any[] | undefined;
	total: number | undefined;
	isLoading: boolean;
	isSearching: boolean;

	// Derived data
	hasActiveFilters: boolean;

	// Actions
	clearFilters: () => void;
}

const PoliciesTableContext = createContext<
	PoliciesTableContextType | undefined
>(undefined);

export function PoliciesTableProvider({ children }: { children: ReactNode }) {
	// Local state for search
	const [search, setSearch] = useState("");

	// Query state for other filters
	const [status, setStatus] = useQueryState("status");
	const [ownerId, setOwnerId] = useQueryState("ownerId");
	const [isArchived, setIsArchived] = useQueryState("isArchived");
	const [page, setPage] = useQueryState("page", { defaultValue: "1" });
	const [pageSize, setPageSize] = useQueryState("pageSize", {
		defaultValue: "10",
	});

	// Track if this is initial load or a search/filter update
	const initialLoadCompleted = useRef(false);
	const [isSearching, setIsSearching] = useState(false);

	const currentPage = Number.parseInt(page, 10);
	const currentPageSize = Number.parseInt(pageSize, 10);

	// Fetch data
	const { policies, total, isLoading } = usePolicies({
		search,
		status: status || undefined,
		ownerId: ownerId || undefined,
		isArchived: isArchived || undefined,
		page: currentPage,
		pageSize: currentPageSize,
	});

	// Track when search params change
	useEffect(() => {
		if (initialLoadCompleted.current) {
			setIsSearching(true);
		}
	}, [search, status, ownerId, isArchived, page, pageSize]);

	// Track when loading changes
	useEffect(() => {
		if (isLoading === false) {
			// Small delay to ensure UI transitions properly
			setTimeout(() => {
				initialLoadCompleted.current = true;
				setIsSearching(false);
			}, 50);
		}
	}, [isLoading]);

	// Additional safety reset for isSearching when data changes
	useEffect(() => {
		if (policies && isSearching) {
			// If we have data, ensure isSearching is eventually set to false
			const timer = setTimeout(() => {
				setIsSearching(false);
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [policies, isSearching]);

	// Check if any filters are active
	const hasActiveFilters = useMemo(() => {
		return status !== null || ownerId !== null || isArchived !== null;
	}, [status, ownerId, isArchived]);

	// Clear all filters
	const clearFilters = () => {
		setStatus(null);
		setOwnerId(null);
		setIsArchived(null);
		setPage("1"); // Reset to first page when clearing filters
		setSearch(""); // Clear search
	};

	const contextValue: PoliciesTableContextType = {
		// State
		search,
		status,
		ownerId,
		isArchived,
		page,
		pageSize,

		// Setters
		setSearch,
		setStatus,
		setOwnerId,
		setIsArchived,
		setPage,
		setPageSize,

		// Data
		policies,
		total, // Use the total directly from the API
		isLoading,
		isSearching,

		// Derived data
		hasActiveFilters,

		// Actions
		clearFilters,
	};

	return (
		<PoliciesTableContext.Provider value={contextValue}>
			{children}
		</PoliciesTableContext.Provider>
	);
}

export function usePoliciesTable() {
	const context = useContext(PoliciesTableContext);

	if (context === undefined) {
		throw new Error(
			"usePoliciesTable must be used within a PoliciesTableProvider",
		);
	}

	return context;
}
