"use client";

import type { EmployeeStatusType } from "@/components/tables/people/employee-status";
import { formatDate } from "@/utils/format";
import type { Departments, Employee, Policy } from "@bubba/db/types";
import { Alert, AlertDescription, AlertTitle } from "@bubba/ui/alert";
import { Button } from "@bubba/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@bubba/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@bubba/ui/select";
import { Skeleton } from "@bubba/ui/skeleton";
import { AlertCircle, CheckCircle2, Save } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useEmployeeDetails } from "../../all/hooks/useEmployee";
import { updateEmployee } from "../actions/update-employee";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@bubba/ui/tabs";
import { TrainingVideo } from "@bubba/data";

const DEPARTMENTS: { value: Departments; label: string }[] = [
	{ value: "admin", label: "Admin" },
	{ value: "gov", label: "Governance" },
	{ value: "hr", label: "HR" },
	{ value: "it", label: "IT" },
	{ value: "itsm", label: "IT Service Management" },
	{ value: "qms", label: "Quality Management" },
	{ value: "none", label: "None" },
];

const STATUS_OPTIONS: { value: EmployeeStatusType; label: string }[] = [
	{ value: "active", label: "Active" },
	{ value: "inactive", label: "Inactive" },
];

interface EmployeeDetailsProps {
	employeeId: string;
	employee: Employee;
	policies: Policy[];
	trainingVideos: TrainingVideo[];
}

export function EmployeeDetails({
	employeeId,
	employee,
	policies,
	trainingVideos,
}: EmployeeDetailsProps) {
	const { isLoading, error, mutate } = useEmployeeDetails(employeeId);
	const { orgId } = useParams<{ orgId: string }>();
	const [isSaving, setIsSaving] = useState(false);
	const [department, setDepartment] = useState<Departments | null>(null);
	const [status, setStatus] = useState<EmployeeStatusType | null>(null);
	const [hasChanges, setHasChanges] = useState(false);

	// Set initial values when employee data loads
	useEffect(() => {
		if (employee) {
			setDepartment(employee.department as Departments);
			setStatus(employee.isActive ? "active" : "inactive");
		}
	}, [employee]);

	// Track changes
	useEffect(() => {
		if (employee) {
			const departmentChanged =
				department !== null && department !== employee.department;
			const statusChanged =
				status !== null &&
				((status === "active" && !employee.isActive) ||
					(status === "inactive" && employee.isActive));

			setHasChanges(departmentChanged || statusChanged);
		}
	}, [department, status, employee]);

	const { execute } = useAction(updateEmployee, {
		onSuccess: () => {
			toast.success("Employee details updated successfully");
			mutate();
			setHasChanges(false);
		},
		onError: (error) => {
			toast.error(
				error?.error?.serverError || "Failed to update employee details",
			);
		},
	});

	if (error) {
		if (error.code === "UNEXPECTED_ERROR") {
			redirect(`/${orgId}/employees`);
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
			<div className="flex flex-col gap-4">
				<Skeleton className="h-20 w-full" />
				<Skeleton className="h-40 w-full" />
				<Skeleton className="h-60 w-full" />
			</div>
		);
	}

	if (!employee) return null;

	const handleDepartmentChange = (value: Departments) => {
		setDepartment(value);
	};

	const handleStatusChange = (value: EmployeeStatusType) => {
		setStatus(value);
	};

	const handleSave = async () => {
		setIsSaving(true);
		try {
			// Prepare update data
			const updateData: {
				employeeId: string;
				department?: string;
				isActive?: boolean;
			} = { employeeId };

			// Only include changed fields
			if (department && department !== employee.department) {
				updateData.department = department;
			}

			if (status) {
				const isActive = status === "active";
				if (isActive !== employee.isActive) {
					updateData.isActive = isActive;
				}
			}

			// Execute the update
			await execute(updateData);
		} catch (error) {
			toast.error("Failed to update employee details");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="flex flex-col gap-4">
			{/* Employee Details Section */}
			<Card className="p-6">
				<CardHeader className="px-0 pt-0 pb-6">
					<CardTitle className="text-2xl font-semibold">
						Employee Details
					</CardTitle>
					<p className="text-muted-foreground">
						Manage employee information and department assignment
					</p>
				</CardHeader>
				<CardContent className="px-0 pb-8 space-y-8">
					{/* Personal Info Section */}
					<div>
						<h3 className="text-xs font-medium text-muted-foreground uppercase mb-3">
							Personal Info
						</h3>
						<div className="grid grid-cols-2 gap-10">
							<div>
								<p className="text-sm font-medium mb-1">Name</p>
								<p className="text-sm">{employee.name}</p>
							</div>
							<div>
								<p className="text-sm font-medium mb-1">Email</p>
								<p className="text-sm">{employee.email}</p>
							</div>
						</div>
					</div>

					{/* Department & Status Row */}
					<div className="grid grid-cols-2 gap-10">
						<div>
							<h3 className="text-xs font-medium text-muted-foreground uppercase mb-3">
								Department
							</h3>
							<Select
								value={department || employee.department}
								onValueChange={(value) =>
									handleDepartmentChange(value as Departments)
								}
							>
								<SelectTrigger className="h-10">
									<SelectValue placeholder="Select department" />
								</SelectTrigger>
								<SelectContent>
									{DEPARTMENTS.map((dept) => (
										<SelectItem key={dept.value} value={dept.value}>
											{dept.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div>
							<h3 className="text-xs font-medium text-muted-foreground uppercase mb-3">
								Status
							</h3>
							<Select
								value={status || (employee.isActive ? "active" : "inactive")}
								onValueChange={(value) =>
									handleStatusChange(value as EmployeeStatusType)
								}
							>
								<SelectTrigger className="h-10">
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent>
									{STATUS_OPTIONS.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Join Date Row */}
					<div className="grid grid-cols-2 gap-10">
						<div>
							<h3 className="text-xs font-medium text-muted-foreground uppercase mb-3">
								Join Date
							</h3>
							<p className="text-sm">
								{formatDate(employee.createdAt.toISOString(), "MMM d, yyyy")}
							</p>
						</div>
						<div />
					</div>
				</CardContent>
				<CardFooter className="px-0 py-0 flex justify-end outline-none border-none">
					<Button
						onClick={handleSave}
						disabled={!hasChanges || isSaving}
						className="w-auto"
					>
						{isSaving ? "Saving..." : "Save"}
						{!isSaving && <Save className="ml-2 h-4 w-4" />}
					</Button>
				</CardFooter>
			</Card>

			{/* Tasks Section */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
						<div>
							<h2 className="text-lg font-medium">Employee Tasks</h2>
							<h3 className="text-sm text-muted-foreground">
								View and manage employee tasks and their status
							</h3>
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="policies">
						<TabsList className="mb-4">
							<TabsTrigger value="policies">Policies</TabsTrigger>
							<TabsTrigger value="training">Training Videos</TabsTrigger>
						</TabsList>

						<TabsContent value="policies">
							<div className="flex flex-col gap-2">
								{policies.length === 0 ? (
									<div className="text-center py-6 text-muted-foreground">
										<p>No policies required to sign.</p>
									</div>
								) : (
									policies.map((policy) => {
										const isCompleted = policy.signedBy.includes(employee.id);

										return (
											<div
												key={policy.id}
												className="flex items-center gap-2 border p-3 justify-between"
											>
												<h2 className="flex items-center gap-2">
													{isCompleted ? (
														<CheckCircle2 className="h-4 w-4 text-green-500" />
													) : (
														<AlertCircle className="h-4 w-4 text-red-500" />
													)}
													{policy.name}
												</h2>
											</div>
										);
									})
								)}
							</div>
						</TabsContent>

						<TabsContent value="training">
							<div className="flex flex-col gap-2">
								{trainingVideos.length === 0 ? (
									<div className="text-center py-6 text-muted-foreground">
										<p>No training videos required to watch.</p>
									</div>
								) : (
									trainingVideos.map((video) => {
										// const isCompleted = video.completedBy.includes(employee.id);

										return (
											<div
												key={video.id}
												className="flex items-center gap-2 border p-3 justify-between"
											>
												<h2 className="flex items-center gap-2">
													{/* {isCompleted ? (
														<CheckCircle2 className="h-4 w-4 text-green-500" />
													) : (
														<AlertCircle className="h-4 w-4 text-red-500" />
													)} */}
													{video.title}
												</h2>
											</div>
										);
									})
								)}
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
