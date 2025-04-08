"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { Skeleton } from "@comp/ui/skeleton";
import { useUsersAnalytics } from "../hooks/useUsersAnalytics";

export function UsersCard() {
	const {
		data: usersData,
		isLoading: isUsersLoading,
		isError: isUsersError,
	} = useUsersAnalytics();

	if (isUsersError) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Users</CardTitle>
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
				<CardTitle>Users</CardTitle>
			</CardHeader>
			<CardContent>
				{isUsersLoading ? (
					<div className="space-y-2">
						<Skeleton className="h-4 w-[150px]" />
						<Skeleton className="h-4 w-[120px]" />
					</div>
				) : (
					<div className="space-y-1 text-sm">
						<p>Total: {usersData?.total ?? "N/A"}</p>
						<p>Active: {usersData?.active ?? "N/A"}</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
