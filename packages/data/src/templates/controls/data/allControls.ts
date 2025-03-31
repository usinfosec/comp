import type { Controls } from "../types";

export const controls: Controls = [
	{
		id: "access_removal",
		name: "Access Removal",
		description:
			"The organization removes access to protected information assets when appropriate.",
		mappedArtifacts: [
			{
				type: "policy",
				policyId: "access_control",
			},
			{
				type: "evidence",
				evidenceId: "access_removal_records",
			},
		],
		mappedRequirements: [
			{
				frameworkId: "soc2",
				requirementId: "CC6",
			},
		],
	},
	{
		id: "access_review",
		name: "Access Review",
		description:
			"The organization evaluates and manages access to protected information assets on a periodic basis.",
		mappedArtifacts: [
			{
				type: "policy",
				policyId: "access_control",
			},
			{
				type: "evidence",
				evidenceId: "access_review_records",
			},
		],
		mappedRequirements: [
			{
				frameworkId: "soc2",
				requirementId: "CC6",
			},
		],
	},
	{
		id: "system_account_management",
		name: "System Account Management",
		description:
			"The organization identifies and authenticates system users, devices, and other systems before allowing access.",
		mappedArtifacts: [
			{
				type: "policy",
				policyId: "access_control",
			},
			{
				type: "evidence",
				evidenceId: "account_management_records",
			},
		],
		mappedRequirements: [
			{
				frameworkId: "soc2",
				requirementId: "CC6",
			},
		],
	},
	{
		id: "access_restrictions",
		name: "Access Restrictions",
		description:
			"The organization restricts physical access to facilities and protected information assets.",
		mappedArtifacts: [
			{
				type: "policy",
				policyId: "access_control",
			},
			{
				type: "evidence",
				evidenceId: "physical_access_records",
			},
		],
		mappedRequirements: [
			{
				frameworkId: "soc2",
				requirementId: "CC6",
			},
		],
	},
	{
		id: "information_asset_changes",
		name: "Information Asset Changes",
		description:
			"The organization manages changes to system components to minimize the risk of unauthorized changes.",
		mappedArtifacts: [
			{
				type: "policy",
				policyId: "change_management",
			},
			{
				type: "evidence",
				evidenceId: "change_management_records",
			},
		],
		mappedRequirements: [
			{
				frameworkId: "soc2",
				requirementId: "CC6",
			},
		],
	},
	{
		id: "malicious_software_prevention",
		name: "Malicious Software Prevention",
		description:
			"The organization implements controls to prevent or detect and act upon the introduction of unauthorized or malicious software.",
		mappedArtifacts: [
			{
				type: "policy",
				policyId: "information_security",
			},
			{
				type: "evidence",
				evidenceId: "malware_prevention_records",
			},
		],
		mappedRequirements: [
			{
				frameworkId: "soc2",
				requirementId: "CC6",
			},
		],
	},
	{
		id: "infrastructure_monitoring",
		name: "Infrastructure Monitoring",
		description:
			"To detect and act upon security events in a timely manner, the organization monitors system capacity, security threats, and vulnerabilities.",
		mappedArtifacts: [
			{
				type: "policy",
				policyId: "information_security",
			},
			{
				type: "evidence",
				evidenceId: "infrastructure_monitoring_records",
			},
		],
		mappedRequirements: [
			{
				frameworkId: "soc2",
				requirementId: "CC7",
			},
		],
	},
	{
		id: "security_event_response",
		name: "Security Event Response",
		description:
			"The organization designs, develops, and implements policies and procedures to respond to security incidents and breaches.",
		mappedArtifacts: [
			{
				type: "policy",
				policyId: "incident_response",
			},
			{
				type: "evidence",
				evidenceId: "incident_response_records",
			},
		],
		mappedRequirements: [
			{
				frameworkId: "soc2",
				requirementId: "CC7",
			},
		],
	},
	{
		id: "security_event_recovery",
		name: "Security Event Recovery",
		description:
			"The organization implements recovery procedures to ensure timely restoration of systems or assets affected by security incidents.",
		mappedArtifacts: [
			{
				type: "policy",
				policyId: "business_continuity",
			},
			{
				type: "evidence",
				evidenceId: "recovery_records",
			},
		],
		mappedRequirements: [
			{
				frameworkId: "soc2",
				requirementId: "CC7",
			},
		],
	},
	{
		id: "security_event_analysis",
		name: "Security Event Analysis",
		description:
			"The organization implements incident response activities to identify root causes of security incidents and develop remediation plans.",
		mappedArtifacts: [
			{
				type: "policy",
				policyId: "incident_response",
			},
			{
				type: "evidence",
				evidenceId: "incident_analysis_records",
			},
		],
		mappedRequirements: [
			{
				frameworkId: "soc2",
				requirementId: "CC7",
			},
		],
	},
	{
		id: "security_event_communication",
		name: "Security Event Communication",
		description:
			"The organization identifies, develops, and implements activities to communicate security incidents to affected parties.",
		mappedArtifacts: [
			{
				type: "policy",
				policyId: "incident_response",
			},
			{
				type: "evidence",
				evidenceId: "incident_communication_records",
			},
		],
		mappedRequirements: [
			{
				frameworkId: "soc2",
				requirementId: "CC7",
			},
		],
	},
	{
		id: "change_authorization",
		name: "Change Authorization",
		description:
			"The organization authorizes, designs, develops or acquires, configures, documents, tests, approves, and implements changes to infrastructure, data, software, and procedures.",
		mappedArtifacts: [
			{
				type: "policy",
				policyId: "change_management",
			},
			{
				type: "evidence",
				evidenceId: "change_request_logs",
			},
		],
		mappedRequirements: [
			{
				frameworkId: "soc2",
				requirementId: "CC8",
			},
		],
	},
	{
		id: "business_continuity_planning",
		name: "Business Continuity Planning",
		description:
			"The organization identifies, develops, and implements activities to recover critical information technology resources.",
		mappedArtifacts: [
			{
				type: "policy",
				policyId: "business_continuity",
			},
			{
				type: "evidence",
				evidenceId: "business_continuity_plans",
			},
		],
		mappedRequirements: [
			{
				frameworkId: "soc2",
				requirementId: "CC9",
			},
		],
	},
	{
		id: "vendor_risk_management",
		name: "Vendor Risk Management",
		description:
			"The organization assesses and manages risks associated with vendors and business partners.",
		mappedArtifacts: [
			{
				type: "policy",
				policyId: "vendor_risk_management",
			},
			{
				type: "evidence",
				evidenceId: "vendor_risk_assessment_records",
			},
		],
		mappedRequirements: [
			{
				frameworkId: "soc2",
				requirementId: "CC9",
			},
		],
	},
	{
		id: "business_continuity_and_disaster_recovery_testing",
		name: "Business Continuity and Disaster Recovery Testing",
		description:
			"The organization tests business continuity and disaster recovery plans, evaluates the test results, and updates the plans accordingly.",
		mappedArtifacts: [
			{
				type: "policy",
				policyId: "business_continuity",
			},
			{
				type: "evidence",
				evidenceId: "business_continuity_and_disaster_recovery_testing_records",
			},
		],
		mappedRequirements: [
			{
				frameworkId: "soc2",
				requirementId: "CC9",
			},
		],
	},
	{
		id: "availability_commitments",
		name: "Availability Commitments",
		description:
			"The entity maintains commitments to ensure systems are available for operation.",
		mappedArtifacts: [
			{
				type: "policy",
				policyId: "availability",
			},
			{
				type: "evidence",
				evidenceId: "uptime_reports",
			},
		],
		mappedRequirements: [
			{
				frameworkId: "soc2",
				requirementId: "A1",
			},
		],
	},
	{
		id: "capacity_planning",
		name: "Capacity Planning",
		description:
			"The entity monitors and manages system capacity to meet demands.",
		mappedArtifacts: [
			{
				type: "policy",
				policyId: "availability",
			},
			{
				type: "evidence",
				evidenceId: "capacity_reports",
			},
		],
		mappedRequirements: [
			{
				frameworkId: "soc2",
				requirementId: "A1",
			},
		],
	},
	{
		id: "incident_recovery",
		name: "Incident Recovery",
		description:
			"The entity has controls to restore system availability after incidents.",
		mappedArtifacts: [
			{
				type: "policy",
				policyId: "business_continuity",
			},
			{
				type: "evidence",
				evidenceId: "incident_recovery_records",
			},
		],
		mappedRequirements: [
			{
				frameworkId: "soc2",
				requirementId: "A1",
			},
		],
	},
	{
		id: "confidential_information_classification",
		name: "Confidential Information Classification",
		description:
			"The entity classifies information to identify and protect confidential information.",
		mappedArtifacts: [
			{
				type: "policy",
				policyId: "data_classification",
			},
			{
				type: "evidence",
				evidenceId: "data_classification_records",
			},
		],
		mappedRequirements: [
			{
				frameworkId: "soc2",
				requirementId: "C1",
			},
		],
	},
	{
		id: "access_restrictions_for_confidential_data",
		name: "Access Restrictions for Confidential Data",
		description:
			"The entity restricts access to confidential information on a need-to-know basis.",
		mappedArtifacts: [
			{
				type: "policy",
				policyId: "data_classification",
			},
			{
				type: "evidence",
				evidenceId: "access_logs",
			},
		],
		mappedRequirements: [
			{
				frameworkId: "soc2",
				requirementId: "C1",
			},
		],
	},
	{
		id: "confidential_data_disposal",
		name: "Confidential Data Disposal",
		description:
			"The entity securely disposes of confidential information when no longer needed.",
		mappedArtifacts: [
			{
				type: "policy",
				policyId: "data_classification",
			},
			{
				type: "evidence",
				evidenceId: "disposal_records",
			},
		],
		mappedRequirements: [
			{
				frameworkId: "soc2",
				requirementId: "C1",
			},
		],
	},
	{
		id: "accuracy_and_completeness",
		name: "Accuracy and Completeness",
		description:
			"The entity ensures data is processed accurately and completely.",
		mappedArtifacts: [
			{
				type: "policy",
				policyId: "information_security",
			},
			{
				type: "evidence",
				evidenceId: "data_validation_records",
			},
		],
		mappedRequirements: [
			{
				frameworkId: "soc2",
				requirementId: "PI1",
			},
		],
	},
	{
		id: "input_processing_and_output_controls",
		name: "Input, Processing, and Output Controls",
		description:
			"The entity validates the completeness and accuracy of data throughout processing.",
		mappedArtifacts: [
			{
				type: "policy",
				policyId: "information_security",
			},
			{
				type: "evidence",
				evidenceId: "data_processing_logs",
			},
		],
		mappedRequirements: [
			{
				frameworkId: "soc2",
				requirementId: "PI1",
			},
		],
	},
	{
		id: "exception_handling",
		name: "Exception Handling",
		description:
			"The entity identifies and resolves processing exceptions in a timely manner.",
		mappedArtifacts: [
			{
				type: "policy",
				policyId: "information_security",
			},
			{
				type: "evidence",
				evidenceId: "exception_logs",
			},
		],
		mappedRequirements: [
			{
				frameworkId: "soc2",
				requirementId: "PI1",
			},
		],
	},
	{
		id: "privacy_notice",
		name: "Privacy Notice",
		description:
			"The entity provides notice about the collection, use, and disclosure of personal information.",
		mappedArtifacts: [
			{
				type: "policy",
				policyId: "privacy",
			},
			{
				type: "evidence",
				evidenceId: "privacy_notice",
			},
		],
		mappedRequirements: [
			{
				frameworkId: "soc2",
				requirementId: "P1",
			},
		],
	},
	{
		id: "choice_and_consent",
		name: "Choice and Consent",
		description:
			"The entity obtains consent for personal information where required by policy or law.",
		mappedArtifacts: [
			{
				type: "policy",
				policyId: "privacy",
			},
			{
				type: "evidence",
				evidenceId: "consent_records",
			},
		],
		mappedRequirements: [
			{
				frameworkId: "soc2",
				requirementId: "P1",
			},
		],
	},
	{
		id: "data_retention_and_disposal",
		name: "Data Retention and Disposal",
		description:
			"The entity retains personal information for only as long as needed and disposes of it securely.",
		mappedArtifacts: [
			{
				type: "policy",
				policyId: "privacy",
			},
			{
				type: "evidence",
				evidenceId: "retention_schedules",
			},
		],
		mappedRequirements: [
			{
				frameworkId: "soc2",
				requirementId: "P1",
			},
		],
	},
];
