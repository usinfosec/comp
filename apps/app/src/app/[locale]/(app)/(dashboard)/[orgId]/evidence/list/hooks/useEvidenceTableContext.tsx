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
import type { Frequency, Departments, EvidenceStatus } from "@bubba/db/types";
import { useOrganizationEvidenceTasks } from "../../hooks/useEvidenceTasks";
import { ALL_DEPARTMENTS } from "../../constants";
import { ALL_FREQUENCIES } from "../../constants";
import type { EvidenceTaskRow } from "../types";

interface Assignee {
	id: string;
	name: string | null;
	image: string | null;
}

interface Filter {
	label: string;
	value: string;
	checked: boolean;
}

interface EvidenceTableContextType {
	// State
	search: string;
	status: EvidenceStatus | null;
	frequency: Frequency | null;
	department: Departments | null;
	assigneeId: string | null;
	page: string;
	pageSize: string;
	filters: Filter[];

	// Setters
	setSearch: (value: string) => void;
	setStatus: (value: EvidenceStatus | null) => void;
	setFrequency: (value: Frequency | null) => void;
	setDepartment: (value: Departments | null) => void;
	setAssigneeId: (value: string | null) => void;
	setPage: (value: string) => void;
	setPageSize: (value: string) => void;
	setFilters: (filters: Filter[]) => void;
	mutate: () => void;

	// Data
	evidenceTasks: EvidenceTaskRow[] | undefined;
	pagination:
		| {
				totalCount: number;
				totalPages: number;
				hasNextPage: boolean;
				hasPreviousPage: boolean;
		  }
		| undefined;
	isLoading: boolean;
	isSearching: boolean;
	error: Error | undefined;

	// Derived data
	frequencies: Frequency[];
	departments: Departments[];
	assignees: Assignee[];
	hasActiveFilters: boolean;

	// Actions
	clearFilters: () => void;
}

const EvidenceTableContext = createContext<
	EvidenceTableContextType | undefined
>(undefined);

export function EvidenceTableProvider({ children }: { children: ReactNode }) {
	// Local state for search
	const [search, setSearch] = useState("");

	// Query state for other filters
	const [statusQuery, setStatusQuery] = useQueryState("status");
	const [frequencyQuery, setFrequencyQuery] = useQueryState("frequency");
	const [departmentQuery, setDepartmentQuery] = useQueryState("department");
	const [assigneeId, setAssigneeId] = useQueryState("assigneeId");
	const [page, setPage] = useQueryState("page", { defaultValue: "1" });
	const [pageSize, setPageSize] = useQueryState("pageSize", {
		defaultValue: "10",
	});

	// Type-safe status, frequency, and department
	const status = statusQuery as EvidenceStatus | null;
	const frequency = frequencyQuery as Frequency | null;
	const department = departmentQuery as Departments | null;

	// Type-safe setters
	const setStatus = (value: EvidenceStatus | null) => setStatusQuery(value);
	const setFrequency = (value: Frequency | null) => setFrequencyQuery(value);
	const setDepartment = (value: Departments | null) =>
		setDepartmentQuery(value);

	// Filter state
	const [filters, setFilters] = useState<Filter[]>([
		{ label: "Published", value: "published", checked: false },
		{ label: "Draft", value: "draft", checked: false },
		{ label: "Not Relevant", value: "not_relevant", checked: false },
	]);

	// Track if this is initial load or a search/filter update
	const initialLoadCompleted = useRef(false);
	const [isSearching, setIsSearching] = useState(false);

	const currentPage = Number.parseInt(page, 10);
	const currentPageSize = Number.parseInt(pageSize, 10);

	// Fetch data
	const {
		data: rawEvidenceTasks,
		pagination,
		isLoading,
		error,
		mutate,
	} = useOrganizationEvidenceTasks({
		search,
		status,
		frequency,
		department,
		assigneeId,
		page: currentPage,
		pageSize: currentPageSize,
	});

	// Track when search params change
	useEffect(() => {
		if (initialLoadCompleted.current) {
			setIsSearching(true);
		}
	}, [search, status, frequency, department, assigneeId, page, pageSize]);

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
		if (rawEvidenceTasks && isSearching) {
			// If we have data, ensure isSearching is eventually set to false
			const timer = setTimeout(() => {
				setIsSearching(false);
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [rawEvidenceTasks, isSearching]);

	// Format data for the table
	const evidenceTasks = useMemo(() => {
		return rawEvidenceTasks?.map((task) => ({
			...task,
			evidence: {
				name: task.name,
			},
		})) as EvidenceTaskRow[] | undefined;
	}, [rawEvidenceTasks]);

	// Predefined frequencies and departments
	const frequencies = useMemo(() => ALL_FREQUENCIES, []);
	const departments = useMemo(() => ALL_DEPARTMENTS, []);

	// Get unique assignees for the dropdown
	const assignees = useMemo(() => {
		if (!evidenceTasks) return [];

		const uniqueAssignees = new Map<
			string,
			{ id: string; name: string | null; image: string | null }
		>();

		for (const task of evidenceTasks) {
			if (task.assignee) {
				uniqueAssignees.set(task.assignee.id, {
					id: task.assignee.id,
					name: task.assignee.user.name,
					image: task.assignee.user.image,
				});
			}
		}

		return Array.from(uniqueAssignees.values()).sort((a, b) => {
			return (a.name || "").localeCompare(b.name || "");
		});
	}, [evidenceTasks]);

	// Check if any filters are active
	const hasActiveFilters = useMemo(() => {
		return (
			status !== null ||
			frequency !== null ||
			department !== null ||
			assigneeId !== null
		);
	}, [status, frequency, department, assigneeId]);

	// Clear all filters
	const clearFilters = () => {
		setStatus(null);
		setFrequency(null);
		setDepartment(null);
		setAssigneeId(null);
		setPage("1"); // Reset to first page when clearing filters
		setFilters(filters.map((f) => ({ ...f, checked: false }))); // Reset all filter checkboxes
		setSearch(""); // Clear search
	};

	const contextValue: EvidenceTableContextType = {
		// State
		search,
		status,
		frequency,
		department,
		assigneeId,
		page,
		pageSize,
		filters,

		// Setters
		setSearch,
		setStatus,
		setFrequency,
		setDepartment,
		setAssigneeId,
		setPage,
		setPageSize,
		setFilters,
		mutate,

		// Data
		evidenceTasks,
		pagination,
		isLoading,
		isSearching,
		error,

		// Derived data
		frequencies,
		departments,
		assignees,
		hasActiveFilters,

		// Actions
		clearFilters,
	};

	return (
		<EvidenceTableContext.Provider value={contextValue}>
			{children}
		</EvidenceTableContext.Provider>
	);
}

export function useEvidenceTable() {
	const context = useContext(EvidenceTableContext);

	if (context === undefined) {
		throw new Error(
			"useEvidenceTable must be used within an EvidenceTableProvider",
		);
	}

	return context;
}
