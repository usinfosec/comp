"use client";

import { Button } from "@comp/ui/button";
import { Textarea } from "@comp/ui/textarea";
import { Paperclip, SendHorizonal } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { createComment } from "../../actions/createComment";

interface TaskCommentFormProps {
	taskId: string;
}

export function TaskCommentForm({ taskId }: TaskCommentFormProps) {
	const [newComment, setNewComment] = useState("");

	const { execute: executeCreateComment, status: commentStatus } = useAction(
		createComment,
		{
			onSuccess: ({ data }) => {
				if (data?.success) {
					toast.success("Comment added!");
					setNewComment(""); // Clear input on success
				} else {
					toast.error(data?.error || "Failed to add comment.");
				}
			},
			onError: () => {
				toast.error(
					"An unexpected error occurred while adding the comment.",
				);
			},
		},
	);

	const handleCommentSubmit = () => {
		if (!newComment.trim()) return;
		executeCreateComment({ content: newComment, taskId: taskId });
	};

	return (
		<div className="border rounded p-3 space-y-2">
			<Textarea
				placeholder="Leave a comment..."
				className="min-h-[80px] border-none focus-visible:ring-0 shadow-none p-0"
				value={newComment}
				onChange={(e) => setNewComment(e.target.value)}
				disabled={commentStatus === "executing"}
			/>
			<div className="flex justify-between items-center">
				{/* Assuming attachment is future functionality */}
				<Button
					variant="ghost"
					size="icon"
					className="text-muted-foreground h-8 w-8"
					disabled={commentStatus === "executing"}
				>
					<Paperclip className="h-4 w-4" />
					<span className="sr-only">Attach file</span>
				</Button>
				<Button
					size="sm"
					onClick={handleCommentSubmit}
					disabled={
						!newComment.trim() || commentStatus === "executing"
					}
				>
					{commentStatus === "executing"
						? "Commenting..."
						: "Comment"}
					<SendHorizonal className="ml-2 h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
