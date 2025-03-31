import type { Controls } from "./types";
import { boardOversight } from "./data/board-oversight";
import { managementPhilosophy } from "./data/management-philosophy";
import { organizationalStructure } from "./data/organizational-structure";
import { personnelPolicies } from "./data/personnel-policies";
import { codeOfConduct } from "./data/code-of-conduct";
import { informationQuality } from "./data/information-quality";
import { internalCommunication } from "./data/internal-communication";
import { externalCommunication } from "./data/external-communication";
import { riskAssessmentProcess } from "./data/risk-assessment-process";
import { riskIdentification } from "./data/risk-identification";
import { fraudRiskAssessment } from "./data/fraud-risk-assessment";
import { changeManagementRisk } from "./data/change-management-risk";
import { controlMonitoring } from "./data/control-monitoring";
import { deficiencyManagement } from "./data/deficiency-management";
import { controlSelection } from "./data/control-selection";
import { technologyControls } from "./data/technology-controls";
import { policyImplementation } from "./data/policy-implementation";
import { accessSecurity } from "./data/access-security";
import { accessAuthentication } from "./data/access-authentication";
import { accessRemoval } from "./data/access-removal";
import { accessReview } from "./data/access-review";
import { systemAccountManagement } from "./data/system-account-management";
import { accessRestrictions } from "./data/access-restrictions";
import { informationAssetChanges } from "./data/information-asset-changes";
import { maliciousSoftwarePrevention } from "./data/malicious-software-prevention";
import { infrastructureMonitoring } from "./data/infrastructure-monitoring";
import { securityEventResponse } from "./data/security-event-response";
import { securityEventRecovery } from "./data/security-event-recovery";
import { securityEventAnalysis } from "./data/security-event-analysis";
import { securityEventCommunication } from "./data/security-event-communication";
import { confidentialInformationClassification } from "./data/confidential-information-classification";
import { accessRestrictionsForConfidentialData } from "./data/access-restrictions-for-confidential-data";
import { confidentialDataDisposal } from "./data/confidential-data-disposal";
import { accuracyAndCompleteness } from "./data/accuracy-and-completeness";
import { inputProcessingAndOutputControls } from "./data/input-processing-and-output-controls";
import { exceptionHandling } from "./data/exception-handling";
import { privacyNotice } from "./data/privacy-notice";
import { choiceAndConsent } from "./data/choice-and-consent";
import { dataRetentionAndDisposal } from "./data/data-retention-and-disposal";

export const controls: Controls = [
	boardOversight,
	managementPhilosophy,
	organizationalStructure,
	personnelPolicies,
	codeOfConduct,
	informationQuality,
	internalCommunication,
	externalCommunication,
	riskAssessmentProcess,
	riskIdentification,
	fraudRiskAssessment,
	changeManagementRisk,
	controlMonitoring,
	deficiencyManagement,
	controlSelection,
	technologyControls,
	policyImplementation,
	accessSecurity,
	accessAuthentication,
	accessRemoval,
	accessReview,
	systemAccountManagement,
	accessRestrictions,
	informationAssetChanges,
	maliciousSoftwarePrevention,
	infrastructureMonitoring,
	securityEventResponse,
	securityEventRecovery,
	securityEventAnalysis,
	securityEventCommunication,
	confidentialInformationClassification,
	accessRestrictionsForConfidentialData,
	confidentialDataDisposal,
	accuracyAndCompleteness,
	inputProcessingAndOutputControls,
	exceptionHandling,
	privacyNotice,
	choiceAndConsent,
	dataRetentionAndDisposal,
] as const;
