import { Departments, Frequency } from "@comp/db/types";

/**
 * Represents a piece of compliance or regulatory task
 * that organizations need to maintain and present during audits.
 */
export interface TemplateTask {
	/** Unique identifier for the task */
	id: string;
	/** Display name of the task */
	name: string;
	/** Detailed explanation of what this task entails */
	description: string;
	/** How often this task needs to be collected or updated (e.g., "monthly", "quarterly", "yearly") */
	frequency: Frequency;
	/** The organizational department responsible for maintaining this task */
	department: Departments;
}

/**
 * A mapping of task IDs to their corresponding Task objects.
 * Used for efficient lookup of tasks by ID.
 */
export interface TemplateTaskMap {
	[key: string]: TemplateTask;
}
