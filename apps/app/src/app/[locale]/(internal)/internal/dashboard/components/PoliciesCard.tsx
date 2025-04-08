"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { Skeleton } from "@comp/ui/skeleton";
import { usePoliciesAnalytics } from "../hooks/usePoliciesAnalytics";

export function PoliciesCard() {
	const {
		data: policiesData,
		isLoading: isPoliciesLoading,
		isError: isPoliciesError,
	} = usePoliciesAnalytics();

	if (isPoliciesError) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Policies</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-destructive">Error loading data.</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Policies</CardTitle>
			</CardHeader>
			<CardContent>
				{isPoliciesLoading ? (
					<div className="space-y-2">
						<Skeleton className="h-4 w-[150px]" />
						<Skeleton className="h-4 w-[120px]" />
						<Skeleton className="h-4 w-[100px]" />
					</div>
				) : (
					<div className="space-y-1 text-sm">
						<p>Total: {policiesData?.total ?? "N/A"}</p>
						<p>Published: {policiesData?.published ?? "N/A"}</p>
						<p>Draft: {policiesData?.draft ?? "N/A"}</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
