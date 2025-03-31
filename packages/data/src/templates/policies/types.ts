import type { Departments, Frequency } from "@bubba/db/types";

/**
 * Represents the structure of JSON content used in policy documents.
 * This type is compatible with ProseMirror/TipTap document structure.
 */
type JSONContent = {
	[key: string]: any;
	type?: string;
	attrs?: Record<string, any>;
	content?: JSONContent[];
	marks?: {
		type: string;
		attrs?: Record<string, any>;
		[key: string]: any;
	}[];
	text?: string;
};

/**
 * Represents the metadata associated with a policy document.
 */
export interface PolicyMetadata {
	id: string;
	slug: string;
	name: string;
	description: string;
	frequency: Frequency;
	department: Departments;
}

/**
 * Represents the structure of a policy document, including metadata and content.
 */
export interface Policy {
	/**
	 * The main type of the document, typically "doc".
	 */
	type: "doc";
	/**
	 * Metadata providing details about the policy.
	 */
	metadata: PolicyMetadata;
	/**
	 * The structured content of the policy document.
	 */
	content: JSONContent[];
}

// Optional: If you plan to have a map of all policies similar to frameworks.ts
// export type Policies = Record<string, Policy>;
