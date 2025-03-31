import type { Frameworks } from "../frameworks/frameworks.types";

// Basic representation of a text node in the content
interface TextNode {
	type: "text";
	text: string;
	marks?: any[]; // Optional marks like bold, italic, etc.
}

// Recursive type for content nodes (paragraphs, headings, lists, tables, etc.)
// This is a simplified representation; a full schema might be more complex.
interface ContentNode {
	type: string;
	attrs?: Record<string, any>;
	content?: (ContentNode | TextNode)[];
}

/**
 * Represents the metadata associated with a policy document.
 */
export interface PolicyMetadata {
	id: string;
	slug: string;
	name: string;
	description: string;
	frequency: string; // Consider using a union type like 'yearly' | 'quarterly' if applicable
	department: string; // Consider a union type for known departments
	/**
	 * Specifies which controls within compliance frameworks this policy relates to.
	 * The keys correspond to the framework IDs (e.g., 'soc2').
	 * The values are arrays of control identifiers (e.g., ['CC6.1', 'CC6.2']).
	 */
	usedBy: Partial<Record<keyof Frameworks, string[]>>;
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
	content: ContentNode[];
}

// Optional: If you plan to have a map of all policies similar to frameworks.ts
// export type Policies = Record<string, Policy>;
