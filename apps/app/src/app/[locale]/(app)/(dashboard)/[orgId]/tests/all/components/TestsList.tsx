"use client";

import { NoTests } from "./table/empty-states";
import { Loading } from "./table/loading";
import { useTests } from "../hooks/useTests";
import { TestsTable } from "./table/TestsTable";
import { TestsTableProvider } from "../hooks/useTestsTableContext";

export function TestsList() {
  const { tests, isLoading, error } = useTests('');

  if (isLoading) {
    return <Loading isEmpty={false} />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Tests</h2>
        <div className="border p-4 rounded-md bg-red-50 text-red-800">
          Error loading tests: {error.message}
        </div>
      </div>
    );
  }

  if (tests.length === 0) {
    return (
      <div className="relative overflow-hidden">
        <NoTests />
        <Loading isEmpty />
      </div>
    );
  }

  return (
    <TestsTableProvider>
      <div className="relative">
        <TestsTable />
      </div>
    </TestsTableProvider>
  );
} 