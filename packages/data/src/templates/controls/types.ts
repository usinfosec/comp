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
 * Represents a requirement that a control addresses.
 */
export type Requirement<T extends FrameworkId = FrameworkId> = {
	frameworkId: T;
	requirementId: allRequirementIdsByFramework[T];
};

/**
 * Represents a security or compliance control that organizations
 * implement to address specific requirements.
 */
export interface Control {
	/** Unique identifier for the control */
	id: string;
	/** Display name of the control */
	name: string;
	/** Detailed explanation of what this control entails */
	description: string;
	/** List of artifacts used to demonstrate implementation of this control */
	mappedArtifacts: Artifact[];
	/** List of requirements this control addresses */
	mappedRequirements: Requirement[];
}

/**
 * An array of Control objects for a specific framework.
 */
export type Controls = Control[];
