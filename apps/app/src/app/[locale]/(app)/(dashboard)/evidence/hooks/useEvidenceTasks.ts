"use client";

import useSWR from "swr";
import { getOrganizationEvidenceTasks } from "../Actions/getOrganizationEvidenceTasks";

interface UseOrganizationEvidenceTasksProps {
  search?: string | null;
}

async function fetchEvidenceTasks({
  search,
}: UseOrganizationEvidenceTasksProps) {
  const result = await getOrganizationEvidenceTasks({ search });

  if (!result || "error" in result) {
    throw new Error(
      typeof result?.error === "string"
        ? result.error
        : "Failed to fetch evidence tasks"
    );
  }

  return result.data?.data;
}

export function useOrganizationEvidenceTasks({
  search,
}: UseOrganizationEvidenceTasksProps = {}) {
  return useSWR(
    ["organization-evidence-tasks", search],
    () => fetchEvidenceTasks({ search }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
}
