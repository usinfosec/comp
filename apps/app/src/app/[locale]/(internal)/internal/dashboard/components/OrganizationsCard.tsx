"use client";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from "@comp/ui/card";
import { Skeleton } from "@comp/ui/skeleton";
import { useOrganizationsAnalytics } from "../hooks/useOrganizationsAnalytics";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@comp/ui/chart"; // Reverted import path

const chartConfig = {
	organizations: {
		label: "Organizations",
		color: "hsl(var(--chart-1))",
	},
} satisfies ChartConfig;

export function OrganizationsCard() {
	const {
		data: orgsData,
		isLoading: isOrgsLoading,
		isError: isOrgsError,
	} = useOrganizationsAnalytics();

	// Use the updated data fields from the hook
	const chartData = orgsData?.byDateLast30Days ?? []; // Use last 30 days data for the chart
	const totalCountLast30Days = orgsData?.countLast30Days ?? 0; // Use count from last 30 days
	const trendPercentage = orgsData?.changeLast30Days ?? 0;
	const dateRange = "Last 30 days";

	if (isOrgsError) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Organizations</CardTitle>
					<CardDescription>Daily trend over the last 30 days</CardDescription>
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
				<CardTitle>Organizations</CardTitle>
				<CardDescription>Daily trend over the last 30 days</CardDescription>
			</CardHeader>
			<CardContent>
				{isOrgsLoading ? (
					<div className="space-y-2">
						<Skeleton className="h-[150px] w-full" />{" "}
						{/* Updated skeleton height */}
						<Skeleton className="h-4 w-[150px]" />
					</div>
				) : (
					<ChartContainer config={chartConfig} className="h-[150px] w-full">
						<AreaChart
							accessibilityLayer
							data={chartData}
							margin={{
								left: 0,
								right: 0,
								top: 5,
								bottom: 5,
							}}
						>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="date"
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tickFormatter={(value) => {
									const date = new Date(value);
									return date.toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
									});
								}}
							/>
							<ChartTooltip
								cursor={false}
								content={
									<ChartTooltipContent
										indicator="line"
										nameKey="count"
										hideLabel
									/>
								} // Use count for value
							/>
							<Area
								dataKey="count" // Use count for data key
								type="linear"
								fill="var(--chart-closed)"
								fillOpacity={0.4}
								stroke="var(--chart-closed)"
							/>
						</AreaChart>
					</ChartContainer>
				)}
			</CardContent>
			<CardFooter>
				{isOrgsLoading ? (
					<Skeleton className="h-8 w-[200px]" />
				) : (
					<div className="flex w-full items-start gap-2 text-sm">
						<div className="grid gap-2">
							<div className="flex items-center gap-2 font-medium leading-none">
								Total: {totalCountLast30Days}
								{trendPercentage !== undefined && (
									<>
										( <TrendingUp className="h-4 w-4 text-emerald-500" />
										<span
											className={
												trendPercentage >= 0
													? "text-emerald-500"
													: "text-red-500"
											}
										>
											{trendPercentage >= 0 ? "+" : ""}
											{trendPercentage.toFixed(1)}%
										</span>
										)
									</>
								)}
							</div>
							<div className="flex items-center gap-2 leading-none text-muted-foreground">
								{dateRange}
							</div>
						</div>
					</div>
				)}
			</CardFooter>
		</Card>
	);
}
