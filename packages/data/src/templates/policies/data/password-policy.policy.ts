import type { Policy } from "../types";

export const passwordPolicy: Policy = {
	type: "doc",
	metadata: {
		id: "password_policy",
		slug: "password-policy",
		name: "Password Policy",
		description:
			"This policy outlines the requirements for passwords used by employees.",
		frequency: "yearly",
		department: "it",
	},
	content: [],
} as const;
