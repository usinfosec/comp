import { auth } from "@/auth";
import { getI18n } from "@/locales/server";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { redirect } from "next/navigation";
import { TestDetails } from "./components/TestDetails";
import { db } from "@bubba/db";

export default async function TestDetailsPage({
	params,
}: {
	params: Promise<{ locale: string; testId: string }>;
}) {
	const { locale, testId } = await params;
	setStaticParamsLocale(locale);

	const session = await auth();
	const organizationId = session?.user.organizationId;

	if (!organizationId) {
		redirect("/");
	}

	const users = await getUsers(organizationId);

	return <TestDetails testId={testId} users={users} />;
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string; testId: string }>;
}): Promise<Metadata> {
	const { locale } = await params;

	setStaticParamsLocale(locale);
	const t = await getI18n();

	return {
		title: t("sub_pages.tests.test_details"),
	};
}

const getUsers = async (organizationId: string) => {
	const users = await db.user.findMany({
		where: { organizationId: organizationId },
	});

	return users;
};
