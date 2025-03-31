import { Frequency, Departments } from '@bubba/db/types';

/**
 * Represents a training video resource that can be used
 * for user education and compliance training.
 */
interface TrainingVideo {
    /** Unique identifier for the video */
    id: string;
    /** Title of the training video */
    title: string;
    /** Detailed description of the video content */
    description: string;
    /** YouTube video identifier for embedding */
    youtubeId: string;
    /** Full URL to access the video */
    url: string;
}

declare const trainingVideos: readonly TrainingVideo[];

/**
 * Represents a compliance or regulatory framework
 * that defines standards for security, privacy, or data handling.
 */
interface Framework {
    /** Name of the framework */
    name: string;
    /** Version number or year of the framework */
    version: string;
    /** Brief description of the framework's purpose and scope */
    description: string;
}
/**
 * Collection of supported compliance frameworks within the system.
 */
interface Frameworks {
    /** SOC 2 (Service Organization Control 2) framework */
    soc2: Framework;
}
/**
 * Valid framework ID strings that can be used to reference specific frameworks.
 */
type FrameworkId = keyof Frameworks;

declare const frameworks: Frameworks;

type soc2RequirementIds = "CC1" | "CC2" | "CC3" | "CC4" | "CC5" | "CC6" | "CC7" | "CC8" | "CC9" | "A1" | "C1" | "PI1" | "P1";

/**
 * Represents a specific requirement from a compliance framework
 * that an organization needs to fulfill.
 */
interface Requirement$1 {
    /** Name of the requirement */
    name: string;
    /** Detailed explanation of what this requirement entails */
    description: string;
}
/**
 * A mapping of requirement codes to their corresponding Requirement objects.
 * Used for efficient lookup of requirements.
 */
type SingleFrameworkRequirements<A extends string = string> = Record<A, Requirement$1>;
type AllRequirements = {
    [K in FrameworkId]: SingleFrameworkRequirements<allRequirementIdsByFramework[K]>;
};
type allRequirementIdsByFramework = {
    soc2: soc2RequirementIds;
};

declare const soc2Requirements: SingleFrameworkRequirements<soc2RequirementIds>;

declare const requirements: AllRequirements;

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
interface PolicyMetadata {
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
interface Policy {
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

declare const policies: {
    readonly access_control_policy: Policy;
    readonly application_security_policy: Policy;
    readonly availability_policy: Policy;
    readonly business_continuity_policy: Policy;
    readonly change_management_policy: Policy;
    readonly classification_policy: Policy;
    readonly code_of_conduct_policy: Policy;
    readonly confidentiality_policy: Policy;
    readonly corporate_governance_policy: Policy;
    readonly cyber_risk_policy: Policy;
    readonly data_center_policy: Policy;
    readonly data_classification_policy: Policy;
    readonly disaster_recovery_policy: Policy;
    readonly human_resources_policy: Policy;
    readonly incident_response_policy: Policy;
    readonly information_security_policy: Policy;
    readonly password_policy: Policy;
    readonly privacy_policy: Policy;
    readonly risk_assessment_policy: Policy;
    readonly risk_management_policy: Policy;
    readonly software_development_policy: Policy;
    readonly system_change_policy: Policy;
    readonly third_party_policy: Policy;
    readonly vendor_risk_management_policy: Policy;
    readonly workstation_policy: Policy;
};
type PolicyId = keyof typeof policies;

/**
 * Represents a piece of compliance or regulatory evidence
 * that organizations need to maintain and present during audits.
 */
interface Evidence {
    /** Unique identifier for the evidence */
    id: string;
    /** Display name of the evidence */
    name: string;
    /** Detailed explanation of what this evidence entails */
    description: string;
    /** How often this evidence needs to be collected or updated (e.g., "monthly", "quarterly", "yearly") */
    frequency: Frequency;
    /** The organizational department responsible for maintaining this evidence */
    department: Departments;
}

declare const evidence: {
    readonly access_control_records: Evidence;
    readonly access_logs: Evidence;
    readonly access_removal_records: Evidence;
    readonly access_review_records: Evidence;
    readonly account_management_records: Evidence;
    readonly authentication_records: Evidence;
    readonly board_meeting_documentation: Evidence;
    readonly business_continuity_and_disaster_recovery_testing_records: Evidence;
    readonly business_continuity_plans: Evidence;
    readonly capacity_reports: Evidence;
    readonly change_management_records: Evidence;
    readonly change_request_logs: Evidence;
    readonly change_risk_documentation: Evidence;
    readonly communication_records: Evidence;
    readonly consent_records: Evidence;
    readonly control_implementation_records: Evidence;
    readonly control_testing_documentation: Evidence;
    readonly data_classification_records: Evidence;
    readonly data_processing_logs: Evidence;
    readonly data_quality_documentation: Evidence;
    readonly data_validation_records: Evidence;
    readonly deficiency_management_records: Evidence;
    readonly disposal_records: Evidence;
    readonly ethics_compliance_documentation: Evidence;
    readonly exception_logs: Evidence;
    readonly external_communication_records: Evidence;
    readonly fraud_risk_documentation: Evidence;
    readonly hr_documentation: Evidence;
    readonly incident_analysis_records: Evidence;
    readonly incident_communication_records: Evidence;
    readonly incident_recovery_records: Evidence;
    readonly incident_response_records: Evidence;
    readonly infrastructure_monitoring_records: Evidence;
    readonly malware_prevention_records: Evidence;
    readonly management_structure_documentation: Evidence;
    readonly personnel_compliance_documentation: Evidence;
    readonly physical_access_records: Evidence;
    readonly policy_implementation_records: Evidence;
    readonly privacy_notice: Evidence;
    readonly recovery_records: Evidence;
    readonly retention_schedules: Evidence;
    readonly risk_assessment_documentation: Evidence;
    readonly risk_identification_records: Evidence;
    readonly technology_control_records: Evidence;
    readonly uptime_reports: Evidence;
    readonly vendor_risk_assessment_records: Evidence;
};
type EvidenceKey = keyof typeof evidence;
type EvidenceId = EvidenceKey;

/**
 * Represents an artifact associated with a control
 * that can be used to demonstrate compliance.
 */
type Artifact = {
    type: "policy";
    policyId: PolicyId;
} | {
    type: "evidence";
    evidenceId: EvidenceId;
};
/**
 * Represents a requirement that a control addresses.
 */
type Requirement<T extends FrameworkId = FrameworkId> = {
    frameworkId: T;
    requirementId: allRequirementIdsByFramework[T];
};
/**
 * Represents a security or compliance control that organizations
 * implement to address specific requirements.
 */
interface Control {
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
type Controls = Control[];

declare const controls: Controls;

export { type EvidenceId, type EvidenceKey, type PolicyId, controls, evidence, frameworks, policies, requirements, soc2Requirements, trainingVideos };
