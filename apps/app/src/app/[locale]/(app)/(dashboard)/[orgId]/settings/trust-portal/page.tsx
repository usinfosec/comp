import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { cache } from "react";
import { getI18n } from "@/locales/server";
import { db } from "@comp/db";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { TrustPortalSwitch } from "./components/TrustPortalSwitch";
import { TrustPortalDomain } from "./components/TrustPortalDomain";

export default async function TrustPortalSettings({
	params,
}: {
	params: Promise<{ locale: string; orgId: string }>;
}) {
	const { locale, orgId } = await params;
	setStaticParamsLocale(locale);
	const t = await getI18n();

	const trustPortal = await getTrustPortal(orgId);

	return (
		<div className="mx-auto max-w-7xl space-y-4">
			<TrustPortalSwitch
				enabled={trustPortal?.enabled ?? false}
				slug={orgId}
				domain={trustPortal?.domain ?? ""}
				domainVerified={trustPortal?.domainVerified ?? false}
				orgId={orgId}
			/>
			<TrustPortalDomain
				domain={trustPortal?.domain ?? ""}
				domainVerified={trustPortal?.domainVerified ?? false}
				orgId={orgId}
			/>
		</div>
	);
}

const getTrustPortal = cache(async (orgId: string) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.session.activeOrganizationId) {
		return null;
	}

	const trustPortal = await db.trust.findUnique({
		where: {
			organizationId: orgId,
		},
	});

	return {
		enabled: trustPortal?.status === "published",
		domain: trustPortal?.domain,
		domainVerified: trustPortal?.domainVerified,
	};
});

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
