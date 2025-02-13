"use client";

import { OrganizationControl } from "@bubba/db";
import useSWR from "swr";
import {
  getOrganizationControl,
  OrganizationControlResponse,
} from "../Actions/getOrganizationControl";

async function fetchOrganizationControl(
  controlId: string
): Promise<OrganizationControlResponse> {
  const result = await getOrganizationControl({ controlId });

  if (!result) {
    throw new Error("Failed to fetch control");
  }

  const data = result.data?.data;
  if (!data) {
    throw new Error("Invalid response from server");
  }

  return data;
}

export function useOrganizationControl(controlId: string) {
  const { data, error, isLoading, mutate } =
    useSWR<OrganizationControlResponse>(
      ["organization-control", controlId],
      () => fetchOrganizationControl(controlId),
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }
    );

  return {
    data: data?.organizationControl,
    isLoading,
    error,
    mutate,
  };
}
