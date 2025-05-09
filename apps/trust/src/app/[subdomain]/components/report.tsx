import ComplianceHeader from '../components/compliance-header';
import ComplianceSummary from '../components/compliance-summary';
import ComplianceSection from '../components/compliance-section';
import ComplianceItem from '../components/compliance-item';
import type { Organization, Policy, Task } from '@comp/db/types';

interface ComplianceReportProps {
    organization: Organization;
    policies: Policy[];
    controls: Task[];
}

export default function ComplianceReport({ organization, policies, controls }: ComplianceReportProps) {
    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto p-6">
                <div className="rounded-lg">
                    <div>
                        <ComplianceHeader
                            organization={organization}
                            title={`${organization.name} - Trust Center`}
                        />

                        <ComplianceSummary
                            text={`${organization.name} is using Comp AI to monitor their compliance against frameworks like SOC 2, ISO 27001, and more.`}
                        />

                        <div className="border-b mt-4" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <ComplianceSection title="Policies" isLive>
                            <div className="space-y-2">
                                {policies.map((policy) => (
                                    <ComplianceItem key={policy.id} text={policy.name} isCompliant={policy.status === "published"} />
                                ))}
                            </div>
                        </ComplianceSection>

                        <ComplianceSection title="Controls" isLive>
                            <div className="space-y-2">
                                {controls.map((control) => (
                                    <ComplianceItem key={control.id} text={control.title} isCompliant={control.status === "done"} />
                                ))}
                            </div>
                        </ComplianceSection>
                    </div>

                </div>
            </div>
        </div>
    );
}
