"use client";

import { useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@bubba/ui/select";
import { Label } from "@bubba/ui/label";
import { Button } from "@bubba/ui/button";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { updateEmployeeDepartment } from "../actions/update-department";
import { Pencil, Check, X } from "lucide-react";
import type { Departments } from "@bubba/db/types";
import { cn } from "@bubba/ui/cn";

const DEPARTMENTS = [
	{ value: "admin", label: "Admin" },
	{ value: "gov", label: "Governance" },
	{ value: "hr", label: "HR" },
	{ value: "it", label: "IT" },
	{ value: "itsm", label: "IT Service Management" },
	{ value: "qms", label: "Quality Management" },
	{ value: "none", label: "None" },
];

interface EditableDepartmentProps {
	employeeId: string;
	currentDepartment: Departments;
	onSuccess?: () => void;
}

export function EditableDepartment({
	employeeId,
	currentDepartment,
	onSuccess,
}: EditableDepartmentProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [department, setDepartment] = useState(currentDepartment);

	const { execute, status } = useAction(updateEmployeeDepartment, {
		onSuccess: () => {
			toast.success("Department updated successfully");
			setIsEditing(false);
			onSuccess?.();
		},
		onError: (error) => {
			toast.error(error?.error?.serverError || "Failed to update department");
		},
	});

	const handleSave = () => {
		execute({ employeeId, department });
	};

	const handleCancel = () => {
		setDepartment(currentDepartment);
		setIsEditing(false);
	};

	if (!isEditing) {
		return (
			<div className="flex flex-col gap-2 max-w-full">
				<div className="flex items-center gap-1.5">
					<Label className="font-medium">Department</Label>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setIsEditing(true)}
						className="h-5 w-5 p-0"
					>
						<Pencil className="h-3.5 w-3.5" />
					</Button>
				</div>
				<p className="truncate">
					{DEPARTMENTS.find((d) => d.value === currentDepartment)?.label ||
						currentDepartment}
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2 max-w-full">
			<Label className="font-medium">Department</Label>
			<div className="flex flex-col sm:flex-row w-full gap-2">
				<Select
					value={department}
					onValueChange={(value) => setDepartment(value as Departments)}
				>
					<SelectTrigger
						className={cn("w-full max-w-full truncate", !isEditing && "hidden")}
					>
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
				<div className="flex items-center gap-1 self-start">
					<Button
						size="icon"
						variant="ghost"
						onClick={handleSave}
						disabled={status === "executing"}
						className="h-7 w-7 p-0"
					>
						<Check className="h-4 w-4" />
					</Button>
					<Button
						size="icon"
						variant="ghost"
						onClick={handleCancel}
						className="h-7 w-7 p-0"
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
