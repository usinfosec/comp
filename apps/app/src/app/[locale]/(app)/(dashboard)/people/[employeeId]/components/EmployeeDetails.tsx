"use client";

import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { useI18n } from "@/locales/client";
import { useEmployeeDetails } from "../../hooks/useEmployee";
import { Skeleton } from "@bubba/ui/skeleton";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@bubba/ui/alert";
import { Label } from "@bubba/ui/label";
import { formatDate } from "@/utils/format";
import { Button } from "@bubba/ui/button";
import { EditableDepartment } from "./EditableDepartment";
import type { Departments } from "@bubba/db/types";

interface EmployeeDetailsProps {
	employeeId: string;
}

export function EmployeeDetails({ employeeId }: EmployeeDetailsProps) {
	const t = useI18n();
	const { employee, isLoading, error, mutate } = useEmployeeDetails(employeeId);

	if (error) {
		if (error.code === "NOT_FOUND") {
			redirect("/people");
		}

		return (
			<div className="p-6">
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>
						{error.message || "An unexpected error occurred"}
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="space-y-6 p-6">
				<div className="flex flex-col space-y-4">
					<Skeleton className="h-8 w-48" />
					<Skeleton className="h-4 w-32" />
				</div>
				<div className="grid gap-4 md:grid-cols-2">
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-32" />
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<Skeleton className="h-2 w-full" />
								<Skeleton className="h-4 w-24" />
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	if (!employee) return null;

	const tasks = employee.employeeTasks ?? [];

	return (
		<div className="space-y-6">
			<Card>
				<CardContent className="p-8">
					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-2">
							<Label>Name</Label>
							<p>{employee.name}</p>
						</div>
						<div className="flex flex-col gap-2">
							<Label>Email</Label>
							<p>{employee.email}</p>
						</div>
						<div className="flex flex-col gap-2">
							<Label>Join Date</Label>
							<p>
								{formatDate(employee.createdAt.toISOString(), "MMM d, yyyy")}
							</p>
						</div>
						<EditableDepartment
							employeeId={employee.id}
							currentDepartment={employee.department as Departments}
							onSuccess={() => mutate()}
						/>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Employee Tasks</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-2">
					{tasks.map((task) => {
						const isCompleted = task.status === "completed";

						return (
							<div
								key={task.id}
								className="flex items-center gap-2 border p-3 justify-between max-w-sm"
							>
								<h2 className="flex items-center gap-2">
									{isCompleted ? (
										<CheckCircle2 className="h-4 w-4 text-green-500" />
									) : (
										<AlertCircle className="h-4 w-4 text-red-500" />
									)}
									{task.requiredTask.name}
								</h2>
								<Button size="sm">Remind</Button>
							</div>
						);
					})}
				</CardContent>
			</Card>
		</div>
	);
}
