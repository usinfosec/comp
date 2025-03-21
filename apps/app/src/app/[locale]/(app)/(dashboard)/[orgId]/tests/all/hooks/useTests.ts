"use client";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";

import { getTests } from "../actions/getTests";
import type { TestsResponse, TestsInput, AppError } from "../types";

/** Fetcher function for tests */
async function fetchTests(input: TestsInput): Promise<TestsResponse> {
  const result = await getTests(input);

  if (!result) {
    const error: AppError = {
      code: "UNEXPECTED_ERROR",
      message: "An unexpected error occurred",
    };
    throw error;
  }

  if (result.serverError) {
    const error: AppError = {
      code: "UNEXPECTED_ERROR",
      message: result.serverError || "An unexpected error occurred",
    };
    throw error;
  }

  if (!result.data) {
    const error: AppError = {
      code: "UNEXPECTED_ERROR",
      message: "No data returned from server",
    };
    throw error;
  }

  return result.data.data as TestsResponse;
}

export function useTests() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || undefined;
  const providerParam = searchParams.get("provider") || undefined;
  const provider = providerParam && ["AWS", "AZURE", "GCP"].includes(providerParam) 
    ? providerParam as "AWS" | "AZURE" | "GCP" 
    : undefined;
  const status = searchParams.get("status") || undefined;
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;

  /** SWR for fetching tests */
  const {
    data,
    error,
    isLoading,
    mutate: revalidateTests,
  } = useSWR<TestsResponse, AppError>(
    ["tests", { search, provider, status, page, pageSize }],
    () => fetchTests({ search, provider, status, page, pageSize }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Format the tests to match the TestRow type
  const formattedTests = data?.tests.map(test => ({
    ...test,
    // Convert Date to string for use in components if needed
    createdAt: test.createdAt
  })) || [];

  return {
    tests: formattedTests,
    total: data?.total ?? 0,
    isLoading,
    error,
    revalidateTests
  };
}
