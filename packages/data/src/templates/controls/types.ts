import { FrameworkId } from "../../static/frameworks/types";
import { allRequirementIdsByFramework } from "../../static/requirements/types";

/**
 * Represents an artifact associated with a control
 * that can be used to demonstrate compliance.
 */
export type Artifact =
	| {
			type: "policy";
			policyId: string;
	  }
	| {
			type: "evidence";
			evidenceId: string;
	  };

/**
 * Represents a security or compliance control that organizations
 * implement to address specific requirements.
 */
export interface Control<T extends FrameworkId> {
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
