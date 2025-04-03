"use client";

import { useState, useEffect } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@bubba/ui/select";
import { Departments } from "@bubba/db/types";

interface DepartmentSectionProps {
	evidenceId: string;
	currentDepartment: string | null;
	onDepartmentChange: (value: string | null) => void;
	department: string | null;
	disabled?: boolean;
}

export function DepartmentSection({
	currentDepartment,
	onDepartmentChange,
	department,
	disabled = false,
}: DepartmentSectionProps) {
	useEffect(() => {
		if (department !== currentDepartment) {
			onDepartmentChange(currentDepartment || null);
		}
	}, [currentDepartment, onDepartmentChange, department]);

	const handleDepartmentChange = (value: string) => {
		const newDepartment = value === "none" ? null : value;
		onDepartmentChange(newDepartment);
	};

	// Filter out 'none' from the displayed options as we handle it separately
	const departmentOptions = Object.values(Departments).filter(
		(dept) => dept !== "none",
	);

	return (
		<Select
			value={department || "none"}
			onValueChange={handleDepartmentChange}
			disabled={disabled}
		>
			<SelectTrigger className="w-full h-9 text-sm">
				<SelectValue placeholder="Select department" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="none">None</SelectItem>
				{departmentOptions.map((dept) => (
					<SelectItem key={dept} value={dept}>
						{dept.replace(/_/g, " ").toUpperCase()}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
