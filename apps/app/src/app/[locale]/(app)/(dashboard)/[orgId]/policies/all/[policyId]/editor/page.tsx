import { getI18n } from "@/locales/server";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { PolicyDetails } from "./components/PolicyDetails";

export default async function PolicyEditor({
	params,
}: {
	params: Promise<{ locale: string; policyId: string }>;
}) {
	const { locale, policyId } = await params;
	setStaticParamsLocale(locale);

	return <PolicyDetails policyId={policyId} />;
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string; policyId: string }>;
}): Promise<Metadata> {
	const { locale } = await params;

	setStaticParamsLocale(locale);
	const t = await getI18n();

	return {
		title: t("sub_pages.policies.policy_details"),
	};
}
