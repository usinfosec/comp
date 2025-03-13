"use client";

import { useCallback, useState } from "react";
import useSWR from "swr";
import { getFrameworksAction } from "../actions/getFrameworksAction";
import { selectFrameworksAction } from "../actions/selectFrameworksAction";

async function fetchFrameworks() {
  const result = await getFrameworksAction();

  if (!result) {
    throw new Error("Failed to fetch frameworks");
  }

  const data = result.data?.data;

  if (!data) {
    throw new Error("Invalid response from server");
  }

  return data;
}

export function useFrameworks() {
  const {
    data,
    error,
    isLoading,
    mutate: revalidateFrameworks,
  } = useSWR("frameworks", () => fetchFrameworks());

  const [isMutating, setIsMutating] = useState(false);

  const selectFrameworks = useCallback(
    async (frameworkIds: string[]) => {
      setIsMutating(true);
      try {
        const result = await selectFrameworksAction({ frameworkIds });

        if (!result?.data) {
          throw new Error("Failed to select frameworks");
        }

        await revalidateFrameworks();
      } catch (err) {
        console.error("selectFrameworksAction failed:", err);
        throw err;
      } finally {
        setIsMutating(false);
      }
    },
    [revalidateFrameworks]
  );

  return {
    frameworks: data?.frameworks ?? [],
    availableFrameworks: data?.availableFrameworks ?? [],
    isLoading,
    isMutating,
    error,
    revalidateFrameworks,
    selectFrameworks,
  };
}
