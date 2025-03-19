import { ApiKeysTable } from "@/components/tables/api-keys";
import { auth } from "@/auth";
import { getI18n } from "@/locales/server";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { redirect } from "next/navigation";

export default async function ApiKeysPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setStaticParamsLocale(locale);
	const t = await getI18n();

	const session = await auth();

	if (!session?.user.organizationId) {
		return redirect("/");
	}

	return (
		<div className="mx-auto max-w-7xl">
			<ApiKeysTable />
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
		title: t("settings.api_keys.title"),
	};
}
