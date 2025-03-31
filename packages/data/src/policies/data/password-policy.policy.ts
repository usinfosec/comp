import type { Policy } from "../policies.types";

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
		usedBy: {
			soc2: ["CC1.1", "CC1.2", "CC1.3"],
		},
	},
	content: [],
} as const;
