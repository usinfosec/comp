"use client";

import useSWR from "swr";
import { getEvidenceDashboard } from "../actions/getEvidenceDashboard";

async function fetchEvidenceDashboard() {
  try {
    const result = await getEvidenceDashboard();

    if (!result) {
      throw new Error("No result received");
    }

    if (result.serverError) {
      throw new Error(result.serverError);
    }

    return result.data?.data;
  } catch (error) {
    console.error("Error fetching evidence dashboard:", error);
    throw error;
  }
}

export function useEvidenceDashboard() {
  return useSWR("evidence-dashboard", fetchEvidenceDashboard, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
}
