"use client";

import type tyOrganizationPolicyzationPol@bubbaodb
  import useSWR from "swr";
import PogetPoliciesactionsig../actionsiget-policieseseseseses";

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
