import { getI18n } from "@/locales/server";
import { auth } from "@/utils/auth";
import { db } from "@comp/db";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { headers } from "next/headers";
import { cache } from "react";
import { ContextList } from "./components/context-list";

export default async function ContextHubSettings({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setStaticParamsLocale(locale);

    const entries = await getContextEntries();

    return (
        <ContextList entries={entries} locale={locale} />
    );
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    setStaticParamsLocale(locale);

    return {
        title: "Context Hub",
    };
}

const getContextEntries = cache(async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.session.activeOrganizationId) {
        return [];
    }

    const entries = await db.context.findMany({
        where: { organizationId: session.session.activeOrganizationId },
        orderBy: { createdAt: "desc" },
    });

    return entries;
});