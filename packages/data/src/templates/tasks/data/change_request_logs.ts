import type { TemplateTask as Task } from "../types";

export const changeRequestLogs: Task = {
	id: "change_request_logs",
	name: "Change Request Logs",
	description: "Logs of system change requests and their status.",
	frequency: "monthly",
	department: "it",
};
