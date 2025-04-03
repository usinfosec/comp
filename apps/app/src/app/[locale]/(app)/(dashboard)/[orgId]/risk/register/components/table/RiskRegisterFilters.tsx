import { Status } from "@/components/status";
import { type Departments, RiskStatus } from "@comp/db/types";
import type { Admin } from "../../../../hooks/useOrganizationAdmins";
import { AssigneeAvatar } from "../../../../evidence/list/components/table/components/AssigneeAvatar";

export const RiskRegisterFilters = ({
	setPage,
	departments,
	assignees,
	status,
	setStatus,
	department,
	setDepartment,
	assigneeId,
	setAssigneeId,
}: {
	setPage: (page: number) => void;
	departments: Departments[];
	assignees: Admin[] | undefined;
	status: RiskStatus | null;
	setStatus: (status: RiskStatus | null) => void;
	department: Departments | null;
	setDepartment: (department: Departments | null) => void;
	assigneeId: string | null;
	setAssigneeId: (assigneeId: string | null) => void;
}) => {
	return [
		{
			label: "Filter by Status",
			items: Object.values(RiskStatus).map((filter) => ({
				label: filter
					.split(" ")
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(" "),
				icon: <Status status={filter} noLabel />,
				value: filter,
				checked: status === filter,
				onChange: (checked: boolean) => {
					setStatus(checked ? filter : null);
					setPage(1);
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
					setPage(1);
				},
			})),
			maxHeight: "150px",
		},
		{
			label: "Filter by Assignee",
			items: (assignees || []).map((assignee) => ({
				label: assignee.name || "Unknown",
				value: assignee.id,
				checked: assigneeId === assignee.id,
				onChange: (checked: boolean) => {
					setAssigneeId(checked ? assignee.id : null);
					setPage(1);
				},
				icon: <AssigneeAvatar assignee={assignee} />,
			})),
			maxHeight: "150px",
		},
	];
};
