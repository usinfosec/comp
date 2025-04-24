import type { TemplateTask as Task } from "../types";

export const accessRemovalRecords: Task = {
	id: "access_removal_records",
	name: "Access Removal Records",
	description:
		"Documentation of access removal for terminated employees or role changes.",
	frequency: "monthly",
	department: "it",
};
