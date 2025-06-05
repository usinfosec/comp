import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { TeamMembers } from "./components/TeamMembers";

export default async function Members({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setStaticParamsLocale(locale);

	return (
		<div className="space-y-4 sm:space-y-4">
			<TeamMembers />
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
	return {
		title: "People",
	};
}
