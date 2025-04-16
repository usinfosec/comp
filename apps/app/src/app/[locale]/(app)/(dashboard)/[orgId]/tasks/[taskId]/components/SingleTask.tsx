"use client"; // Assuming interaction is needed, adjust if fetching data server-side

import { Member, Task, User } from "@comp/db/types";
import { useAction } from "next-safe-action/hooks";
import { useMemo } from "react";
import { toast } from "sonner";
import { updateTask } from "../../actions/updateTask";
import { TaskMainContent } from "./TaskMainContent";
import { TaskPropertiesSidebar } from "./TaskPropertiesSidebar";

interface SingleTaskProps {
	task: Task;
	members?: (Member & { user: User })[];
}

export function SingleTask({ task, members }: SingleTaskProps) {
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

	// TODO: Fetch/pass real activities data
	const activities = [
		{ type: "creation", user: "User A", time: "2d ago" },
		{
			type: "comment",
			user: "User B",
			text: "This is the first comment.",
			time: "1d ago",
		},
		{ type: "label", user: "User A", label: "Bug", time: "1h ago" },
		{
			type: "comment",
			user: "User B",
			text: "This is the first comment.",
			time: "1d ago",
		},
		{
			type: "comment",
			user: "User B",
			text: "This is the first comment.",
			time: "1d ago",
		},
		{
			type: "comment",
			user: "User B",
			text: "This is the first comment.",
			time: "1d ago",
		},
		{
			type: "comment",
			user: "User B",
			text: "This is the first comment.",
			time: "1d ago",
		},
		{
			type: "comment",
			user: "User B",
			text: "This is the first comment.",
			time: "1d ago",
		},
		{
			type: "comment",
			user: "User B",
			text: "This is the first comment.",
			time: "1d ago",
		},
		{
			type: "comment",
			user: "User B",
			text: "This is the first comment.",
			time: "1d ago",
		},
		{
			type: "comment",
			user: "User B",
			text: "This is the first comment.",
			time: "1d ago",
		},
		{
			type: "comment",
			user: "User B",
			text: "This is the first comment.",
			time: "1d ago",
		},
		{
			type: "comment",
			user: "User B",
			text: "This is the first comment.",
			time: "1d ago",
		},
		{
			type: "comment",
			user: "User B",
			text: "This is the first comment.",
			time: "1d ago",
		},
		{
			type: "comment",
			user: "User B",
			text: "This is the first comment.",
			time: "1d ago",
		},
		{
			type: "comment",
			user: "User B",
			text: "This is the first comment.",
			time: "1d ago",
		},
		{
			type: "comment",
			user: "User B",
			text: "This is the first comment.",
			time: "1d ago",
		},
		{
			type: "comment",
			user: "User B",
			text: "This is the first comment.",
			time: "1d ago",
		},
		{
			type: "comment",
			user: "User B",
			text: "This is the first comment.",
			time: "1d ago",
		},
		{
			type: "comment",
			user: "User B",
			text: "This is the first comment.",
			time: "1d ago",
		},
		{
			type: "comment",
			user: "User B",
			text: "This is the first comment.",
			time: "1d ago",
		},
	];

	return (
		<div className="flex flex-col md:flex-row gap-8 overflow-hidden">
			<TaskMainContent task={task} activities={activities} />
			<TaskPropertiesSidebar
				task={task}
				members={members}
				assignedMember={assignedMember}
				handleUpdateTask={handleUpdateTask}
			/>
		</div>
	);
}
