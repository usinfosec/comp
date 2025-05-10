import { findOrganization, getPublishedControls, getPublishedPolicies } from "./lib/data";
import ComplianceReport from './components/report';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;

    const organization = await findOrganization(id);

    if (!organization) {
        return <div>Organization not found</div>;
    }

    const policies = await getPublishedPolicies(organization.id);
    const controls = await getPublishedControls(organization.id);

    return <ComplianceReport organization={organization} policies={policies} controls={controls} />;
}
