import PageWithBreadcrumb from "@/components/pages/PageWithBreadcrumb";
import { FindOutMoreForm } from "./components/FindOutMore";
import { getI18n } from "@/locales/server";
import { auth } from "@/utils/auth";
import { db } from "@comp/db";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { headers } from "next/headers";
import { cache } from "react";
import { notFound } from "next/navigation";
import { z } from "zod";

const findOutMoreSchema = z.object({
    frameworks: z.array(z.string()),
    role: z.string(),
    employeeCount: z.string(),
    lookingFor: z.string(),
    timeline: z.string(),
});

export default async function FindOutMore({
    params,
}: {
    params: Promise<{ locale: string, orgId: string }>;
}) {
    const { locale, orgId } = await params;
    setStaticParamsLocale(locale);

    const organization = await organizationDetails();

    if (!organization) {
        return notFound();
    }

    return (
        <PageWithBreadcrumb
            breadcrumbs={[
                {
                    label: "Implementation",
                    current: false,
                    href: `/${orgId}/implementation`,
                },
                { label: "Find out more about Comp AI", current: true },
            ]}
        >
            <FindOutMoreForm
                organizationName={organization?.name ?? ""}
                isBooked={organization?.callBooked ?? false}
                companyBookingDetails={organization?.companyBookingDetails as z.infer<typeof findOutMoreSchema> ?? {
                    frameworks: [],
                    role: "",
                    employeeCount: "",
                    lookingFor: "",
                    timeline: "",
                }}
            />
        </PageWithBreadcrumb>
    );
}


const organizationDetails = cache(async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.session.activeOrganizationId) {
        return null;
    }

    const organization = await db.organization.findUnique({
        where: { id: session?.session.activeOrganizationId },
        select: {
            name: true,
            id: true,
            website: true,
        },
    });

    const onboarding = await db.onboarding.findFirst({
        where: {
            organizationId: session?.session.activeOrganizationId,
        },
        select: {
            callBooked: true,
            companyBookingDetails: true,
        },
    });

    return {
        name: organization?.name,
        callBooked: onboarding?.callBooked,
        companyBookingDetails: onboarding?.companyBookingDetails as z.infer<typeof findOutMoreSchema>,
    };
});
