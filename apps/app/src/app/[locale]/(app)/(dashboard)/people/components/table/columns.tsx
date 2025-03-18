"use client";

import {
	EmployeeStatus,
	getEmployeeStatusFromBoolean,
} from "@/components/tables/people/employee-status";
import type { Employee } from "@bubba/db/types";
import { Avatar, AvatarFallback } from "@bubba/ui/avatar";
import { Badge } from "@bubba/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";

export function getColumns(
	onRowClick: (id: string) => void,
): ColumnDef<Employee>[] {
	return [
		{
			accessorKey: "name",
			header: "Name",
			cell: ({ row }) => {
				const employee = row.original;
				return (
					<div className="flex items-center gap-2">
						<Avatar>
							<AvatarFallback>{employee.name[0] || "?"}</AvatarFallback>
						</Avatar>
						<div>
							<div className="font-medium">{employee.name}</div>
							<div className="text-sm text-muted-foreground">
								{employee.email}
							</div>
						</div>
					</div>
				);
			},
		},
		{
			accessorKey: "department",
			header: "Department",
			cell: ({ row }) => {
				const department = row.getValue("department") as string;
				return (
					<Badge variant="marketing" className="w-fit">
						{department.toUpperCase()}
					</Badge>
				);
			},
		},
		{
			accessorKey: "isActive",
			header: "Status",
			cell: ({ row }) => {
				const isActive = row.original.isActive;
				const status = getEmployeeStatusFromBoolean(isActive);

				return (
					<div className="hidden md:block">
						<EmployeeStatus status={status} />
					</div>
				);
			},
		},
	];
}
