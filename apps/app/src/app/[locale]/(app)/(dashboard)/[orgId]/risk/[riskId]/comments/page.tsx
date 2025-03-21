import { auth } from "@/auth";
import { RiskComments } from "@/components/risks/risk-comments";
import { getI18n } from "@/locales/server";
import { db } from "@bubba/db";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { redirect } from "next/navigation";

interface PageProps {
	params: Promise<{ riskId: string }>;
}

export default async function RiskPage({ params }: PageProps) {
	const session = await auth();
	const { riskId } = await params;

	if (!session) {
		redirect("/auth");
	}

	if (!session.user.organizationId || !riskId) {
		redirect("/");
	}

	const risk = await getRisk(riskId, session.user.organizationId);

	if (!risk) {
		redirect(`/${session.user.organizationId}/risk`);
	}

	const users = await getUsers(session.user.organizationId);

	return (
		<div className="flex flex-col gap-4">
			<RiskComments risk={risk} users={users} />
		</div>
	);
}

const getRisk = async (riskId: string, organizationId: string) => {
	const risk = await db.risk.findUnique({
		where: {
			id: riskId,
			organizationId: organizationId,
		},
		include: {
			owner: true,
			comments: {
				orderBy: {
					createdAt: "desc",
				},
			},
		},
	});

	return risk;
};

const getUsers = async (organizationId: string) => {
	const users = await db.user.findMany({
		where: { organizationId: organizationId },
	});

	return users;
};

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	setStaticParamsLocale(locale);
	const t = await getI18n();

	return {
		title: t("risk.comments"),
	};
}
