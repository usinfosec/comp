import type { Departments, Frequency } from "@comp/db/types";

// Define all available departments from the enum
export const ALL_DEPARTMENTS: Departments[] = [
	"admin",
	"gov",
	"hr",
	"it",
	"itsm",
	"qms",
];

// Define all available frequencies from the enum
export const ALL_FREQUENCIES: Frequency[] = ["monthly", "quarterly", "yearly"];
