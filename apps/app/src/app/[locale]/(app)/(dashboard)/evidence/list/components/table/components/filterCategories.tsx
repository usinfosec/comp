"use client";

import {
	STATUS_FILTERS,
	RELEVANCE_FILTERS,
	DEPARTMENT_ICON,
} from "./filterConfigs";
import { AssigneeAvatar } from "./AssigneeAvatar";

interface FilterCategoriesProps {
	status: string | null;
	setStatus: (status: string | null) => void;
	relevance: string | null;
	setRelevance: (relevance: string | null) => void;
	frequency: string | null;
	setFrequency: (frequency: string | null) => void;
	department: string | null;
	setDepartment: (department: string | null) => void;
	assigneeId: string | null;
	setAssigneeId: (assigneeId: string | null) => void;
	frequencies: string[];
	departments: string[];
	assignees: Array<{ id: string; name: string | null; image: string | null }>;
	setPage: (page: string) => void;
}

export function getFilterCategories({
	status,
	setStatus,
	relevance,
	setRelevance,
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
				onChange: (checked: boolean) => {
					setStatus(checked ? filter.value : null);
					setPage("1");
				},
			})),
		},
		{
			label: "Filter by Relevance",
			items: RELEVANCE_FILTERS.map((filter) => ({
				...filter,
				checked: relevance === filter.value,
				onChange: (checked: boolean) => {
					setRelevance(checked ? filter.value : null);
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
				icon: DEPARTMENT_ICON,
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
