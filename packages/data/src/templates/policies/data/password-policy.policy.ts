import type { TemplatePolicy } from "../types";

export const passwordPolicy: TemplatePolicy = {
	type: "doc",
	metadata: {
		id: "password_policy",
		name: "Password Policy",
		description: "This policy defines the requirements for creating and managing strong passwords.",
		frequency: "yearly",
		department: "it",
	},
	content: [],
} as const;
