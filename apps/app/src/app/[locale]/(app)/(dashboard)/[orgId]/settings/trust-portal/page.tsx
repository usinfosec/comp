import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { cache } from "react";

import { ApiKeysTable } from "@/components/tables/api-keys";
import { getI18n } from "@/locales/server";
import { db } from "@comp/db";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { TrustPortalSwitch } from "./components/TrustPortalSwitch";

export default async function TrustPortalSettings({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setStaticParamsLocale(locale);
	const t = await getI18n();

	const trustPortal = await getTrustPortal();

	return (
		<div className="mx-auto max-w-7xl">
			<TrustPortalSwitch enabled={trustPortal?.enabled ?? false} slug={trustPortal?.slug ?? ""} />
		</div>
	);
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	setStaticParamsLocale(locale);
	const t = await getI18n();

	return {
		title: "Trust Portal",
	};
}

const getTrustPortal = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.session.activeOrganizationId) {
		return null;
	}

	const slug = await db.organization.findUnique({
		where: {
			id: session.session.activeOrganizationId,
		},
		select: {
			slug: true,
		},
	});

	const trustPortal = await db.trust.findUnique({
		where: {
			organizationId: session.session.activeOrganizationId,
			status: "published",
		},
	});

	if (!trustPortal) {
		return {
			enabled: false,
			slug: slug?.slug,
		};
	}

	return {
		enabled: true,
		slug: slug?.slug,
	};
};