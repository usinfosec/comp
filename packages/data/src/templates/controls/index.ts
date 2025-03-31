import type { Controls } from "./types";
import { boardOversight } from "./items/board-oversight";
import { managementPhilosophy } from "./items/management-philosophy";
import { organizationalStructure } from "./items/organizational-structure";
import { personnelPolicies } from "./items/personnel-policies";
import { codeOfConduct } from "./items/code-of-conduct";
import { informationQuality } from "./items/information-quality";
import { internalCommunication } from "./items/internal-communication";
import { externalCommunication } from "./items/external-communication";
import { riskAssessmentProcess } from "./items/risk-assessment-process";
import { riskIdentification } from "./items/risk-identification";
import { fraudRiskAssessment } from "./items/fraud-risk-assessment";
import { changeManagementRisk } from "./items/change-management-risk";
import { controlMonitoring } from "./items/control-monitoring";
import { deficiencyManagement } from "./items/deficiency-management";
import { controlSelection } from "./items/control-selection";
import { technologyControls } from "./items/technology-controls";
import { policyImplementation } from "./items/policy-implementation";
import { accessSecurity } from "./items/access-security";
import { accessAuthentication } from "./items/access-authentication";

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
] as const;
