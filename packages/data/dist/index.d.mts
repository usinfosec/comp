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

declare const accessControlPolicy: Policy;

declare const applicationSecurityPolicy: Policy;

declare const availabilityPolicy: Policy;

declare const businessContinuityPolicy: Policy;

declare const changeManagementPolicy: Policy;

declare const classificationPolicy: Policy;

declare const codeOfConductPolicy: Policy;

declare const confidentialityPolicy: Policy;

declare const corporateGovernancePolicy: Policy;

declare const cyberRiskPolicy: Policy;

declare const dataCenterPolicy: Policy;

declare const dataClassificationPolicy: Policy;

declare const disasterRecoveryPolicy: Policy;

declare const humanResourcesPolicy: Policy;

declare const incidentResponsePolicy: Policy;

declare const informationSecurityPolicy: Policy;

declare const passwordPolicy: Policy;

declare const privacyPolicy: Policy;

declare const riskAssessmentPolicy: Policy;

declare const riskManagementPolicy: Policy;

declare const softwareDevelopmentPolicy: Policy;

declare const systemChangePolicy: Policy;

declare const thirdPartyPolicy: Policy;

declare const vendorRiskManagementPolicy: Policy;

declare const workstationPolicy: Policy;

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
    accessControlRecords: Evidence;
    accessLogs: Evidence;
    accessRemovalRecords: Evidence;
    accessReviewRecords: Evidence;
    accountManagementRecords: Evidence;
    authenticationRecords: Evidence;
    boardMeetingDocumentation: Evidence;
    businessContinuityAndDisasterRecoveryTestingRecords: Evidence;
    businessContinuityPlans: Evidence;
    capacityReports: Evidence;
    changeManagementRecords: Evidence;
    changeRequestLogs: Evidence;
    changeRiskDocumentation: Evidence;
    communicationRecords: Evidence;
    consentRecords: Evidence;
    controlImplementationRecords: Evidence;
    controlTestingDocumentation: Evidence;
    dataClassificationRecords: Evidence;
    dataProcessingLogs: Evidence;
    dataQualityDocumentation: Evidence;
    dataValidationRecords: Evidence;
    deficiencyManagementRecords: Evidence;
    disposalRecords: Evidence;
    ethicsComplianceDocumentation: Evidence;
    exceptionLogs: Evidence;
    externalCommunicationRecords: Evidence;
    fraudRiskDocumentation: Evidence;
    hrDocumentation: Evidence;
    incidentAnalysisRecords: Evidence;
    incidentCommunicationRecords: Evidence;
    incidentRecoveryRecords: Evidence;
    incidentResponseRecords: Evidence;
    infrastructureMonitoringRecords: Evidence;
    malwarePreventionRecords: Evidence;
    managementStructureDocumentation: Evidence;
    personnelComplianceDocumentation: Evidence;
    physicalAccessRecords: Evidence;
    policyImplementationRecords: Evidence;
    privacyNotice: Evidence;
    recoveryRecords: Evidence;
    retentionSchedules: Evidence;
    riskAssessmentDocumentation: Evidence;
    riskIdentificationRecords: Evidence;
    technologyControlRecords: Evidence;
    uptimeReports: Evidence;
    vendorRiskAssessmentRecords: Evidence;
};
type EvidenceId = keyof typeof evidence;

/**
 * Represents an artifact associated with a control
 * that can be used to demonstrate compliance.
 */
type Artifact = {
    type: "policy";
    policyId: string;
} | {
    type: "evidence";
    evidenceId: string;
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

export { type EvidenceId, accessControlPolicy, applicationSecurityPolicy, availabilityPolicy, businessContinuityPolicy, changeManagementPolicy, classificationPolicy, codeOfConductPolicy, confidentialityPolicy, controls, corporateGovernancePolicy, cyberRiskPolicy, dataCenterPolicy, dataClassificationPolicy, disasterRecoveryPolicy, evidence, frameworks, humanResourcesPolicy, incidentResponsePolicy, informationSecurityPolicy, passwordPolicy, privacyPolicy, requirements, riskAssessmentPolicy, riskManagementPolicy, soc2Requirements, softwareDevelopmentPolicy, systemChangePolicy, thirdPartyPolicy, trainingVideos, vendorRiskManagementPolicy, workstationPolicy };
