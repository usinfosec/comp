"use client";

import { Button } from "@comp/ui/button";
import { Textarea } from "@comp/ui/textarea";
import {
	Loader2,
	Paperclip,
	SendHorizonal,
	File as FileIcon,
	Trash2,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import React, { useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import { createComment } from "../../actions/createComment";
import { uploadFile } from "@/actions/files/upload-file";
import { AttachmentEntityType } from "@comp/db/types";
import { Label } from "@comp/ui/label";

interface TaskCommentFormProps {
	taskId: string;
}

interface PendingAttachment {
	id: string;
	name: string;
}

export function TaskCommentForm({ taskId }: TaskCommentFormProps) {
	const [newComment, setNewComment] = useState("");
	const [pendingAttachments, setPendingAttachments] = useState<
		PendingAttachment[]
	>([]);
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { execute: executeUploadFile } = useAction(uploadFile, {
		onSuccess: ({ data }) => {
			if (data?.success && data.data?.attachment) {
				setPendingAttachments((prev) => [
					...prev,
					{
						id: data.data.attachment.id,
						name: data.data.attachment.name,
					},
				]);
				toast.success(
					`File "${data.data.attachment.name}" ready for attachment.`,
				);
			}
		},
		onError: () => {
			console.error("Upload file action error occurred.");
			toast.error("Failed to upload file. Please try again.");
		},
		onSettled: () => {
			setIsUploading(false);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		},
	});

	const { execute: executeCreateComment, status: commentStatus } = useAction(
		createComment,
		{
			onSuccess: ({ data }) => {
				if (data?.success) {
					toast.success("Comment added!");
					setNewComment("");
					setPendingAttachments([]);
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

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	const handleFileSelect = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (!file) return;

			setIsUploading(true);
			const reader = new FileReader();

			reader.onloadend = () => {
				const base64Data = (reader.result as string)?.split(",")[1];
				if (!base64Data) {
					toast.error("Failed to read file data.");
					setIsUploading(false);
					return;
				}
				executeUploadFile({
					fileName: file.name,
					fileType: file.type,
					fileData: base64Data,
					entityId: taskId,
					entityType: AttachmentEntityType.comment,
				});
			};
			reader.onerror = () => {
				toast.error("Error reading file.");
				setIsUploading(false);
			};
			reader.readAsDataURL(file);
		},
		[taskId, executeUploadFile],
	);

	const handleRemovePendingAttachment = (attachmentIdToRemove: string) => {
		setPendingAttachments((prev) =>
			prev.filter((att) => att.id !== attachmentIdToRemove),
		);
		toast.info("Attachment removed from comment draft.");
	};

	const handleCommentSubmit = () => {
		if (!newComment.trim() && pendingAttachments.length === 0) return;
		executeCreateComment({
			content: newComment,
			taskId: taskId,
			attachmentIds: pendingAttachments.map((att) => att.id),
		});
	};

	const isLoading = commentStatus === "executing" || isUploading;

	return (
		<div className="border rounded p-3 space-y-3">
			<input
				type="file"
				ref={fileInputRef}
				onChange={handleFileSelect}
				className="hidden"
				disabled={isLoading}
			/>

			<Textarea
				placeholder="Leave a comment..."
				className="min-h-[80px] border-none focus-visible:ring-0 shadow-none p-0"
				value={newComment}
				onChange={(e) => setNewComment(e.target.value)}
				disabled={isLoading}
			/>

			{pendingAttachments.length > 0 && (
				<div className="space-y-2">
					<Label className="text-xs text-muted-foreground">
						Attachments
					</Label>
					<ul className="space-y-1">
						{pendingAttachments.map((attachment) => (
							<li
								key={attachment.id}
								className="flex items-center justify-between gap-2 text-sm border rounded px-3 py-1.5 bg-muted/50"
							>
								<div className="flex items-center gap-2 truncate">
									<FileIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
									<span
										className="truncate"
										title={attachment.name}
									>
										{attachment.name}
									</span>
								</div>
								<Button
									variant="ghost"
									size="icon"
									onClick={() =>
										handleRemovePendingAttachment(
											attachment.id,
										)
									}
									disabled={isLoading}
									className="h-6 w-6 text-destructive/70 hover:text-destructive disabled:opacity-50 flex-shrink-0"
									aria-label="Remove attachment"
								>
									<Trash2 className="h-3 w-3" />
								</Button>
							</li>
						))}
					</ul>
				</div>
			)}

			<div className="flex justify-between items-center pt-1">
				<Button
					variant="ghost"
					size="icon"
					className="text-muted-foreground h-8 w-8"
					onClick={triggerFileInput}
					disabled={isLoading}
					aria-label="Add attachment"
				>
					{isUploading ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<Paperclip className="h-4 w-4" />
					)}

					<span className="sr-only">Attach file</span>
				</Button>
				<Button
					size="sm"
					onClick={handleCommentSubmit}
					disabled={
						isLoading ||
						(!newComment.trim() && pendingAttachments.length === 0)
					}
				>
					{commentStatus === "executing"
						? "Commenting..."
						: "Comment"}
					{!isLoading && <SendHorizonal className="ml-2 h-4 w-4" />}
					{commentStatus === "executing" && (
						<Loader2 className="ml-2 h-4 w-4 animate-spin" />
					)}
				</Button>
			</div>
		</div>
	);
}
