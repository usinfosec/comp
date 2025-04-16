"use client"; // Assuming interaction is needed, adjust if fetching data server-side

// Import the CommentWithAuthor type (adjust path if needed, maybe create a shared types file)
import type { CommentWithAuthor } from "../page";
import type { Attachment, Member, Task, User } from "@comp/db/types";
import { useAction } from "next-safe-action/hooks";
import { useMemo } from "react";
import { toast } from "sonner";
import { updateTask } from "../../actions/updateTask";
import { TaskMainContent } from "./TaskMainContent";
import { TaskPropertiesSidebar } from "./TaskPropertiesSidebar";
import { TaskBody } from "./TaskBody";

interface SingleTaskProps {
	task: Task & { fileUrls?: string[] };
	members?: (Member & { user: User })[];
	comments: CommentWithAuthor[];
	attachments: Attachment[];
}

export function SingleTask({
	task,
	members,
	comments,
	attachments,
}: SingleTaskProps) {
	// Destructure comments
	// Find the assigned member from the provided list (if available)
	const assignedMember = useMemo(() => {
		if (!task.assigneeId || !members) return null;
		return members.find((m) => m.id === task.assigneeId);
	}, [task.assigneeId, members]);

	// Setup action for updating task
	const { execute } = useAction(updateTask, {
		onSuccess: () => {
			toast.success("Task updated successfully");
		},
		onError: () => {
			toast.error("Failed to update task");
		},
	});

	// Handler for updating task properties via sidebar selectors
	const handleUpdateTask = (
		data: Partial<
			Pick<Task, "status" | "assigneeId" | "frequency" | "department">
		>,
	) => {
		const updatePayload: Partial<
			Pick<Task, "status" | "assigneeId" | "frequency" | "department">
		> = {};

		if (data.status !== undefined) {
			updatePayload.status = data.status;
		}
		if (data.department !== undefined) {
			updatePayload.department = data.department;
		}
		if (data.assigneeId !== undefined) {
			updatePayload.assigneeId =
				data.assigneeId === null ? undefined : data.assigneeId;
		}
		if (Object.prototype.hasOwnProperty.call(data, "frequency")) {
			updatePayload.frequency = data.frequency;
		}

		if (Object.keys(updatePayload).length > 0) {
			execute({ id: task.id, ...(updatePayload as any) });
		}
	};

	return (
		<div className="flex flex-col lg:flex-row overflow-hidden px-4 py-6 lg:p-0 h-full">
			{/* Pass task and attachments to TaskMainContent */}
			<TaskMainContent
				task={task}
				comments={comments}
				attachments={attachments}
			/>

			{/* Render TaskPropertiesSidebar directly as a flex child */}
			<TaskPropertiesSidebar
				task={task}
				members={members}
				assignedMember={assignedMember}
				handleUpdateTask={handleUpdateTask}
			/>
		</div>
	);
}
