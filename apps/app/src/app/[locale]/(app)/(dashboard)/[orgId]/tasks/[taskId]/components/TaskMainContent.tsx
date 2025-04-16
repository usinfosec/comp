"use client";

import type { Task, Attachment } from "@comp/db/types";
import { Separator } from "@comp/ui/separator";
import { useAction } from "next-safe-action/hooks";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { updateTask } from "../../actions/updateTask";
import type { CommentWithAuthor } from "../page";
import { TaskCommentForm } from "./TaskCommentForm";
import { TaskCommentList } from "./TaskCommentList";
import { TaskBody } from "./TaskBody";

interface TaskMainContentProps {
	task: Task & { fileUrls?: string[] };
	comments: CommentWithAuthor[];
	attachments: Attachment[];
}

export function TaskMainContent({
	task,
	comments,
	attachments,
}: TaskMainContentProps) {
	const [title, setTitle] = useState(task.title);
	const [description, setDescription] = useState(task.description ?? "");

	const { execute: executeUpdateTask, status: updateStatus } = useAction(
		updateTask,
		{
			onSuccess: ({ data }) => {
				if (data?.success) {
					toast.success("Task updated successfully!");
				} else {
					toast.error(data?.error || "Failed to update task.");
				}
			},
			onError: () => {
				toast.error(
					"An unexpected error occurred while updating the task.",
				);
			},
		},
	);

	const debouncedUpdateTask = useDebouncedCallback(
		(field: "title" | "description", value: string) => {
			executeUpdateTask({ id: task.id, [field]: value });
		},
		500,
	);

	useEffect(() => {
		setTitle(task.title);
		setDescription(task.description ?? "");
	}, [task.title, task.description]);

	const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newTitle = event.target.value;
		setTitle(newTitle);
		debouncedUpdateTask("title", newTitle);
	};

	const handleDescriptionChange = (
		event: React.ChangeEvent<HTMLTextAreaElement>,
	) => {
		const newDescription = event.target.value;
		setDescription(newDescription);
		debouncedUpdateTask("description", newDescription);
	};

	return (
		<div className="flex-1 flex flex-col gap-4 lg:max-w-3xl lg:mx-auto lg:py-8">
			<TaskBody
				taskId={task.id}
				title={title}
				description={description}
				attachments={attachments}
				onTitleChange={handleTitleChange}
				onDescriptionChange={handleDescriptionChange}
				disabled={updateStatus === "executing"}
			/>

			<Separator />

			{/* Comment Section */}
			<div className="space-y-6">
				<h3 className="text-lg font-medium">Comments</h3>
				<TaskCommentForm taskId={task.id} />
				<TaskCommentList comments={comments} />
			</div>
		</div>
	);
}
