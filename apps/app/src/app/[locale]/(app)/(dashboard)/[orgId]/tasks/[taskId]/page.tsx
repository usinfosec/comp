import { auth } from "@/utils/auth";
import { db } from "@comp/db";
import type { Comment, Member, User, Attachment } from "@comp/db/types";
import { CommentEntityType, AttachmentEntityType } from "@comp/db/types";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SingleTask } from "./components/SingleTask";

export type CommentWithAuthor = Comment & {
	author: Member & {
		user: User;
	};
};

export default async function TaskPage({
	params,
}: {
	params: Promise<{ taskId: string; orgId: string; locale: string }>;
}) {
	const { taskId, orgId } = await params;
	const task = await getTask(taskId);
	const members = await getMembers(orgId);
	const comments = await getComments(taskId);
	const attachments = await getAttachments(taskId);

	if (!task) {
		redirect(`/${orgId}/tasks`);
	}

	return (
		<SingleTask
			task={task}
			members={members}
			comments={comments}
			attachments={attachments}
		/>
	);
}

const getTask = async (taskId: string) => {
	const task = await db.task.findUnique({
		where: {
			id: taskId,
		},
	});

	return task;
};

const getComments = async (taskId: string): Promise<CommentWithAuthor[]> => {
	const comments = await db.comment.findMany({
		where: {
			entityId: taskId,
			entityType: CommentEntityType.task,
		},
		include: {
			author: {
				include: {
					user: true,
				},
			},
		},
		orderBy: {
			createdAt: "asc",
		},
	});
	return comments as CommentWithAuthor[];
};

const getAttachments = async (taskId: string): Promise<Attachment[]> => {
	const attachments = await db.attachment.findMany({
		where: {
			entityId: taskId,
			entityType: AttachmentEntityType.task,
		},
		orderBy: {
			createdAt: "asc",
		},
	});
	return attachments;
};

const getMembers = async (orgId: string) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const activeOrgId = orgId ?? session?.session.activeOrganizationId;
	if (!activeOrgId) {
		console.warn(
			"Could not determine active organization ID in getMembers",
		);
		return [];
	}

	const members = await db.member.findMany({
		where: { organizationId: activeOrgId },
		include: { user: true },
	});
	return members;
};
