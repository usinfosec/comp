import type { TemplateTask as Task } from "../types";

export const accessLogs: Task = {
	id: "access_logs",
	name: "Access Logs",
	description:
		"System and application access logs showing user authentication and authorization activities.",
	frequency: "monthly",
	department: "it",
};
