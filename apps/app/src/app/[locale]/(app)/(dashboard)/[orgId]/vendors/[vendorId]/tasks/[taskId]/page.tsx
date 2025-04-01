"use server";

import { getI18n } from "@/locales/server";
import { auth } from "@bubba/auth";
import { db } from "@bubba/db";
import { setStaticParamsLocale } from "next-international/server";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import SecondaryFields from "./components/secondary-fields/secondary-fields";
import Title from "./components/title/title";

interface PageProps {
	params: Promise<{
		locale: string;
		orgId: string;
		vendorId: string;
		taskId: string;
	}>;
}

export default async function TaskPage({ params }: PageProps) {
	const { locale, orgId, vendorId, taskId } = await params;
	setStaticParamsLocale(locale);
	const t = await getI18n();

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/auth/signin");
	}

	// Fetch the task
	const task = await db.task.findUnique({
		where: {
			id: taskId,
			organizationId: orgId,
		},
		include: {
			user: {
				select: {
					name: true,
					image: true,
				},
			},
		},
	});

	if (!task) {
		notFound();
	}

	// Fetch organization users
	const users = await db.member.findMany({
		where: {
			organizationId: orgId,
		},
		select: {
			user: {
				select: {
					id: true,
					name: true,
					image: true,
				},
			},
		},
	});

	const formattedUsers = users.map((member) => ({
		id: member.user.id,
		name: member.user.name,
		image: member.user.image,
	}));

	return (
		<div className="space-y-8">
			<Title task={task} />
			<SecondaryFields task={task} users={formattedUsers} />
		</div>
	);
}
