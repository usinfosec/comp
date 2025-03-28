"use client";

import * as React from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardFooter,
	CardTitle,
} from "@bubba/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	type ChartConfig,
} from "@bubba/ui/chart";
import { useI18n } from "@/locales/client";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import type { TooltipProps } from "recharts";

// Use correct types from the database
import type { PortalUser } from "@prisma/client";
import type {
	OrganizationPolicy,
	OrganizationTrainingVideos,
} from "@prisma/client";
import { employeeDetailsInputSchema } from "../../[employeeId]/types";

interface EmployeeCompletionData {
	id: string;
	name: string;
	total: number;
	policiesCompleted: number;
	policiesPending: number;
	trainingsCompleted: number;
	trainingsPending: number;
}

interface EmployeeCompletionChartProps {
	employees: PortalUser[];
	policies: OrganizationPolicy[];
	trainingVideos: OrganizationTrainingVideos[];
}

const CHART_COLORS = {
	policiesCompleted: "hsl(var(--chart-positive))", // green
	policiesPending: "hsl(var(--chart-neutral))", // yellow
	trainingsCompleted: "hsl(var(--chart-other))", // blue
	trainingsPending: "hsl(var(--chart-warning))", // gray
};

// Custom tooltip component with better spacing
const CustomTooltip = ({
	active,
	payload,
	label,
}: TooltipProps<number, string>) => {
	if (!active || !payload || !payload.length) {
		return null;
	}

	return (
		<div className="grid min-w-[8rem] items-start gap-2 rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl z-30">
			<div className="font-medium">{label}</div>
			<div className="grid gap-2">
				{payload.map((entry) => (
					<div
						key={`tooltip-${entry.dataKey}`}
						className="flex items-center gap-2"
					>
						<div
							className="h-3 w-3 rounded-[2px]"
							style={{ backgroundColor: entry.color }}
						/>
						<div className="flex w-full justify-between">
							<span className="text-muted-foreground pr-6">{entry.name}</span>
							<span className="font-mono font-medium tabular-nums">
								{entry.value}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export function EmployeeCompletionChart({
	employees,
	policies,
	trainingVideos,
}: EmployeeCompletionChartProps) {
	const t = useI18n();

	const completionData = React.useMemo(() => {
		return employees.map((employee) => {
			// Count policies completed by this employee
			const policiesCompletedCount = policies.filter((policy) =>
				policy.signedBy.includes(employee.id),
			).length;

			// Count policies pending for this employee
			const policiesPendingCount = policies.length - policiesCompletedCount;

			// Count training videos completed by this employee
			const trainingsCompletedCount = trainingVideos.filter(
				(video) =>
					video.completedBy &&
					Array.isArray(video.completedBy) &&
					video.completedBy.includes(employee.id),
			).length;

			// Count training videos pending for this employee
			const trainingsPendingCount =
				trainingVideos.length - trainingsCompletedCount;

			const totalCompleted = policiesCompletedCount + trainingsCompletedCount;

			return {
				id: employee.id,
				name: employee.name || employee.email.split("@")[0],
				email: employee.email,
				policiesCompleted: policiesCompletedCount,
				policiesPending: policiesPendingCount,
				trainingsCompleted: trainingsCompletedCount,
				trainingsPending: trainingsPendingCount,
				total: totalCompleted,
			};
		});
	}, [employees, policies, trainingVideos]);

	// Check for empty data scenarios
	if (!employees.length) {
		return (
			<Card className="flex flex-col">
				<CardHeader>
					<CardTitle>
						{t("people.dashboard.employee_task_completion")}
					</CardTitle>
				</CardHeader>
				<CardContent className="flex-1 flex items-center justify-center">
					<p className="text-center text-sm text-muted-foreground">
						{t("people.dashboard.no_data")}
					</p>
				</CardContent>
			</Card>
		);
	}

	// Check if there are any tasks to complete
	if (policies.length === 0 && trainingVideos.length === 0) {
		return (
			<Card className="flex flex-col">
				<CardHeader>
					<CardTitle>
						{t("people.dashboard.employee_task_completion")}
					</CardTitle>
				</CardHeader>
				<CardContent className="flex-1 flex items-center justify-center">
					<p className="text-center text-sm text-muted-foreground">
						{t("people.dashboard.no_tasks_available")}
					</p>
				</CardContent>
			</Card>
		);
	}

	// Sort and limit to top 5 employees by total completion
	const sortedData = React.useMemo(() => {
		return [...completionData]
			.sort((a, b) => b.total - a.total)
			.slice(0, 5)
			.reverse();
	}, [completionData]);

	const chartData = sortedData.map((item) => ({
		name: item.name,
		email: item.email,
		policiesCompleted: item.policiesCompleted,
		policiesPending: item.policiesPending,
		trainingsCompleted: item.trainingsCompleted,
		trainingsPending: item.trainingsPending,
	}));

	const chartConfig = {
		policiesCompleted: {
			label: t("people.dashboard.policies_completed"),
			color: CHART_COLORS.policiesCompleted,
		},
		policiesPending: {
			label: t("people.dashboard.policies_pending"),
			color: CHART_COLORS.policiesPending,
		},
		trainingsCompleted: {
			label: t("people.dashboard.trainings_completed"),
			color: CHART_COLORS.trainingsCompleted,
		},
		trainingsPending: {
			label: t("people.dashboard.trainings_pending"),
			color: CHART_COLORS.trainingsPending,
		},
	} satisfies ChartConfig;

	return (
		<Card className="flex flex-col">
			<CardHeader>
				<CardTitle>{t("people.dashboard.employee_task_completion")}</CardTitle>
			</CardHeader>
			<CardContent className="flex-1">
				<ChartContainer config={chartConfig}>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart
							accessibilityLayer
							data={chartData}
							layout="vertical"
							barSize={15}
							barGap={5}
							margin={{
								top: 20,
								right: 30,
								bottom: 10,
								left: 0,
							}}
						>
							<XAxis type="number" hide />
							<YAxis
								dataKey="email"
								type="category"
								tickLine={false}
								tickMargin={10}
								axisLine={false}
								width={175}
								tickFormatter={(value) => value}
							/>
							<ChartTooltip content={<CustomTooltip />} />
							<Bar
								dataKey="policiesCompleted"
								fill={CHART_COLORS.policiesCompleted}
								name={t("people.dashboard.policies_completed")}
							/>
							<Bar
								dataKey="policiesPending"
								fill={CHART_COLORS.policiesPending}
								name={t("people.dashboard.policies_pending")}
							/>
							<Bar
								dataKey="trainingsCompleted"
								fill={CHART_COLORS.trainingsCompleted}
								name={t("people.dashboard.trainings_completed")}
							/>
							<Bar
								dataKey="trainingsPending"
								fill={CHART_COLORS.trainingsPending}
								name={t("people.dashboard.trainings_pending")}
							/>
						</BarChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
			<CardFooter>
				<div className="flex flex-wrap gap-4 py-2">
					{Object.entries(chartConfig).map(([key, config]) => (
						<div key={key} className="flex items-center gap-2">
							<div
								className="h-3 w-3"
								style={{ backgroundColor: config.color }}
							/>
							<span className="text-xs">{config.label}</span>
						</div>
					))}
				</div>
			</CardFooter>
		</Card>
	);
}
