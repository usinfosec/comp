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
    /** ISO 27001 Information Security Management framework */
    iso27001: Framework;
    /** General Data Protection Regulation framework */
    gdpr: Framework;
}

declare const frameworks: Frameworks;

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

export { accessControlPolicy, applicationSecurityPolicy, availabilityPolicy, businessContinuityPolicy, changeManagementPolicy, classificationPolicy, codeOfConductPolicy, confidentialityPolicy, corporateGovernancePolicy, cyberRiskPolicy, dataCenterPolicy, dataClassificationPolicy, disasterRecoveryPolicy, frameworks, humanResourcesPolicy, incidentResponsePolicy, informationSecurityPolicy, passwordPolicy, privacyPolicy, riskAssessmentPolicy, riskManagementPolicy, softwareDevelopmentPolicy, systemChangePolicy, thirdPartyPolicy, trainingVideos, vendorRiskManagementPolicy, workstationPolicy };
