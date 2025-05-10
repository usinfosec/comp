import ComplianceHeader from './compliance-header';
import ComplianceSummary from './compliance-summary';
import ComplianceSection from './compliance-section';
import ComplianceItem from './compliance-item';
import type { Organization, Policy, Task } from '@comp/db/types';

interface ComplianceReportProps {
    organization: Organization;
    policies: Pick<Policy, "id" | "name" | "status">[];
    controls: Pick<Task, "id" | "title" | "status">[];
}

export default function ComplianceReport({ organization, policies, controls }: ComplianceReportProps) {
    return (
        <div>
            <div className="max-w-6xl mx-auto">
                <div className="rounded-lg">
                    <div>
                        <ComplianceHeader
                            organization={organization}
                            title={`${organization.name} - Trust Center`}
                        />

                        <ComplianceSummary
                            text={`${organization.name} is using Comp AI to monitor their compliance against common cybersecurity frameworks like SOC 2, ISO 27001, and more.`}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {policies.length > 0 && (
                            <ComplianceSection title="Policies" isLive>
                                <div className="space-y-2">
                                    {policies.map((policy) => (
                                        <ComplianceItem key={policy.id} text={policy.name} isCompliant={policy.status === "published"} />
                                    ))}
                                </div>
                            </ComplianceSection>
                        )}

                        {controls.length > 0 && (
                            <ComplianceSection title="Controls" isLive>
                                <div className="space-y-2">
                                    {controls.map((control) => (
                                        <ComplianceItem key={control.id} text={control.title} isCompliant={control.status === "done"} />
                                    ))}
                                </div>
                            </ComplianceSection>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
