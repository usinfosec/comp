"use client";

import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import { useAnalyticsSWRKeyWithSecret } from "./useAnalyticsSWRKeyWithSecret";
import { chartConfig } from "../config";

interface EvidenceAnalyticsData {
	total: number;
	published: number;
	draft: number;
	notRelevant: number;
	byMonth: Array<{
		date: string;
		count: number;
	}>;
	byAssignee: Array<{
		assignee: {
			id: string;
			name: string | null;
			email: string | null;
		} | null;
		count: number;
	}>;
}

const API_ENDPOINT = "/internal/dashboard/api/evidence";

export function useEvidenceAnalytics() {
	const key = useAnalyticsSWRKeyWithSecret(API_ENDPOINT);

	const { data, error, isLoading } = useSWR<EvidenceAnalyticsData>(
		key,
		fetcher,
		{
			refreshInterval: chartConfig.refreshIntervals.evidence,
			revalidateOnFocus: true,
			revalidateOnReconnect: true,
		},
	);

	return {
		data,
		isLoading,
		isError: error,
	};
}
