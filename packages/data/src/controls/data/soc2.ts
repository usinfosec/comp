import type { Controls } from "../types";

export const soc2Controls: Controls = {
	"CC1.1": {
		code: "CC1.1",
		name: "Board Oversight",
		description:
			"The board of directors demonstrates independence from management and exercises oversight of the development and performance of internal control.",
		domain: "Control Environment",
		requirementId: "CC1",
		artifacts: [
			{
				id: "CC1.1-policy",
				type: "policy",
				policyId: "corporate_governance",
			},
			{
				id: "CC1.1-evidence",
				type: "evidence",
				evidenceId: "board_meeting_documentation",
			},
		],
	},
	"CC1.2": {
		code: "CC1.2",
		name: "Management Philosophy",
		description:
			"Management establishes, with board oversight, structures, reporting lines, and appropriate authorities and responsibilities in the pursuit of objectives.",
		domain: "Control Environment",
		requirementId: "CC1",
		artifacts: [
			{
				id: "CC1.2-policy",
				type: "policy",
				policyId: "corporate_governance",
			},
			{
				id: "CC1.2-training",
				type: "training",
				name: "Management Control Training",
				description:
					"Training for management on internal control responsibilities and ethical decision-making.",
			},
			{
				id: "CC1.2-evidence",
				type: "evidence",
				evidenceId: "management_structure_documentation",
			},
		],
	},
	"CC1.3": {
		code: "CC1.3",
		name: "Organizational Structure",
		description:
			"The organization demonstrates a commitment to attract, develop, and retain competent individuals in alignment with objectives.",
		domain: "Control Environment",
		requirementId: "CC1",
		artifacts: [
			{
				id: "CC1.3-policy",
				type: "policy",
				policyId: "human_resources",
			},
			{
				id: "CC1.3-evidence",
				type: "evidence",
				evidenceId: "hr_documentation",
			},
		],
	},
	"CC1.4": {
		code: "CC1.4",
		name: "Personnel Policies",
		description:
			"The organization holds individuals accountable for their internal control responsibilities in the pursuit of objectives.",
		domain: "Control Environment",
		requirementId: "CC1",
		artifacts: [
			{
				id: "CC1.4-policy",
				type: "policy",
				policyId: "human_resources",
			},
			{
				id: "CC1.4-training",
				type: "training",
				name: "Control Responsibility Training",
				description:
					"Mandatory training on internal control responsibilities and ethical conduct.",
			},
			{
				id: "CC1.4-evidence",
				type: "evidence",
				evidenceId: "personnel_compliance_documentation",
			},
		],
	},
	"CC1.5": {
		code: "CC1.5",
		name: "Code of Conduct",
		description:
			"The organization demonstrates a commitment to integrity and ethical values.",
		domain: "Control Environment",
		requirementId: "CC1",
		artifacts: [
			{
				id: "CC1.5-policy",
				type: "policy",
				policyId: "corporate_governance",
			},
			{
				id: "CC1.5-training",
				type: "training",
				name: "Ethics Training",
				description: "Regular ethics and integrity training for all employees.",
			},
			{
				id: "CC1.5-evidence",
				type: "evidence",
				evidenceId: "ethics_compliance_documentation",
			},
		],
	},
	"CC2.1": {
		code: "CC2.1",
		name: "Information Quality",
		description:
			"The organization obtains or generates and uses relevant, quality information to support the functioning of internal control.",
		domain: "Communication",
		requirementId: "CC2",
		artifacts: [
			{
				id: "CC2.1-policy",
				type: "policy",
				policyId: "information_security",
			},
			{
				id: "CC2.1-evidence",
				type: "evidence",
				evidenceId: "data_quality_documentation",
			},
		],
	},
	"CC2.2": {
		code: "CC2.2",
		name: "Internal Communication",
		description:
			"The organization internally communicates information, including objectives and responsibilities for internal control.",
		domain: "Communication",
		requirementId: "CC2",
		artifacts: [
			{
				id: "CC2.2-policy",
				type: "policy",
				policyId: "corporate_governance",
			},
			{
				id: "CC2.2-evidence",
				type: "evidence",
				evidenceId: "communication_records",
			},
		],
	},
	"CC2.3": {
		code: "CC2.3",
		name: "External Communication",
		description:
			"The organization communicates with external parties regarding matters affecting the functioning of internal control.",
		domain: "Communication",
		requirementId: "CC2",
		artifacts: [
			{
				id: "CC2.3-policy",
				type: "policy",
				policyId: "corporate_governance",
			},
			{
				id: "CC2.3-evidence",
				type: "evidence",
				evidenceId: "external_communication_records",
			},
		],
	},
	"CC3.1": {
		code: "CC3.1",
		name: "Risk Assessment Process",
		description:
			"The organization specifies objectives with sufficient clarity to enable the identification and assessment of risks relating to objectives.",
		domain: "Risk Assessment",
		requirementId: "CC3",
		artifacts: [
			{
				id: "CC3.1-policy",
				type: "policy",
				policyId: "risk_management",
			},
			{
				id: "CC3.1-evidence",
				type: "evidence",
				evidenceId: "risk_assessment_documentation",
			},
		],
	},
	"CC3.2": {
		code: "CC3.2",
		name: "Risk Identification",
		description:
			"The organization identifies risks to the achievement of its objectives across the entity and analyzes risks as a basis for determining how the risks should be managed.",
		domain: "Risk Assessment",
		requirementId: "CC3",
		artifacts: [
			{
				id: "CC3.2-policy",
				type: "policy",
				policyId: "risk_management",
			},
			{
				id: "CC3.2-evidence",
				type: "evidence",
				evidenceId: "risk_identification_records",
			},
		],
	},
	"CC3.3": {
		code: "CC3.3",
		name: "Fraud Risk Assessment",
		description:
			"The organization considers the potential for fraud in assessing risks to the achievement of objectives.",
		domain: "Risk Assessment",
		requirementId: "CC3",
		artifacts: [
			{
				id: "CC3.3-policy",
				type: "policy",
				policyId: "risk_management",
			},
			{
				id: "CC3.3-evidence",
				type: "evidence",
				evidenceId: "fraud_risk_documentation",
			},
		],
	},
	"CC3.4": {
		code: "CC3.4",
		name: "Change Management Risk",
		description:
			"The organization identifies and assesses changes that could significantly impact the system of internal control.",
		domain: "Risk Assessment",
		requirementId: "CC3",
		artifacts: [
			{
				id: "CC3.4-policy",
				type: "policy",
				policyId: "change_management",
			},
			{
				id: "CC3.4-evidence",
				type: "evidence",
				evidenceId: "change_risk_documentation",
			},
		],
	},
	"CC4.1": {
		code: "CC4.1",
		name: "Control Monitoring",
		description:
			"The organization selects, develops, and performs ongoing and/or separate evaluations to ascertain whether the components of internal control are present and functioning.",
		domain: "Monitoring Activities",
		requirementId: "CC4",
		artifacts: [
			{
				id: "CC4.1-policy",
				type: "policy",
				policyId: "information_security",
			},
			{
				id: "CC4.1-evidence",
				type: "evidence",
				evidenceId: "control_testing_documentation",
			},
		],
	},
	"CC4.2": {
		code: "CC4.2",
		name: "Deficiency Management",
		description:
			"The organization evaluates and communicates internal control deficiencies in a timely manner to those parties responsible for taking corrective action.",
		domain: "Monitoring Activities",
		requirementId: "CC4",
		artifacts: [
			{
				id: "CC4.2-policy",
				type: "policy",
				policyId: "risk_management",
			},
			{
				id: "CC4.2-evidence",
				type: "evidence",
				evidenceId: "deficiency_management_records",
			},
		],
	},
	"CC5.1": {
		code: "CC5.1",
		name: "Control Selection",
		description:
			"The organization selects and develops control activities that contribute to the mitigation of risks to the achievement of objectives to acceptable levels.",
		domain: "Control Activities",
		requirementId: "CC5",
		artifacts: [
			{
				id: "CC5.1-policy",
				type: "policy",
				policyId: "information_security",
			},
			{
				id: "CC5.1-evidence",
				type: "evidence",
				evidenceId: "control_implementation_records",
			},
		],
	},
	"CC5.2": {
		code: "CC5.2",
		name: "Technology Controls",
		description:
			"The organization selects and develops general control activities over technology to support the achievement of objectives.",
		domain: "Control Activities",
		requirementId: "CC5",
		artifacts: [
			{
				id: "CC5.2-policy",
				type: "policy",
				policyId: "information_security",
			},
			{
				id: "CC5.2-evidence",
				type: "evidence",
				evidenceId: "technology_control_records",
			},
		],
	},
	"CC5.3": {
		code: "CC5.3",
		name: "Policy Implementation",
		description:
			"The organization deploys control activities through policies that establish what is expected and procedures that put policies into action.",
		domain: "Control Activities",
		requirementId: "CC5",
		artifacts: [
			{
				id: "CC5.3-policy",
				type: "policy",
				policyId: "corporate_governance",
			},
			{
				id: "CC5.3-evidence",
				type: "evidence",
				evidenceId: "policy_implementation_records",
			},
		],
	},
	"CC6.1": {
		code: "CC6.1",
		name: "Access Security",
		description:
			"The organization implements logical access security software, infrastructure, and architectures over protected information assets to protect them from security events.",
		domain: "Logical and Physical Access Controls",
		requirementId: "CC6",
		artifacts: [
			{
				id: "CC6.1-policy",
				type: "policy",
				policyId: "access_control",
			},
			{
				id: "CC6.1-evidence",
				type: "evidence",
				evidenceId: "access_control_records",
			},
		],
	},
	"CC6.2": {
		code: "CC6.2",
		name: "Access Authentication",
		description:
			"Prior to issuing system credentials and granting system access, the organization registers and authorizes new internal and external users.",
		domain: "Logical and Physical Access Controls",
		requirementId: "CC6",
		artifacts: [
			{
				id: "CC6.2-policy",
				type: "policy",
				policyId: "access_control",
			},
			{
				id: "CC6.2-evidence",
				type: "evidence",
				evidenceId: "authentication_records",
			},
		],
	},
	"CC6.3": {
		code: "CC6.3",
		name: "Access Removal",
		description:
			"The organization removes access to protected information assets when appropriate.",
		domain: "Logical and Physical Access Controls",
		requirementId: "CC6",
		artifacts: [
			{
				id: "CC6.3-policy",
				type: "policy",
				policyId: "access_control",
			},
			{
				id: "CC6.3-evidence",
				type: "evidence",
				evidenceId: "access_removal_records",
			},
		],
	},
	"CC6.4": {
		code: "CC6.4",
		name: "Access Review",
		description:
			"The organization evaluates and manages access to protected information assets on a periodic basis.",
		domain: "Logical and Physical Access Controls",
		requirementId: "CC6",
		artifacts: [
			{
				id: "CC6.4-policy",
				type: "policy",
				policyId: "access_control",
			},
			{
				id: "CC6.4-evidence",
				type: "evidence",
				evidenceId: "access_review_records",
			},
		],
	},
	"CC6.5": {
		code: "CC6.5",
		name: "System Account Management",
		description:
			"The organization identifies and authenticates system users, devices, and other systems before allowing access.",
		domain: "Logical and Physical Access Controls",
		requirementId: "CC6",
		artifacts: [
			{
				id: "CC6.5-policy",
				type: "policy",
				policyId: "access_control",
			},
			{
				id: "CC6.5-evidence",
				type: "evidence",
				evidenceId: "account_management_records",
			},
		],
	},
	"CC6.6": {
		code: "CC6.6",
		name: "Access Restrictions",
		description:
			"The organization restricts physical access to facilities and protected information assets.",
		domain: "Logical and Physical Access Controls",
		requirementId: "CC6",
		artifacts: [
			{
				id: "CC6.6-policy",
				type: "policy",
				policyId: "access_control",
			},
			{
				id: "CC6.6-evidence",
				type: "evidence",
				evidenceId: "physical_access_records",
			},
		],
	},
	"CC6.7": {
		code: "CC6.7",
		name: "Information Asset Changes",
		description:
			"The organization manages changes to system components to minimize the risk of unauthorized changes.",
		domain: "Logical and Physical Access Controls",
		requirementId: "CC6",
		artifacts: [
			{
				id: "CC6.7-policy",
				type: "policy",
				policyId: "change_management",
			},
			{
				id: "CC6.7-evidence",
				type: "evidence",
				evidenceId: "change_management_records",
			},
		],
	},
	"CC6.8": {
		code: "CC6.8",
		name: "Malicious Software Prevention",
		description:
			"The organization implements controls to prevent or detect and act upon the introduction of unauthorized or malicious software.",
		domain: "Logical and Physical Access Controls",
		requirementId: "CC6",
		artifacts: [
			{
				id: "CC6.8-policy",
				type: "policy",
				policyId: "information_security",
			},
			{
				id: "CC6.8-evidence",
				type: "evidence",
				evidenceId: "malware_prevention_records",
			},
		],
	},
	"CC7.1": {
		code: "CC7.1",
		name: "Infrastructure Monitoring",
		description:
			"To detect and act upon security events in a timely manner, the organization monitors system capacity, security threats, and vulnerabilities.",
		domain: "System Operations",
		requirementId: "CC7",
		artifacts: [
			{
				id: "CC7.1-policy",
				type: "policy",
				policyId: "information_security",
			},
			{
				id: "CC7.1-evidence",
				type: "evidence",
				evidenceId: "infrastructure_monitoring_records",
			},
		],
	},
	"CC7.2": {
		code: "CC7.2",
		name: "Security Event Response",
		description:
			"The organization designs, develops, and implements policies and procedures to respond to security incidents and breaches.",
		domain: "System Operations",
		requirementId: "CC7",
		artifacts: [
			{
				id: "CC7.2-policy",
				type: "policy",
				policyId: "incident_response",
			},
			{
				id: "CC7.2-evidence",
				type: "evidence",
				evidenceId: "incident_response_records",
			},
		],
	},
	"CC7.3": {
		code: "CC7.3",
		name: "Security Event Recovery",
		description:
			"The organization implements recovery procedures to ensure timely restoration of systems or assets affected by security incidents.",
		domain: "System Operations",
		requirementId: "CC7",
		artifacts: [
			{
				id: "CC7.3-policy",
				type: "policy",
				policyId: "business_continuity",
			},
			{
				id: "CC7.3-evidence",
				type: "evidence",
				evidenceId: "recovery_records",
			},
		],
	},
	"CC7.4": {
		code: "CC7.4",
		name: "Security Event Analysis",
		description:
			"The organization implements incident response activities to identify root causes of security incidents and develop remediation plans.",
		domain: "System Operations",
		requirementId: "CC7",
		artifacts: [
			{
				id: "CC7.4-policy",
				type: "policy",
				policyId: "incident_response",
			},
			{
				id: "CC7.4-evidence",
				type: "evidence",
				evidenceId: "incident_analysis_records",
			},
		],
	},
	"CC7.5": {
		code: "CC7.5",
		name: "Security Event Communication",
		description:
			"The organization identifies, develops, and implements activities to communicate security incidents to affected parties.",
		domain: "System Operations",
		requirementId: "CC7",
		artifacts: [
			{
				id: "CC7.5-policy",
				type: "policy",
				policyId: "incident_response",
			},
			{
				id: "CC7.5-evidence",
				type: "evidence",
				evidenceId: "incident_communication_records",
			},
		],
	},
	"CC8.1": {
		code: "CC8.1",
		name: "Change Authorization",
		description:
			"The organization authorizes, designs, develops or acquires, configures, documents, tests, approves, and implements changes to infrastructure, data, software, and procedures.",
		domain: "Change Management",
		requirementId: "CC8",
		artifacts: [
			{
				id: "CC8.1-policy",
				type: "policy",
				policyId: "change_management",
			},
			{
				id: "CC8.1-evidence",
				type: "evidence",
				evidenceId: "change_request_logs",
			},
		],
	},
	"CC9.1": {
		code: "CC9.1",
		name: "Business Continuity Planning",
		description:
			"The organization identifies, develops, and implements activities to recover critical information technology resources.",
		domain: "Risk Mitigation",
		requirementId: "CC9",
		artifacts: [
			{
				id: "CC9.1-policy",
				type: "policy",
				policyId: "business_continuity",
			},
			{
				id: "CC9.1-evidence",
				type: "evidence",
				evidenceId: "business_continuity_plans",
			},
		],
	},
	"CC9.2": {
		code: "CC9.2",
		name: "Vendor Risk Management",
		description:
			"The organization assesses and manages risks associated with vendors and business partners.",
		domain: "Risk Mitigation",
		requirementId: "CC9",
		artifacts: [
			{
				id: "CC9.2-policy",
				type: "policy",
				policyId: "vendor_risk_management",
			},
			{
				id: "CC9.2-evidence",
				type: "evidence",
				evidenceId: "vendor_risk_assessment_records",
			},
		],
	},
	"CC9.9": {
		code: "CC9.9",
		name: "Business Continuity and Disaster Recovery Testing",
		description:
			"The organization tests business continuity and disaster recovery plans, evaluates the test results, and updates the plans accordingly.",
		domain: "Risk Mitigation",
		requirementId: "CC9",
		artifacts: [
			{
				id: "CC9.9-policy",
				type: "policy",
				policyId: "business_continuity",
			},
			{
				id: "CC9.9-evidence",
				type: "evidence",
				evidenceId: "business_continuity_and_disaster_recovery_testing_records",
			},
		],
	},
	"A1.1": {
		code: "A1.1",
		name: "Availability Commitments",
		description:
			"The entity maintains commitments to ensure systems are available for operation.",
		domain: "Availability",
		requirementId: "A1",
		artifacts: [
			{
				id: "A1.1-policy",
				type: "policy",
				policyId: "availability",
			},
			{
				id: "A1.1-evidence",
				type: "evidence",
				evidenceId: "uptime_reports",
			},
		],
	},
	"A1.2": {
		code: "A1.2",
		name: "Capacity Planning",
		description:
			"The entity monitors and manages system capacity to meet demands.",
		domain: "Availability",
		requirementId: "A1",
		artifacts: [
			{
				id: "A1.2-policy",
				type: "policy",
				policyId: "availability",
			},
			{
				id: "A1.2-evidence",
				type: "evidence",
				evidenceId: "capacity_reports",
			},
		],
	},
	"A1.3": {
		code: "A1.3",
		name: "Incident Recovery",
		description:
			"The entity has controls to restore system availability after incidents.",
		domain: "Availability",
		requirementId: "A1",
		artifacts: [
			{
				id: "A1.3-policy",
				type: "policy",
				policyId: "business_continuity",
			},
			{
				id: "A1.3-evidence",
				type: "evidence",
				evidenceId: "incident_recovery_records",
			},
		],
	},
	"C1.1": {
		code: "C1.1",
		name: "Confidential Information Classification",
		description:
			"The entity classifies information to identify and protect confidential information.",
		domain: "Confidentiality",
		requirementId: "C1",
		artifacts: [
			{
				id: "C1.1-policy",
				type: "policy",
				policyId: "data_classification",
			},
			{
				id: "C1.1-evidence",
				type: "evidence",
				evidenceId: "data_classification_records",
			},
		],
	},
	"C1.2": {
		code: "C1.2",
		name: "Access Restrictions for Confidential Data",
		description:
			"The entity restricts access to confidential information on a need-to-know basis.",
		domain: "Confidentiality",
		requirementId: "C1",
		artifacts: [
			{
				id: "C1.2-policy",
				type: "policy",
				policyId: "data_classification",
			},
			{
				id: "C1.2-evidence",
				type: "evidence",
				evidenceId: "access_logs",
			},
		],
	},
	"C1.3": {
		code: "C1.3",
		name: "Confidential Data Disposal",
		description:
			"The entity securely disposes of confidential information when no longer needed.",
		domain: "Confidentiality",
		requirementId: "C1",
		artifacts: [
			{
				id: "C1.3-policy",
				type: "policy",
				policyId: "data_classification",
			},
			{
				id: "C1.3-evidence",
				type: "evidence",
				evidenceId: "disposal_records",
			},
		],
	},
	"PI1.1": {
		code: "PI1.1",
		name: "Accuracy and Completeness",
		description:
			"The entity ensures data is processed accurately and completely.",
		domain: "Processing Integrity",
		requirementId: "PI1",
		artifacts: [
			{
				id: "PI1.1-policy",
				type: "policy",
				policyId: "information_security",
			},
			{
				id: "PI1.1-evidence",
				type: "evidence",
				evidenceId: "data_validation_records",
			},
		],
	},
	"PI1.2": {
		code: "PI1.2",
		name: "Input, Processing, and Output Controls",
		description:
			"The entity validates the completeness and accuracy of data throughout processing.",
		domain: "Processing Integrity",
		requirementId: "PI1",
		artifacts: [
			{
				id: "PI1.2-policy",
				type: "policy",
				policyId: "information_security",
			},
			{
				id: "PI1.2-evidence",
				type: "evidence",
				evidenceId: "data_processing_logs",
			},
		],
	},
	"PI1.3": {
		code: "PI1.3",
		name: "Exception Handling",
		description:
			"The entity identifies and resolves processing exceptions in a timely manner.",
		domain: "Processing Integrity",
		requirementId: "PI1",
		artifacts: [
			{
				id: "PI1.3-policy",
				type: "policy",
				policyId: "information_security",
			},
			{
				id: "PI1.3-evidence",
				type: "evidence",
				evidenceId: "exception_logs",
			},
		],
	},
	"P1.1": {
		code: "P1.1",
		name: "Privacy Notice",
		description:
			"The entity provides notice about the collection, use, and disclosure of personal information.",
		domain: "Privacy",
		requirementId: "P1",
		artifacts: [
			{
				id: "P1.1-policy",
				type: "policy",
				policyId: "privacy",
			},
			{
				id: "P1.1-evidence",
				type: "evidence",
				evidenceId: "privacy_notice",
			},
		],
	},
	"P1.2": {
		code: "P1.2",
		name: "Choice and Consent",
		description:
			"The entity obtains consent for personal information where required by policy or law.",
		domain: "Privacy",
		requirementId: "P1",
		artifacts: [
			{
				id: "P1.2-policy",
				type: "policy",
				policyId: "privacy",
			},
			{
				id: "P1.2-evidence",
				type: "evidence",
				evidenceId: "consent_records",
			},
		],
	},
	"P1.3": {
		code: "P1.3",
		name: "Data Retention and Disposal",
		description:
			"The entity retains personal information for only as long as needed and disposes of it securely.",
		domain: "Privacy",
		requirementId: "P1",
		artifacts: [
			{
				id: "P1.3-policy",
				type: "policy",
				policyId: "privacy",
			},
			{
				id: "P1.3-evidence",
				type: "evidence",
				evidenceId: "retention_schedules",
			},
		],
	},
};
