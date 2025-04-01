import { cache } from "react";
import { auth } from "@bubba/auth";
import { getI18n } from "@/locales/server";
import { trainingVideos as trainingVideosData } from "@bubba/data";
import { db } from "@bubba/db";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { notFound, redirect } from "next/navigation";
import { EmployeeDetails } from "./components/EmployeeDetails";
import { headers } from "next/headers";

export default async function EmployeeDetailsPage({
	params,
}: {
	params: Promise<{ locale: string; employeeId: string }>;
}) {
	const { locale, employeeId } = await params;
	setStaticParamsLocale(locale);

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const organizationId = session?.session.activeOrganizationId;

	if (!organizationId) {
		redirect("/");
	}

	const policies = await getPoliciesTasks(employeeId);
	const employeeTrainingVideos = await getTrainingVideos(employeeId);
	const employee = await getEmployee(employeeId);

	// If employee doesn't exist, show 404 page
	if (!employee) {
		notFound();
	}

	return (
		<EmployeeDetails
			employeeId={employeeId}
			employee={employee}
			policies={policies}
			trainingVideos={employeeTrainingVideos}
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

const getEmployee = cache(async (employeeId: string) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const organizationId = session?.session.activeOrganizationId;

	if (!organizationId) {
		redirect("/");
	}

	const employee = await db.user.findFirst({
		where: {
			id: employeeId,
		},
	});

	return employee;
});

const getPoliciesTasks = cache(async (employeeId: string) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const organizationId = session?.session.activeOrganizationId;

	if (!organizationId) {
		redirect("/");
	}

	const policies = await db.policy.findMany({
		where: {
			organizationId: organizationId,
			isRequiredToSign: true,
		},
		orderBy: {
			name: "asc",
		},
	});

	return policies;
});

const getTrainingVideos = cache(async (employeeId: string) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const organizationId = session?.session.activeOrganizationId;

	if (!organizationId) {
		redirect("/");
	}

	const employeeTrainingVideos =
		await db.employeeTrainingVideoCompletion.findMany({
			where: {
				userId: employeeId,
			},
			orderBy: {
				videoId: "asc",
			},
		});

	// Map the db records to include the matching metadata from the training videos data
	return employeeTrainingVideos.map((dbVideo) => {
		// Find the training video metadata with the matching ID
		const videoMetadata = trainingVideosData.find(
			(metadataVideo) => metadataVideo.id === dbVideo.videoId,
		);

		// Return the combined object with the correct structure
		return {
			...dbVideo,
			metadata: videoMetadata,
		};
	});
});
