export interface Requirement {
	name: string;
	code: string;
	description: string;
}

export interface Requirements {
	[key: string]: Requirement;
}
