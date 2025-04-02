"use client";

import { useI18n } from "@/locales/client";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import * as React from "react";
import type { CSSProperties } from "react";

// Use correct types from the database
import { TrainingVideo } from "@bubba/data";
import {
	EmployeeTrainingVideoCompletion,
	Member,
	Policy,
	User,
} from "@bubba/db/types";

interface EmployeeCompletionChartProps {
	employees: (Member & {
		user: User;
	})[];
	policies: Policy[];
	trainingVideos: (EmployeeTrainingVideoCompletion & {
		metadata: TrainingVideo;
	})[];
}

// Define colors for the chart
const taskColors = {
	policies: "bg-primary",
	trainings: "bg-[var(--chart-open)]",
	incomplete: "bg-muted",
};

interface EmployeeTaskStats {
	id: string;
	name: string;
	email: string;
	totalTasks: number;
	policiesCompleted: number;
	trainingsCompleted: number;
	policiesTotal: number;
	trainingsTotal: number;
	policyPercentage: number;
	trainingPercentage: number;
	overallPercentage: number;
}

export function EmployeeCompletionChart({
	employees,
	policies,
	trainingVideos,
}: EmployeeCompletionChartProps) {
	const t = useI18n();

	// Calculate completion data for each employee
	const employeeStats: EmployeeTaskStats[] = React.useMemo(() => {
		return employees.map((employee) => {
			// Count policies completed by this employee
			const policiesCompletedCount = policies.filter((policy) =>
				policy.signedBy.includes(employee.id),
			).length;

			// Calculate policy completion percentage
			const policyCompletionPercentage = policies.length
				? Math.round((policiesCompletedCount / policies.length) * 100)
				: 0;

			// Count training videos completed by this employee
			const employeeTrainingVideos = trainingVideos.filter(
				(video) => video.memberId === employee.id && video.completedAt !== null,
			);
			const trainingsCompletedCount = employeeTrainingVideos.length;

			// Get the total unique training videos available
			const uniqueTrainingVideosIds = [
				...new Set(trainingVideos.map((video) => video.metadata.id)),
			];
			const trainingVideosTotal = uniqueTrainingVideosIds.length;

			// Calculate training completion percentage
			const trainingCompletionPercentage = trainingVideosTotal
				? Math.round((trainingsCompletedCount / trainingVideosTotal) * 100)
				: 0;

			// Calculate total completion percentage
			const totalItems = policies.length + trainingVideosTotal;
			const totalCompletedItems =
				policiesCompletedCount + trainingsCompletedCount;

			const overallPercentage = totalItems
				? Math.round((totalCompletedItems / totalItems) * 100)
				: 0;

			return {
				id: employee.id,
				name: employee.user.name || employee.user.email.split("@")[0],
				email: employee.user.email,
				totalTasks: totalItems,
				policiesCompleted: policiesCompletedCount,
				trainingsCompleted: trainingsCompletedCount,
				policiesTotal: policies.length,
				trainingsTotal: trainingVideosTotal,
				policyPercentage: policyCompletionPercentage,
				trainingPercentage: trainingCompletionPercentage,
				overallPercentage,
			};
		});
	}, [employees, policies, trainingVideos]);

	// Check for empty data scenarios
	if (!employees.length) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>
						{t("people.dashboard.employee_task_completion")}
					</CardTitle>
				</CardHeader>
				<CardContent className="flex items-center justify-center h-[300px]">
					<p className="text-center text-sm text-muted-foreground">
						{t("people.dashboard.no_data")}
					</p>
				</CardContent>
			</Card>
		);
	}

	// Check if there are any tasks to complete
	if (policies.length === 0 && !trainingVideos.length) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>
						{t("people.dashboard.employee_task_completion")}
					</CardTitle>
				</CardHeader>
				<CardContent className="flex items-center justify-center h-[300px]">
					<p className="text-center text-sm text-muted-foreground">
						{t("people.dashboard.no_tasks_available")}
					</p>
				</CardContent>
			</Card>
		);
	}

	// Sort by completion percentage and limit to top 5
	const sortedStats = [...employeeStats]
		.sort((a, b) => b.overallPercentage - a.overallPercentage)
		.slice(0, 5);

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("people.dashboard.employee_task_completion")}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-8">
					{sortedStats.map((stat) => (
						<div key={stat.id} className="space-y-2">
							<div className="flex justify-between items-center text-sm">
								<p>{stat.name}</p>
								<span className="text-muted-foreground">
									{stat.policiesCompleted + stat.trainingsCompleted} /{" "}
									{stat.totalTasks} {t("common.tasks")}
								</span>
							</div>

							<TaskBarChart stat={stat} />

							<div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
								<div className="flex items-center gap-1">
									<div className="size-2 bg-primary" />
									<span>
										{t("people.dashboard.policies")} ({stat.policiesCompleted}/
										{stat.policiesTotal})
									</span>
								</div>
								<div className="flex items-center gap-1">
									<div className="size-2 bg-[var(--chart-open)]" />
									<span>
										{t("people.dashboard.trainings")} ({stat.trainingsCompleted}
										/{stat.trainingsTotal})
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

function TaskBarChart({ stat }: { stat: EmployeeTaskStats }) {
	// Only include segments that have values > 0
	const data = [
		...(stat.policiesCompleted > 0
			? [
					{
						key: "policies",
						value: stat.policiesCompleted,
						color: taskColors.policies,
						label: "Policies",
					},
				]
			: []),
		...(stat.trainingsCompleted > 0
			? [
					{
						key: "trainings",
						value: stat.trainingsCompleted,
						color: taskColors.trainings,
						label: "Trainings",
					},
				]
			: []),
	];

	const barHeight = 12;

	// Either show all task types, or show empty bar if nothing is completed
	if (stat.policiesCompleted + stat.trainingsCompleted === 0) {
		return <div className="h-3 bg-muted" />;
	}

	// Calculate total width including gaps
	const totalWidth = stat.totalTasks;
	let cumulativeWidth = 0;

	return (
		<div
			className="relative h-[var(--height)]"
			style={{ "--height": `${barHeight}px` } as CSSProperties}
		>
			<div className="absolute inset-0 h-full w-full overflow-visible">
				{/* Completed tasks segments */}
				{data.map((d) => {
					const percentWidth = (d.value / totalWidth) * 100;
					const xPosition = (cumulativeWidth / totalWidth) * 100;
					cumulativeWidth += d.value;

					return (
						<div
							key={d.key}
							className="absolute"
							style={{
								width: `${percentWidth}%`,
								height: `${barHeight}px`,
								left: `${xPosition}%`,
							}}
						>
							<div
								className={d.color}
								style={{
									width: "100%",
									height: "100%",
								}}
								title={`${d.label}: ${d.value}`}
							/>
						</div>
					);
				})}

				{/* Incomplete tasks segment */}
				{stat.totalTasks - cumulativeWidth > 0 && (
					<div
						className="absolute"
						style={{
							width: `${((stat.totalTasks - cumulativeWidth) / totalWidth) * 100}%`,
							height: `${barHeight}px`,
							left: `${(cumulativeWidth / totalWidth) * 100}%`,
						}}
					>
						<div
							className={taskColors.incomplete}
							style={{
								width: "100%",
								height: "100%",
							}}
							title={`Incomplete: ${stat.totalTasks - cumulativeWidth}`}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
