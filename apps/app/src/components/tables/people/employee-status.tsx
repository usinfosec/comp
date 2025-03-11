import { useI18n } from "@/locales/client";
import { cn } from "@bubba/ui/cn";

// Define employee status types
export const EMPLOYEE_STATUS_TYPES = ["active", "inactive"] as const;
export type EmployeeStatusType = (typeof EMPLOYEE_STATUS_TYPES)[number];

// Define colors for employee statuses
const EMPLOYEE_STATUS_COLORS: Record<EmployeeStatusType, string> = {
	active: "#00DC73", // Green - Same as "closed" in Status component
	inactive: "#ffc107", // Yellow/amber - Same as "open" in Status component
};

/**
 * EmployeeStatus component that matches the styling of the Status component
 * but uses active/inactive states specific to employees
 */
export function EmployeeStatus({ status }: { status: EmployeeStatusType }) {
	const t = useI18n();

	return (
		<div className="flex items-center gap-2">
			<div
				className={cn("size-2.5")}
				style={{ backgroundColor: EMPLOYEE_STATUS_COLORS[status] }}
			/>
			{t(`common.status.${status}`)}
		</div>
	);
}

/**
 * Converts boolean isActive to EmployeeStatusType
 */
export function getEmployeeStatusFromBoolean(
	isActive: boolean,
): EmployeeStatusType {
	return isActive ? "active" : "inactive";
}
