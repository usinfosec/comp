import { auth } from "@/auth";
import { getI18n } from "@/locales/server";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { redirect } from "next/navigation";
import { EmployeeDetails } from "./components/EmployeeDetails";
import { db } from "@bubba/db";

export default async function EmployeeDetailsPage({
	params,
}: {
	params: Promise<{ locale: string; employeeId: string }>;
}) {
	const { locale, employeeId } = await params;
	setStaticParamsLocale(locale);

	const session = await auth();
	const organizationId = session?.user.organizationId;

	if (!organizationId) {
		redirect("/");
	}

	const policies = await getPoliciesTasks(employeeId);
	const trainingVideos = await getTrainingVideos(employeeId);
	const portalEmployeeId = await getPortalEmployeeId(employeeId);

	return (
		<EmployeeDetails
			employeeId={employeeId}
			portalEmployeeId={portalEmployeeId?.id ?? ""}
			policies={policies}
			trainingVideos={trainingVideos}
		/>
	);
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string; employeeId: string }>;
}): Promise<Metadata> {
	const { locale } = await params;

	setStaticParamsLocale(locale);
	const t = await getI18n();

	return {
		title: t("people.details.title"),
	};
}

const getPortalEmployeeId = async (employeeId: string) => {
	const session = await auth();
	const organizationId = session?.user.organizationId;

	if (!organizationId) {
		redirect("/");
	}

	const employee = await db.employee.findFirst({
		where: {
			id: employeeId,
		},
	});

	const portalEmployeeId = await db.portalUser.findFirst({
		where: {
			email: employee?.email,
		},
	});

	return portalEmployeeId;
};

const getPoliciesTasks = async (employeeId: string) => {
	const session = await auth();
	const organizationId = session?.user.organizationId;

	if (!organizationId) {
		redirect("/");
	}

	const policies = await db.organizationPolicy.findMany({
		where: {
			organizationId: organizationId,
			isRequiredToSign: true,
		},
		orderBy: {
			policy: {
				name: "asc",
			},
		},
		include: {
			policy: true,
		},
	});

	return policies;
};

const getTrainingVideos = async (employeeId: string) => {
	const session = await auth();
	const organizationId = session?.user.organizationId;

	if (!organizationId) {
		redirect("/");
	}

	const trainingVideos = await db.organizationTrainingVideos.findMany({
		where: {
			organizationId: organizationId,
		},
		orderBy: {
			trainingVideo: {
				title: "asc",
			},
		},
		include: {
			trainingVideo: true,
		},
	});

	return trainingVideos;
};
