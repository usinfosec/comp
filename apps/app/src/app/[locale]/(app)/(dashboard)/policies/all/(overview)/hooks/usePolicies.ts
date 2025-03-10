"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";

import { getPolicies } from "../actions/get-policies";

import type { AppError, PoliciesInput, PoliciesResponse } from "../types";

async function fetchPolicies(input: PoliciesInput): Promise<PoliciesResponse> {
  const result = await getPolicies(input);

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

  return result.data?.data as PoliciesResponse;
}

export function usePolicies({
  search = "",
  status = "",
  ownerId = "",
  sort = "",
  page = 1,
  pageSize = 10,
}: PoliciesInput) {
  const {
    data,
    error,
    isLoading,
    mutate: revalidatePolicies,
  } = useSWR<PoliciesResponse, AppError>(
    ["policies", { search, status, page, pageSize, ownerId, sort }],
    () => fetchPolicies({ search, status, page, pageSize, ownerId, sort }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    policies: data?.policies ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
    revalidatePolicies,
  };
}
