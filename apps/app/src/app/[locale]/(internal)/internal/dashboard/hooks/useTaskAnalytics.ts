"use client";

import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { chartConfig } from "../config";
import { useAnalyticsSWRKeyWithSecret } from "./useAnalyticsSWRKeyWithSecret";

interface TaskAnalyticsData {
	allTimeTotal: number;
	allTimeDone: number;
	allTimeTodo: number;
	allTimeNotRelevant: number;
	last30DaysTotal: number;
	last30DaysDone: number;
	last30DaysTodo: number;
	last30DaysTotalByDay: Array<{
		date: string;
		count: number;
	}>;
	percentageChangeLast30Days: number | null;
}

const API_ENDPOINT = "/internal/dashboard/api/tasks";

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
