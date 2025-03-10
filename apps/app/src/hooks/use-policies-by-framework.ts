"use client";

import { getPoliciesByFrameworkAction } from "@/actions/policies/get-policies-by-framework";
import { useI18n } from "@/locales/client";
import { useCallback } from "react";
import useSWR from "swr";

export function usePoliciesByFramework() {
  // Fetcher function that calls the server action
  const fetcher = useCallback(async () => {
    const result = await getPoliciesByFrameworkAction();
    if (result?.serverError) {
      throw new Error(result.serverError);
    }
    return result?.data?.data;
  }, []);

  // Use SWR for data fetching with caching and revalidation
  const {
    data: policiesByFramework,
    error,
    isLoading,
    mutate,
  } = useSWR("policies-by-framework", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000, // 10 seconds
  });

  return {
    policiesByFramework: policiesByFramework || [],
    isLoading,
    error: error ? error.message : null,
    refresh: mutate,
  };
}
