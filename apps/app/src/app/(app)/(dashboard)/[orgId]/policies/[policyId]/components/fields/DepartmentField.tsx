import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@comp/ui/select";
import { Departments } from "@comp/db/types";
import React from "react";

interface DepartmentFieldProps {
	value: Departments | null;
	onChange: (value: Departments) => void;
	disabled?: boolean;
}

export function DepartmentField({
	value,
	onChange,
	disabled,
}: DepartmentFieldProps) {
	return (
		<div className="space-y-2">
			<label htmlFor="department" className="text-sm font-medium">
				Department
			</label>
			<Select
				name="department"
				value={value || ""}
				disabled={disabled}
				onValueChange={(val) => onChange(val as Departments)}
			>
				<SelectTrigger>
					<SelectValue placeholder="Select department" />
				</SelectTrigger>
				<SelectContent>
					{Object.values(Departments).map((dept) => (
						<SelectItem key={dept} value={dept}>
							{dept.toUpperCase()}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
