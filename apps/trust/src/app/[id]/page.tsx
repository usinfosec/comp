import { findOrganization, getPublishedControls, getPublishedPolicies } from "./lib/data";
import ComplianceReport from './components/report';
import { Metadata } from "next";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;

    const organization = await findOrganization(id);

    if (!organization) {
        return <div>Organization not found</div>;
    }

    const policies = await getPublishedPolicies(organization.id);
    const controls = await getPublishedControls(organization.id);

    return (
        <div>
            <div className="pb-6 p-6">
                <ComplianceReport organization={organization} policies={policies} controls={controls} />
            </div>
        </div>
    )
}

export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata> {
    const organization = await findOrganization(params.id);

    if (!organization) {
        return {
            title: "Organization not found",
        };
    }

    const title = `${organization.name} - Trust Center`;
    const description = `${organization.name} is using Comp AI to monitor their compliance against common cybersecurity frameworks like SOC 2, ISO 27001, and more.`;
    const url = `https://trust.trycomp.ai/${organization.id}`;

    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            type: "website",
            url,
            title,
            description,
            siteName: "Comp AI Trust Center",
            images: [
                {
                    url: 'https://trycomp.ai/og.png',
                    width: 1200,
                    height: 630,
                    alt: `${organization.name} Trust Center`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            site: "@trycompai",
            title,
            description,
            images: ['https://trycomp.ai/og.png'],
        },
    };
}