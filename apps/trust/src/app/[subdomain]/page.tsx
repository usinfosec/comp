import type { Metadata } from 'next'
import { notFound } from "next/navigation";
import { findOrganization, getPublishedControls, getPublishedPolicies } from "./lib/data";
import ComplianceReport from './components/report';

type Props = {
    params: Promise<{ subdomain: string }>
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const subdomain = (await params).subdomain

    const organization = await findOrganization(subdomain);

    if (!organization) {
        return notFound();
    }

    return {
        title: `${organization.name} - Compliance Report`,
        description: `${organization.name} - Trust Portal`
    }
}

export default async function Page({ params }: Props) {
    const { subdomain } = await params;

    const organization = await findOrganization(subdomain);

    if (!organization) {
        return <div>Organization not found</div>;
    }

    const policies = await getPublishedPolicies(organization.id);
    const controls = await getPublishedControls(organization.id);

    return <ComplianceReport organization={organization} policies={policies} controls={controls} />;
}
