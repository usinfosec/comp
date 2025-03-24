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
import { useTests } from "./useTests";

interface TestsTableContextType {
  // State
  search: string;
  severity: string | null;
  status: string | null;
  page: string;
  pageSize: string;

  // Setters
  setSearch: (value: string) => void;
  setSeverity: (value: string | null) => void;
  setStatus: (value: string | null) => void;
  setPage: (value: string) => void;
  setPageSize: (value: string) => void;

  // Data
  tests: any[] | undefined;
  total: number | undefined;
  isLoading: boolean;
  isSearching: boolean;

  // Derived data
  hasActiveFilters: boolean;

  // Actions
  clearFilters: () => void;
}

const TestsTableContext = createContext<
  TestsTableContextType | undefined
>(undefined);

export function TestsTableProvider({ children }: { children: ReactNode }) {
  // Local state for search
  const [search, setSearch] = useState("");

  // Query state for other filters
  const [severity, setSeverity] = useQueryState("severity");
  const [status, setStatus] = useQueryState("status");
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
  const { tests, total, isLoading } = useTests(search);

  // Track when search params change
  useEffect(() => {
    if (initialLoadCompleted.current) {
      setIsSearching(true);
    }
  }, [search, severity, status, page, pageSize]);

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
    if (tests && isSearching) {
      // If we have data, ensure isSearching is eventually set to false
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [tests, isSearching]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return severity !== null || status !== null;
  }, [severity, status]);

  // Clear all filters
  const clearFilters = () => {
    setSeverity(null);
    setStatus(null);
    setPage("1"); // Reset to first page when clearing filters
    setSearch(""); // Clear search
  };

  const contextValue: TestsTableContextType = {
    // State
    search,
    severity,
    status,
    page,
    pageSize,

    // Setters
    setSearch,
    setSeverity,
    setStatus,
    setPage,
    setPageSize,

    // Data
    tests,
    total,
    isLoading,
    isSearching,

    // Derived data
    hasActiveFilters,

    // Actions
    clearFilters,
  };

  return (
    <TestsTableContext.Provider value={contextValue}>
      {children}
    </TestsTableContext.Provider>
  );
}

export function useTestsTable() {
  const context = useContext(TestsTableContext);

  if (context === undefined) {
    throw new Error(
      "useTestsTable must be used within a TestsTableProvider"
    );
  }

  return context;
} 