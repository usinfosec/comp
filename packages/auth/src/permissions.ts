import { createAccessControl } from "better-auth/plugins/access";

const statement = {
	app: ["create", "update", "delete", "read"],
	portal: ["read", "update"],
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
	app: ["create", "update", "delete", "read"],
	portal: ["read", "update"],
});

export const auditor = ac.newRole({
	app: ["read"],
});

export const employee = ac.newRole({
	portal: ["read", "update"],
});
