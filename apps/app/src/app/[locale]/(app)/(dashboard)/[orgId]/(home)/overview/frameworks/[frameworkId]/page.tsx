import { setStaticParamsLocale } from "next-international/server";
import { redirect } from "next/navigation";
import { FrameworkOverview } from "./components/FrameworkOverview";
import { FrameworkControls } from "./components/FrameworkControls";

interface PageProps {
	params: Promise<{
		frameworkId: string;
		locale: string;
	}>;
}

export default async function FrameworkPage({ params }: PageProps) {
	const { frameworkId, locale } = await params;
	setStaticParamsLocale(locale);

	if (!frameworkId) {
		redirect("/");
	}

	return (
		<div className="flex flex-col gap-6">
			<FrameworkOverview frameworkId={frameworkId} />
			<FrameworkControls frameworkId={frameworkId} />
		</div>
	);
}
