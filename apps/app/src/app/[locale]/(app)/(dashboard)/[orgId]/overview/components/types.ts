import type {
  Framework,
  OrganizationEvidence,
  OrganizationFramework,
  OrganizationIntegrationResults,
  OrganizationPolicy,
} from "@bubba/db/types";

export interface ComplianceScoresProps {
  policiesCompliance: number;
  evidenceTasksCompliance: number;
  cloudTestsCompliance: number;
  overallCompliance: number;
  frameworkCompliance: {
    id: string;
    name: string;
    compliance: number;
  }[];
  policies: OrganizationPolicy[];
  evidenceTasks: OrganizationEvidence[];
  tests: OrganizationIntegrationResults[];
}

export interface FrameworkWithCompliance {
  framework: OrganizationFramework & {
    framework: Framework;
  };
  compliance: number;
}
