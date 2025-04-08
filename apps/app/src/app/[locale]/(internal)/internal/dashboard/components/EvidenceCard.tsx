"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { Skeleton } from "@comp/ui/skeleton";
import { useEvidenceAnalytics } from "../hooks/useEvidenceAnalytics";

export function EvidenceCard() {
	const {
		data: evidenceData,
		isLoading: isEvidenceLoading,
		isError: isEvidenceError,
	} = useEvidenceAnalytics();

	if (isEvidenceError) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Evidence</CardTitle>
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
				<CardTitle>Evidence</CardTitle>
			</CardHeader>
			<CardContent>
				{isEvidenceLoading ? (
					<div className="space-y-2">
						<Skeleton className="h-4 w-[150px]" />
						<Skeleton className="h-4 w-[120px]" />
						<Skeleton className="h-4 w-[100px]" />
						<Skeleton className="h-4 w-[130px]" />
					</div>
				) : (
					<div className="space-y-1 text-sm">
						<p>Total: {evidenceData?.total ?? "N/A"}</p>
						<p>Published: {evidenceData?.published ?? "N/A"}</p>
						<p>Draft: {evidenceData?.draft ?? "N/A"}</p>
						<p>Not Relevant: {evidenceData?.notRelevant ?? "N/A"}</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
