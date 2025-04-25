"use client";

import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { chartConfig } from "../config";
import { useAnalyticsSWRKeyWithSecret } from "./useAnalyticsSWRKeyWithSecret";

interface TaskAnalyticsData {
	allTimeTotal: number;
	allTimePublished: number;
	allTimeDraft: number;
	allTimeNotRelevant: number;
	last30DaysTotal: number;
	last30DaysPublished: number;
	last30DaysDraft: number;
	last30DaysNotRelevant: number;
	last30DaysTotalByDay: Array<{
		date: string;
		count: number;
	}>;
	percentageChangeLast30Days: number | null;
}

const API_ENDPOINT = "/internal/dashboard/api/task";

export function useTaskAnalytics() {
	const key = useAnalyticsSWRKeyWithSecret(API_ENDPOINT);

	const { data, error, isLoading } = useSWR<TaskAnalyticsData>(key, fetcher, {
		refreshInterval: chartConfig.refreshIntervals.task,
		revalidateOnFocus: true,
		revalidateOnReconnect: true,
	});

	return {
		data,
		isLoading,
		isError: error,
	};
}
