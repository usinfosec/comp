"use client";

import useSWR from "swr";
import {
  getOrganizationControlsProgress,
  type ControlProgress,
} from "../Actions/getOrganizationControlsProgress";

async function fetchOrganizationControlsProgress(controlIds: string[]) {
  const result = await getOrganizationControlsProgress({ controlIds });

  if (!result || "error" in result || !result.data) {
    throw new Error("Failed to fetch controls progress");
  }

  return result.data.progress;
}

export function useOrganizationControlsProgress(controlIds: string[]) {
  const { data, error, isLoading, mutate } = useSWR<ControlProgress[]>(
    controlIds.length > 0
      ? ["organization-controls-progress", controlIds]
      : null,
    () => fetchOrganizationControlsProgress(controlIds),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    data: data?.reduce(
      (acc, curr) => {
        acc[curr.controlId] = curr;
        return acc;
      },
      {} as Record<string, ControlProgress>
    ),
    isLoading,
    error,
    mutate,
  };
}
