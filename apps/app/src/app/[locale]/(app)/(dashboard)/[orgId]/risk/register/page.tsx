import { RiskRegisterTable } from "./RiskRegisterTable";
import type { Metadata } from "next";
import { getI18n } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";

export default function RiskRegisterPage() {
	return <RiskRegisterTable />;
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
		title: t("risk.register"),
	};
}
