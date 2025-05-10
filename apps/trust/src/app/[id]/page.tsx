import { findOrganization, getPublishedControls, getPublishedPolicies } from "./lib/data";
import ComplianceReport from './components/report';

export default async function Page({ params }: { params: Promise<{ subdomain: string }> }) {
    const subdomain = (await params).subdomain;

    const organization = await findOrganization(subdomain);

    if (!organization) {
        return <div>Organization not found</div>;
    }

    const policies = await getPublishedPolicies(organization.id);
    const controls = await getPublishedControls(organization.id);

    return <ComplianceReport organization={organization} policies={policies} controls={controls} />;
}
