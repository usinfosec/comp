import { accessControlRecords } from "./data/access_control_records";
import { accessLogs } from "./data/access_logs";
import { accessRemovalRecords } from "./data/access_removal_records";
import { accessReviewRecords } from "./data/access_review_records";
import { accountManagementRecords } from "./data/account_management_records";
import { authenticationRecords } from "./data/authentication_records";
import { boardMeetingDocumentation } from "./data/board_meeting_documentation";
import { businessContinuityAndDisasterRecoveryTestingRecords } from "./data/business_continuity_and_disaster_recovery_testing_records";
import { businessContinuityPlans } from "./data/business_continuity_plans";
import { capacityReports } from "./data/capacity_reports";
import { changeManagementRecords } from "./data/change_management_records";
import { changeRequestLogs } from "./data/change_request_logs";
import { changeRiskDocumentation } from "./data/change_risk_documentation";
import { communicationRecords } from "./data/communication_records";
import { consentRecords } from "./data/consent_records";
import { controlImplementationRecords } from "./data/control_implementation_records";
import { controlTestingDocumentation } from "./data/control_testing_documentation";
import { dataClassificationRecords } from "./data/data_classification_records";
import { dataProcessingLogs } from "./data/data_processing_logs";
import { dataQualityDocumentation } from "./data/data_quality_documentation";
import { dataValidationRecords } from "./data/data_validation_records";
import { deficiencyManagementRecords } from "./data/deficiency_management_records";
import { disposalRecords } from "./data/disposal_records";
import { ethicsComplianceDocumentation } from "./data/ethics_compliance_documentation";
import { exceptionLogs } from "./data/exception_logs";
import { externalCommunicationRecords } from "./data/external_communication_records";
import { fraudRiskDocumentation } from "./data/fraud_risk_documentation";
import { hrDocumentation } from "./data/hr_documentation";
import { incidentAnalysisRecords } from "./data/incident_analysis_records";
import { incidentCommunicationRecords } from "./data/incident_communication_records";
import { incidentRecoveryRecords } from "./data/incident_recovery_records";
import { incidentResponseRecords } from "./data/incident_response_records";
import { infrastructureMonitoringRecords } from "./data/infrastructure_monitoring_records";
import { malwarePreventionRecords } from "./data/malware_prevention_records";
import { managementStructureDocumentation } from "./data/management_structure_documentation";
import { personnelComplianceDocumentation } from "./data/personnel_compliance_documentation";
import { physicalAccessRecords } from "./data/physical_access_records";
import { policyImplementationRecords } from "./data/policy_implementation_records";
import { privacyNotice } from "./data/privacy_notice";
import { recoveryRecords } from "./data/recovery_records";
import { retentionSchedules } from "./data/retention_schedules";
import { riskAssessmentDocumentation } from "./data/risk_assessment_documentation";
import { riskIdentificationRecords } from "./data/risk_identification_records";
import { technologyControlRecords } from "./data/technology_control_records";
import { uptimeReports } from "./data/uptime_reports";
import { vendorRiskAssessmentRecords } from "./data/vendor_risk_assessment_records";

export const evidence = {
	accessControlRecords,
	accessLogs,
	accessRemovalRecords,
	accessReviewRecords,
	accountManagementRecords,
	authenticationRecords,
	boardMeetingDocumentation,
	businessContinuityAndDisasterRecoveryTestingRecords,
	businessContinuityPlans,
	capacityReports,
	changeManagementRecords,
	changeRequestLogs,
	changeRiskDocumentation,
	communicationRecords,
	consentRecords,
	controlImplementationRecords,
	controlTestingDocumentation,
	dataClassificationRecords,
	dataProcessingLogs,
	dataQualityDocumentation,
	dataValidationRecords,
	deficiencyManagementRecords,
	disposalRecords,
	ethicsComplianceDocumentation,
	exceptionLogs,
	externalCommunicationRecords,
	fraudRiskDocumentation,
	hrDocumentation,
	incidentAnalysisRecords,
	incidentCommunicationRecords,
	incidentRecoveryRecords,
	incidentResponseRecords,
	infrastructureMonitoringRecords,
	malwarePreventionRecords,
	managementStructureDocumentation,
	personnelComplianceDocumentation,
	physicalAccessRecords,
	policyImplementationRecords,
	privacyNotice,
	recoveryRecords,
	retentionSchedules,
	riskAssessmentDocumentation,
	riskIdentificationRecords,
	technologyControlRecords,
	uptimeReports,
	vendorRiskAssessmentRecords,
};

export type EvidenceId = keyof typeof evidence;
