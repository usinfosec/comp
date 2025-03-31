import type { Controls } from "../types";

export const soc2Controls: Controls<"soc2"> = [
	{
		name: "Board Oversight",
		description:
			"The board of directors demonstrates independence from management and exercises oversight of the development and performance of internal control.",
		domain: "Control Environment",
		frameworkId: "soc2",
		requirementId: "CC1",
		artifacts: [
			{
				type: "policy",
				policyId: "corporate_governance",
			},
			{
				type: "evidence",
				evidenceId: "board_meeting_documentation",
			},
		],
	},
	{
		name: "Management Philosophy",
		description:
			"Management establishes, with board oversight, structures, reporting lines, and appropriate authorities and responsibilities in the pursuit of objectives.",
		domain: "Control Environment",
		frameworkId: "soc2",
		requirementId: "CC1",
		artifacts: [
			{
				type: "policy",
				policyId: "corporate_governance",
			},
			{
				type: "evidence",
				evidenceId: "management_structure_documentation",
			},
		],
	},
	{
		name: "Organizational Structure",
		description:
			"The organization demonstrates a commitment to attract, develop, and retain competent individuals in alignment with objectives.",
		domain: "Control Environment",
		frameworkId: "soc2",
		requirementId: "CC1",
		artifacts: [
			{
				type: "policy",
				policyId: "human_resources",
			},
			{
				type: "evidence",
				evidenceId: "hr_documentation",
			},
		],
	},
	{
		name: "Personnel Policies",
		description:
			"The organization holds individuals accountable for their internal control responsibilities in the pursuit of objectives.",
		domain: "Control Environment",
		frameworkId: "soc2",
		requirementId: "CC1",
		artifacts: [
			{
				type: "policy",
				policyId: "human_resources",
			},
			{
				type: "evidence",
				evidenceId: "personnel_compliance_documentation",
			},
		],
	},
	{
		name: "Code of Conduct",
		description:
			"The organization demonstrates a commitment to integrity and ethical values.",
		domain: "Control Environment",
		frameworkId: "soc2",
		requirementId: "CC1",
		artifacts: [
			{
				type: "policy",
				policyId: "corporate_governance",
			},
			{
				type: "evidence",
				evidenceId: "ethics_compliance_documentation",
			},
		],
	},
	{
		name: "Information Quality",
		description:
			"The organization obtains or generates and uses relevant, quality information to support the functioning of internal control.",
		domain: "Communication",
		frameworkId: "soc2",
		requirementId: "CC2",
		artifacts: [
			{
				type: "policy",
				policyId: "information_security",
			},
			{
				type: "evidence",
				evidenceId: "data_quality_documentation",
			},
		],
	},
	{
		name: "Internal Communication",
		description:
			"The organization internally communicates information, including objectives and responsibilities for internal control.",
		domain: "Communication",
		frameworkId: "soc2",
		requirementId: "CC2",
		artifacts: [
			{
				type: "policy",
				policyId: "corporate_governance",
			},
			{
				type: "evidence",
				evidenceId: "communication_records",
			},
		],
	},
	{
		name: "External Communication",
		description:
			"The organization communicates with external parties regarding matters affecting the functioning of internal control.",
		domain: "Communication",
		frameworkId: "soc2",
		requirementId: "CC2",
		artifacts: [
			{
				type: "policy",
				policyId: "corporate_governance",
			},
			{
				type: "evidence",
				evidenceId: "external_communication_records",
			},
		],
	},
	{
		name: "Risk Assessment Process",
		description:
			"The organization specifies objectives with sufficient clarity to enable the identification and assessment of risks relating to objectives.",
		domain: "Risk Assessment",
		frameworkId: "soc2",
		requirementId: "CC3",
		artifacts: [
			{
				type: "policy",
				policyId: "risk_management",
			},
			{
				type: "evidence",
				evidenceId: "risk_assessment_documentation",
			},
		],
	},
	{
		name: "Risk Identification",
		description:
			"The organization identifies risks to the achievement of its objectives across the entity and analyzes risks as a basis for determining how the risks should be managed.",
		domain: "Risk Assessment",
		frameworkId: "soc2",
		requirementId: "CC3",
		artifacts: [
			{
				type: "policy",
				policyId: "risk_management",
			},
			{
				type: "evidence",
				evidenceId: "risk_identification_records",
			},
		],
	},
	{
		name: "Fraud Risk Assessment",
		description:
			"The organization considers the potential for fraud in assessing risks to the achievement of objectives.",
		domain: "Risk Assessment",
		frameworkId: "soc2",
		requirementId: "CC3",
		artifacts: [
			{
				type: "policy",
				policyId: "risk_management",
			},
			{
				type: "evidence",
				evidenceId: "fraud_risk_documentation",
			},
		],
	},
	{
		name: "Change Management Risk",
		description:
			"The organization identifies and assesses changes that could significantly impact the system of internal control.",
		domain: "Risk Assessment",
		frameworkId: "soc2",
		requirementId: "CC3",
		artifacts: [
			{
				type: "policy",
				policyId: "change_management",
			},
			{
				type: "evidence",
				evidenceId: "change_risk_documentation",
			},
		],
	},
	{
		name: "Control Monitoring",
		description:
			"The organization selects, develops, and performs ongoing and/or separate evaluations to ascertain whether the components of internal control are present and functioning.",
		domain: "Monitoring Activities",
		frameworkId: "soc2",
		requirementId: "CC4",
		artifacts: [
			{
				type: "policy",
				policyId: "information_security",
			},
			{
				type: "evidence",
				evidenceId: "control_testing_documentation",
			},
		],
	},
	{
		name: "Deficiency Management",
		description:
			"The organization evaluates and communicates internal control deficiencies in a timely manner to those parties responsible for taking corrective action.",
		domain: "Monitoring Activities",
		frameworkId: "soc2",
		requirementId: "CC4",
		artifacts: [
			{
				type: "policy",
				policyId: "risk_management",
			},
			{
				type: "evidence",
				evidenceId: "deficiency_management_records",
			},
		],
	},
	{
		name: "Control Selection",
		description:
			"The organization selects and develops control activities that contribute to the mitigation of risks to the achievement of objectives to acceptable levels.",
		domain: "Control Activities",
		frameworkId: "soc2",
		requirementId: "CC5",
		artifacts: [
			{
				type: "policy",
				policyId: "information_security",
			},
			{
				type: "evidence",
				evidenceId: "control_implementation_records",
			},
		],
	},
	{
		name: "Technology Controls",
		description:
			"The organization selects and develops general control activities over technology to support the achievement of objectives.",
		domain: "Control Activities",
		frameworkId: "soc2",
		requirementId: "CC5",
		artifacts: [
			{
				type: "policy",
				policyId: "information_security",
			},
			{
				type: "evidence",
				evidenceId: "technology_control_records",
			},
		],
	},
	{
		name: "Policy Implementation",
		description:
			"The organization deploys control activities through policies that establish what is expected and procedures that put policies into action.",
		domain: "Control Activities",
		frameworkId: "soc2",
		requirementId: "CC5",
		artifacts: [
			{
				type: "policy",
				policyId: "corporate_governance",
			},
			{
				type: "evidence",
				evidenceId: "policy_implementation_records",
			},
		],
	},
	{
		name: "Access Security",
		description:
			"The organization implements logical access security software, infrastructure, and architectures over protected information assets to protect them from security events.",
		domain: "Logical and Physical Access Controls",
		frameworkId: "soc2",
		requirementId: "CC6",
		artifacts: [
			{
				type: "policy",
				policyId: "access_control",
			},
			{
				type: "evidence",
				evidenceId: "access_control_records",
			},
		],
	},
	{
		name: "Access Authentication",
		description:
			"Prior to issuing system credentials and granting system access, the organization registers and authorizes new internal and external users.",
		domain: "Logical and Physical Access Controls",
		frameworkId: "soc2",
		requirementId: "CC6",
		artifacts: [
			{
				type: "policy",
				policyId: "access_control",
			},
			{
				type: "evidence",
				evidenceId: "authentication_records",
			},
		],
	},
	{
		name: "Access Removal",
		description:
			"The organization removes access to protected information assets when appropriate.",
		domain: "Logical and Physical Access Controls",
		frameworkId: "soc2",
		requirementId: "CC6",
		artifacts: [
			{
				type: "policy",
				policyId: "access_control",
			},
			{
				type: "evidence",
				evidenceId: "access_removal_records",
			},
		],
	},
	{
		name: "Access Review",
		description:
			"The organization evaluates and manages access to protected information assets on a periodic basis.",
		domain: "Logical and Physical Access Controls",
		frameworkId: "soc2",
		requirementId: "CC6",
		artifacts: [
			{
				type: "policy",
				policyId: "access_control",
			},
			{
				type: "evidence",
				evidenceId: "access_review_records",
			},
		],
	},
	{
		name: "System Account Management",
		description:
			"The organization identifies and authenticates system users, devices, and other systems before allowing access.",
		domain: "Logical and Physical Access Controls",
		frameworkId: "soc2",
		requirementId: "CC6",
		artifacts: [
			{
				type: "policy",
				policyId: "access_control",
			},
			{
				type: "evidence",
				evidenceId: "account_management_records",
			},
		],
	},
	{
		name: "Access Restrictions",
		description:
			"The organization restricts physical access to facilities and protected information assets.",
		domain: "Logical and Physical Access Controls",
		frameworkId: "soc2",
		requirementId: "CC6",
		artifacts: [
			{
				type: "policy",
				policyId: "access_control",
			},
			{
				type: "evidence",
				evidenceId: "physical_access_records",
			},
		],
	},
	{
		name: "Information Asset Changes",
		description:
			"The organization manages changes to system components to minimize the risk of unauthorized changes.",
		domain: "Logical and Physical Access Controls",
		frameworkId: "soc2",
		requirementId: "CC6",
		artifacts: [
			{
				type: "policy",
				policyId: "change_management",
			},
			{
				type: "evidence",
				evidenceId: "change_management_records",
			},
		],
	},
	{
		name: "Malicious Software Prevention",
		description:
			"The organization implements controls to prevent or detect and act upon the introduction of unauthorized or malicious software.",
		domain: "Logical and Physical Access Controls",
		frameworkId: "soc2",
		requirementId: "CC6",
		artifacts: [
			{
				type: "policy",
				policyId: "information_security",
			},
			{
				type: "evidence",
				evidenceId: "malware_prevention_records",
			},
		],
	},
	{
		name: "Infrastructure Monitoring",
		description:
			"To detect and act upon security events in a timely manner, the organization monitors system capacity, security threats, and vulnerabilities.",
		domain: "System Operations",
		frameworkId: "soc2",
		requirementId: "CC7",
		artifacts: [
			{
				type: "policy",
				policyId: "information_security",
			},
			{
				type: "evidence",
				evidenceId: "infrastructure_monitoring_records",
			},
		],
	},
	{
		name: "Security Event Response",
		description:
			"The organization designs, develops, and implements policies and procedures to respond to security incidents and breaches.",
		domain: "System Operations",
		frameworkId: "soc2",
		requirementId: "CC7",
		artifacts: [
			{
				type: "policy",
				policyId: "incident_response",
			},
			{
				type: "evidence",
				evidenceId: "incident_response_records",
			},
		],
	},
	{
		name: "Security Event Recovery",
		description:
			"The organization implements recovery procedures to ensure timely restoration of systems or assets affected by security incidents.",
		domain: "System Operations",
		frameworkId: "soc2",
		requirementId: "CC7",
		artifacts: [
			{
				type: "policy",
				policyId: "business_continuity",
			},
			{
				type: "evidence",
				evidenceId: "recovery_records",
			},
		],
	},
	{
		name: "Security Event Analysis",
		description:
			"The organization implements incident response activities to identify root causes of security incidents and develop remediation plans.",
		domain: "System Operations",
		frameworkId: "soc2",
		requirementId: "CC7",
		artifacts: [
			{
				type: "policy",
				policyId: "incident_response",
			},
			{
				type: "evidence",
				evidenceId: "incident_analysis_records",
			},
		],
	},
	{
		name: "Security Event Communication",
		description:
			"The organization identifies, develops, and implements activities to communicate security incidents to affected parties.",
		domain: "System Operations",
		frameworkId: "soc2",
		requirementId: "CC7",
		artifacts: [
			{
				type: "policy",
				policyId: "incident_response",
			},
			{
				type: "evidence",
				evidenceId: "incident_communication_records",
			},
		],
	},
	{
		name: "Change Authorization",
		description:
			"The organization authorizes, designs, develops or acquires, configures, documents, tests, approves, and implements changes to infrastructure, data, software, and procedures.",
		domain: "Change Management",
		frameworkId: "soc2",
		requirementId: "CC8",
		artifacts: [
			{
				type: "policy",
				policyId: "change_management",
			},
			{
				type: "evidence",
				evidenceId: "change_request_logs",
			},
		],
	},
	{
		name: "Business Continuity Planning",
		description:
			"The organization identifies, develops, and implements activities to recover critical information technology resources.",
		domain: "Risk Mitigation",
		frameworkId: "soc2",
		requirementId: "CC9",
		artifacts: [
			{
				type: "policy",
				policyId: "business_continuity",
			},
			{
				type: "evidence",
				evidenceId: "business_continuity_plans",
			},
		],
	},
	{
		name: "Vendor Risk Management",
		description:
			"The organization assesses and manages risks associated with vendors and business partners.",
		domain: "Risk Mitigation",
		frameworkId: "soc2",
		requirementId: "CC9",
		artifacts: [
			{
				type: "policy",
				policyId: "vendor_risk_management",
			},
			{
				type: "evidence",
				evidenceId: "vendor_risk_assessment_records",
			},
		],
	},
	{
		name: "Business Continuity and Disaster Recovery Testing",
		description:
			"The organization tests business continuity and disaster recovery plans, evaluates the test results, and updates the plans accordingly.",
		domain: "Risk Mitigation",
		frameworkId: "soc2",
		requirementId: "CC9",
		artifacts: [
			{
				type: "policy",
				policyId: "business_continuity",
			},
			{
				type: "evidence",
				evidenceId: "business_continuity_and_disaster_recovery_testing_records",
			},
		],
	},
	{
		name: "Availability Commitments",
		description:
			"The entity maintains commitments to ensure systems are available for operation.",
		domain: "Availability",
		frameworkId: "soc2",
		requirementId: "A1",
		artifacts: [
			{
				type: "policy",
				policyId: "availability",
			},
			{
				type: "evidence",
				evidenceId: "uptime_reports",
			},
		],
	},
	{
		name: "Capacity Planning",
		description:
			"The entity monitors and manages system capacity to meet demands.",
		domain: "Availability",
		frameworkId: "soc2",
		requirementId: "A1",
		artifacts: [
			{
				type: "policy",
				policyId: "availability",
			},
			{
				type: "evidence",
				evidenceId: "capacity_reports",
			},
		],
	},
	{
		name: "Incident Recovery",
		description:
			"The entity has controls to restore system availability after incidents.",
		domain: "Availability",
		frameworkId: "soc2",
		requirementId: "A1",
		artifacts: [
			{
				type: "policy",
				policyId: "business_continuity",
			},
			{
				type: "evidence",
				evidenceId: "incident_recovery_records",
			},
		],
	},
	{
		name: "Confidential Information Classification",
		description:
			"The entity classifies information to identify and protect confidential information.",
		domain: "Confidentiality",
		frameworkId: "soc2",
		requirementId: "C1",
		artifacts: [
			{
				type: "policy",
				policyId: "data_classification",
			},
			{
				type: "evidence",
				evidenceId: "data_classification_records",
			},
		],
	},
	{
		name: "Access Restrictions for Confidential Data",
		description:
			"The entity restricts access to confidential information on a need-to-know basis.",
		domain: "Confidentiality",
		frameworkId: "soc2",
		requirementId: "C1",
		artifacts: [
			{
				type: "policy",
				policyId: "data_classification",
			},
			{
				type: "evidence",
				evidenceId: "access_logs",
			},
		],
	},
	{
		name: "Confidential Data Disposal",
		description:
			"The entity securely disposes of confidential information when no longer needed.",
		domain: "Confidentiality",
		frameworkId: "soc2",
		requirementId: "C1",
		artifacts: [
			{
				type: "policy",
				policyId: "data_classification",
			},
			{
				type: "evidence",
				evidenceId: "disposal_records",
			},
		],
	},
	{
		name: "Accuracy and Completeness",
		description:
			"The entity ensures data is processed accurately and completely.",
		domain: "Processing Integrity",
		frameworkId: "soc2",
		requirementId: "PI1",
		artifacts: [
			{
				type: "policy",
				policyId: "information_security",
			},
			{
				type: "evidence",
				evidenceId: "data_validation_records",
			},
		],
	},
	{
		name: "Input, Processing, and Output Controls",
		description:
			"The entity validates the completeness and accuracy of data throughout processing.",
		domain: "Processing Integrity",
		frameworkId: "soc2",
		requirementId: "PI1",
		artifacts: [
			{
				type: "policy",
				policyId: "information_security",
			},
			{
				type: "evidence",
				evidenceId: "data_processing_logs",
			},
		],
	},
	{
		name: "Exception Handling",
		description:
			"The entity identifies and resolves processing exceptions in a timely manner.",
		domain: "Processing Integrity",
		frameworkId: "soc2",
		requirementId: "PI1",
		artifacts: [
			{
				type: "policy",
				policyId: "information_security",
			},
			{
				type: "evidence",
				evidenceId: "exception_logs",
			},
		],
	},
	{
		name: "Privacy Notice",
		description:
			"The entity provides notice about the collection, use, and disclosure of personal information.",
		domain: "Privacy",
		frameworkId: "soc2",
		requirementId: "P1",
		artifacts: [
			{
				type: "policy",
				policyId: "privacy",
			},
			{
				type: "evidence",
				evidenceId: "privacy_notice",
			},
		],
	},
	{
		name: "Choice and Consent",
		description:
			"The entity obtains consent for personal information where required by policy or law.",
		domain: "Privacy",
		frameworkId: "soc2",
		requirementId: "P1",
		artifacts: [
			{
				type: "policy",
				policyId: "privacy",
			},
			{
				type: "evidence",
				evidenceId: "consent_records",
			},
		],
	},
	{
		name: "Data Retention and Disposal",
		description:
			"The entity retains personal information for only as long as needed and disposes of it securely.",
		domain: "Privacy",
		frameworkId: "soc2",
		requirementId: "P1",
		artifacts: [
			{
				type: "policy",
				policyId: "privacy",
			},
			{
				type: "evidence",
				evidenceId: "retention_schedules",
			},
		],
	},
];
