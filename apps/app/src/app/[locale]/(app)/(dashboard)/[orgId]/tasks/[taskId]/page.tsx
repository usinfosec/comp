import { auth } from "@/utils/auth";
import { db } from "@comp/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SingleTask } from "./components/SingleTask";

export default async function TaskPage({
	params,
}: {
	params: Promise<{ taskId: string }>;
}) {
	const { taskId } = await params;
	const task = await getTask(taskId);
	const members = await getMembers();

	if (!task) {
		redirect("/tasks");
	}

	return <SingleTask task={task} members={members} />;
}

const getTask = async (taskId: string) => {
	const task = await db.task.findUnique({
		where: {
			id: taskId,
		},
	});

	return task;
};

const getMembers = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.session.activeOrganizationId) {
		return [];
	}

	const members = await db.member.findMany({
		where: {
			organizationId: session.session.activeOrganizationId,
		},
		include: {
			user: true,
		},
	});

	return members;
};
