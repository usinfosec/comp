"use client";

import { STATUS_FILTERS } from "./filterConfigs";
import { AssigneeAvatar } from "./AssigneeAvatar";
import { EVIDENCE_STATUS_HEX_COLORS } from "../../../../(overview)/constants/evidence-status";
import { cn } from "@bubba/ui/cn";
import { Departments } from "@bubba/db/types";
import { EvidenceStatus } from "@bubba/db/types";
import { Frequency } from "@bubba/db/types";

interface FilterCategoriesProps {
	status: EvidenceStatus | null;
	setStatus: (status: EvidenceStatus | null) => void;
	frequency: Frequency | null;
	setFrequency: (frequency: Frequency | null) => void;
	department: Departments | null;
	setDepartment: (department: Departments | null) => void;
	assigneeId: string | null;
	setAssigneeId: (assigneeId: string | null) => void;
	frequencies: Frequency[];
	departments: Departments[];
	assignees: Array<{ id: string; name: string | null; image: string | null }>;
	setPage: (page: string) => void;
}

export function getFilterCategories({
	status,
	setStatus,
	frequency,
	setFrequency,
	department,
	setDepartment,
	assigneeId,
	setAssigneeId,
	frequencies,
	departments,
	assignees,
	setPage,
}: FilterCategoriesProps) {
	return [
		{
			label: "Filter by Status",
			items: STATUS_FILTERS.map((filter) => ({
				...filter,
				checked: status === filter.value,
				icon: (
					<div
						className={cn("size-2.5")}
						style={{
							backgroundColor:
								EVIDENCE_STATUS_HEX_COLORS[filter.value ?? "draft"] ?? "  ",
						}}
					/>
				),
				onChange: (checked: boolean) => {
					setStatus(checked ? filter.value : null);
					setPage("1");
				},
			})),
		},
		{
			label: "Filter by Frequency",
			items: frequencies.map((freq) => ({
				label: freq,
				value: freq,
				checked: frequency === freq,
				onChange: (checked: boolean) => {
					setFrequency(checked ? freq : null);
					setPage("1");
				},
			})),
		},
		{
			label: "Filter by Department",
			items: departments.map((dept) => ({
				label: dept.replace(/_/g, " ").toUpperCase(),
				value: dept,
				checked: department === dept,
				onChange: (checked: boolean) => {
					setDepartment(checked ? dept : null);
					setPage("1");
				},
			})),
			maxHeight: "150px",
		},
		{
			label: "Filter by Assignee",
			items: assignees.map((assignee) => ({
				label: assignee.name || "Unknown",
				value: assignee.id,
				checked: assigneeId === assignee.id,
				onChange: (checked: boolean) => {
					setAssigneeId(checked ? assignee.id : null);
					setPage("1");
				},
				icon: <AssigneeAvatar assignee={assignee} />,
			})),
			maxHeight: "150px",
		},
	];
}
