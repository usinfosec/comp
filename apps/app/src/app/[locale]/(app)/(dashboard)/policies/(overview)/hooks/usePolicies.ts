"use client";

import { getPolicies } from "../Actions/get-policies";
import useSWR from "swr";
import type { OrganizationPolicy } from "@bubba/db";

const POLICIES_OVERVIEW_KEY = "policies-overview";

async function fetchPolicies(): Promise<OrganizationPolicy[]> {
  const response = await getPolicies({});

  if (!response?.data?.success || !response.data.data) {
    throw new Error(response?.data?.error || "Failed to fetch policy data");
  }

  return response.data.data;
}

export function usePolicies() {
  const { data, error, isLoading, mutate } = useSWR<OrganizationPolicy[]>(
    [POLICIES_OVERVIEW_KEY],
    fetchPolicies,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
}
