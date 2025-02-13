"use client";

import useSWR from "swr";
import {
  getOrganizationCategories,
  OrganizationCategoryWithControls,
} from "../Actions/getOrganizationCategories";

async function fetchOrganizationCategories(
  frameworkId: string
): Promise<OrganizationCategoryWithControls[]> {
  const result = await getOrganizationCategories({ frameworkId });

  console.log({ result });

  if (!result) {
    throw new Error("Failed to fetch frameworks");
  }

  const data = result.data?.data;
  if (!data) {
    throw new Error("Invalid response from server");
  }

  return data;
}

export function useOrganizationCategories(frameworkId: string) {
  const { data, error, isLoading, mutate } = useSWR<
    OrganizationCategoryWithControls[]
  >(
    ["organization-categories", frameworkId],
    () => fetchOrganizationCategories(frameworkId),
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
