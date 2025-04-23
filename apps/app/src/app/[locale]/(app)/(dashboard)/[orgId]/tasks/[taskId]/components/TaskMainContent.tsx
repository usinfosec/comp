"use client";

import type { Attachment, Task } from "@comp/db/types";
import { Separator } from "@comp/ui/separator";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { updateTask } from "../../actions/updateTask";
import type { CommentWithAuthor } from "../page";
import { TaskBody } from "./TaskBody";
import { TaskCommentForm } from "./TaskCommentForm";
import { TaskCommentList } from "./TaskCommentList";

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

	const debouncedUpdateTask = useDebouncedCallback(
		(field: "title" | "description", value: string) => {
			updateTask({ id: task.id, [field]: value });
		},
		1000,
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
			/>

			<div className="py-4">
				<Separator />
			</div>

			{/* Comment Section */}
			<div className="space-y-4">
				<h3 className="text-lg font-medium">Comments</h3>
				<TaskCommentForm taskId={task.id} />
				<TaskCommentList comments={comments} />
			</div>
		</div>
	);
}
