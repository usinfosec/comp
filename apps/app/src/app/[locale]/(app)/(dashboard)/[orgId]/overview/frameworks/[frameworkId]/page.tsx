import { auth } from "@/auth";
import { setStaticParamsLocale } from "next-international/server";
import { redirect } from "next/navigation";
import { FrameworkControls } from "./components/FrameworkControls";
import { FrameworkOverview } from "./components/FrameworkOverview";
import { getFramework } from "./data/getFramework";
import { getFrameworkCategories } from "./data/getFrameworkCategories";
interface PageProps {
	params: Promise<{
		frameworkId: string;
		locale: string;
	}>;
}

export default async function FrameworkPage({ params }: PageProps) {
	const { frameworkId, locale } = await params;
	setStaticParamsLocale(locale);

	const session = await auth();

	if (!session) {
		redirect("/");
	}

	const organizationId = session.user.organizationId;

	if (!frameworkId) {
		redirect("/");
	}

	if (!organizationId) {
		redirect("/");
	}

	const organizationCategories = await getFrameworkCategories(
		frameworkId,
		organizationId,
	);

	const organizationFramework = await getFramework(frameworkId, organizationId);

	if (!organizationFramework) {
		redirect("/");
	}

	return (
		<div className="flex flex-col gap-6">
			<FrameworkOverview
				organizationFramework={organizationFramework}
				organizationCategories={organizationCategories}
			/>
			<FrameworkControls
				organizationCategories={organizationCategories}
				frameworkId={frameworkId}
			/>
		</div>
	);
}
