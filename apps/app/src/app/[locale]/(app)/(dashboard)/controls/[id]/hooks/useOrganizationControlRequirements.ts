"use client";

import type { OrganizationControlRequirement } from "@bubba/db";
import useSWR from "swr";
import { getOrganizationControlRequirements } from "../Actions/getOrganizationControlRequirements";

async function fetchOrganizationControlRequirements(
  controlId: string
): Promise<OrganizationControlRequirement[]> {
  const result = await getOrganizationControlRequirements({ controlId });

  if (!result) {
    throw new Error("Failed to fetch control");
  }

  const data = result.data?.data;
  if (!data) {
    throw new Error("Invalid response from server");
  }

  return data.organizationControlRequirements;
}

export function useOrganizationControlRequirements(controlId: string) {
  const { data, error, isLoading, mutate } = useSWR<
    OrganizationControlRequirement[]
  >(
    ["organization-control-requirements", controlId],
    () => fetchOrganizationControlRequirements(controlId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    data: data,
    isLoading,
    error,
    mutate,
  };
}
