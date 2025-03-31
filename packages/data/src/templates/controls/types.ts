import { FrameworkId } from "../../static/frameworks/types";
import { allRequirementIdsByFramework } from "../../static/requirements/types";

/**
 * Represents an artifact associated with a control
 * that can be used to demonstrate compliance.
 */
export interface Artifact {
	/** Unique identifier for the artifact */
	id: string;
	/** The type of artifact - can be a policy, evidence, or training */
	type: "policy" | "evidence" | "training";
	/** Optional reference to a specific policy ID if the artifact is a policy */
	policyId?: string;
	/** Optional reference to a specific evidence ID if the artifact is evidence */
	evidenceId?: string;
	/** Optional name of the artifact */
	name?: string;
	/** Optional description of the artifact */
	description?: string;
}

/**
 * Represents a security or compliance control that organizations
 * implement to address specific requirements.
 */
export interface Control<T extends FrameworkId> {
	/** Unique code identifier for the control */
	code: string;
	/** Display name of the control */
	name: string;
	/** Detailed explanation of what this control entails */
	description: string;
	/** The domain or category this control belongs to */
	domain: string;
	/** The framework this control belongs to */
	frameworkId: T;
	/** Reference to the requirement this control addresses */
	requirementId: allRequirementIdsByFramework[T];
	/** List of artifacts used to demonstrate implementation of this control */
	artifacts: Artifact[];
}

/**
 * An array of Control objects for a specific framework.
 */
export type Controls<T extends FrameworkId> = Control<T>[];
