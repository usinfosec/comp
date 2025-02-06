"use client";

import useSWR from "swr";
import { getEmployees } from "../actions/get-employees";
import type { EmployeesResponse, AppError, EmployeesInput } from "../types";
import { useSearchParams } from "next/navigation";

async function fetchEmployees(
  input: EmployeesInput
): Promise<EmployeesResponse> {
  const result = await getEmployees(input);

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

  return result.data?.data as EmployeesResponse;
}

export function useEmployees() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || undefined;
  const role = searchParams.get("role") || undefined;
  const page = Number(searchParams.get("page")) || 1;
  const per_page = Number(searchParams.get("per_page")) || 10;

  const { data, error, isLoading, mutate } = useSWR<
    EmployeesResponse,
    AppError
  >(
    ["employees", { search, role, page, per_page }],
    () => fetchEmployees({ search, role, page, per_page }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    employees: data?.employees ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
    mutate,
  };
}
