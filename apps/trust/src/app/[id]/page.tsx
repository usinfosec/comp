import { findOrganization, getPublishedControls, getPublishedPolicies } from "./lib/data";
import ComplianceReport from './components/report';
import { Metadata } from "next";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;

    const organization = await findOrganization(id);

    if (!organization) {
        return <div>
            <div className="pb-6 p-6">
                <div className="flex flex-col items-center justify-center h-screen">
                    <h1 className="text-2xl font-bold">Trust Portal Not Published</h1>
                    <p className="text-sm text-muted-foreground">Please publish your trust portal and try again.</p>
                </div>
            </div>
        </div>
    }

    const policies = await getPublishedPolicies(organization.id);
    const controls = await getPublishedControls(organization.id);

    return (
        <div>
            <div className="pb-6 p-6">
                <ComplianceReport organization={organization} policies={policies ?? []} controls={controls ?? []} />
            </div>
        </div>
    )
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const id = (await params).id;
    const organization = await findOrganization(id);

    if (!organization) {
        return {
            title: "Trust Portal Not Published",
        };
    }

    const title = `${organization.name} - Trust Center`;
    const description = `${organization.name} is using Comp AI to monitor their compliance against common cybersecurity frameworks like SOC 2, ISO 27001, and more.`;
    const url = `https://trycomp.ai/trust/${organization.id}`;

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