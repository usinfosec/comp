"use client";

import { Button } from "@comp/ui/button";
import { Textarea } from "@comp/ui/textarea";
import { ArrowUp, Loader2, Paperclip, Plus } from "lucide-react";
import { useAction } from "next-safe-action/hooks";

import { uploadFile } from "@/actions/files/upload-file";
import type { ActionResponse } from "@/actions/types";
import { authClient } from "@/utils/auth-client";
import {
	AttachmentEntityType,
	AttachmentType,
	type Attachment,
} from "@comp/db/types";
import { Label } from "@comp/ui/label";
import clsx from "clsx";
import React, { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { createComment } from "../../actions/createComment";
import { getCommentAttachmentUrl } from "../../actions/getCommentAttachmentUrl";
import { AttachmentItem } from "./AttachmentItem";

interface TaskCommentFormProps {
	taskId: string;
}

interface PendingAttachment {
	id: string;
	name: string;
	fileType: string;
	dataUrl: string;
}

// --- Helper to map MIME type (Copied from upload-file.ts) ---
function mapFileTypeToAttachmentType(fileType: string): AttachmentType {
	const type = fileType.split("/")[0];
	switch (type) {
		case "image":
			return AttachmentType.image;
		case "video":
			return AttachmentType.video;
		case "audio":
			return AttachmentType.audio;
		case "application":
			if (fileType === "application/pdf") return AttachmentType.document; // Specific PDF check
			return AttachmentType.document;
		default:
			return AttachmentType.other;
	}
}
// --- End Helper ---

export function TaskCommentForm({ taskId }: TaskCommentFormProps) {
	const session = authClient.useSession();
	const [newComment, setNewComment] = useState("");
	const [pendingAttachments, setPendingAttachments] = useState<
		PendingAttachment[]
	>([]);
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const pendingUploadDataUrlRef = useRef<string | null>(null);

	const { execute: executeUploadFile } = useAction(uploadFile, {
		onSuccess: (args: {
			data?: ActionResponse<{ attachment: Attachment }>;
			input: { fileType: string; fileName: string };
		}) => {
			const { data: result, input } = args;
			if (result?.success && result.data?.attachment) {
				const dataUrl = pendingUploadDataUrlRef.current;
				if (dataUrl) {
					setPendingAttachments((prev) => [
						...prev,
						{
							id: result.data?.attachment.id ?? "",
							name: result.data?.attachment.name ?? "",
							fileType: input.fileType,
							dataUrl: dataUrl,
						},
					]);
					pendingUploadDataUrlRef.current = null;
					toast.success(
						`File "${result.data?.attachment.name ?? "unknown"}" ready for attachment.`,
					);
				} else {
					console.error(
						"Could not find pending dataUrl after successful upload",
					);
					setPendingAttachments((prev) => [
						...prev,
						{
							id: result.data?.attachment.id ?? "",
							name: result.data?.attachment.name ?? "",
							fileType: input.fileType,
							dataUrl: "#error-no-preview",
						},
					]);
					toast.error(
						"Attachment added, but preview is unavailable.",
					);
				}
			} else {
				const errorMessage =
					result && typeof result.error === "object"
						? result.error.message
						: result?.error;
				toast.error(
					String(errorMessage || "Failed to stage attachment."),
				);
				pendingUploadDataUrlRef.current = null;
			}
		},
		onError: () => {
			pendingUploadDataUrlRef.current = null;
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
		console.log(
			"DEBUG: triggerFileInput called. Ref current:",
			fileInputRef.current,
		);
		fileInputRef.current?.click();
	};

	const handleFileSelect = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (!file) return;

			if (!file.type.startsWith("image/")) {
				toast.info("Only image previews are shown before submitting.");
			}

			setIsUploading(true);
			const reader = new FileReader();

			reader.onloadend = () => {
				const dataUrlResult = reader.result as string;
				const base64Data = dataUrlResult?.split(",")[1];

				if (!base64Data) {
					toast.error("Failed to read file data.");
					setIsUploading(false);
					return;
				}

				pendingUploadDataUrlRef.current = dataUrlResult;

				executeUploadFile({
					fileName: file.name,
					fileType: file.type,
					fileData: base64Data,
					entityId: taskId,
					entityType: AttachmentEntityType.comment,
				});
			};
			reader.onerror = () => {
				pendingUploadDataUrlRef.current = null;
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

	const isLoading =
		commentStatus === "executing" || isUploading || session.isPending;
	const user = session.data?.user;

	if (session.isPending) {
		return (
			<div className="border rounded p-3 space-y-3 animate-pulse">
				<div className="flex gap-3 items-start">
					<div className="h-8 w-8 rounded-full bg-muted flex-shrink-0" />
					<div className="flex-1 space-y-2">
						<div className="h-4 w-1/4 rounded bg-muted" />
						<div className="h-20 w-full rounded bg-muted" />
					</div>
				</div>
				<div className="h-8 w-full rounded bg-muted" />
			</div>
		);
	}

	return (
		<div className="border rounded p-4 bg-foreground/5">
			<div className="flex gap-3 items-start">
				<div className="flex-1 space-y-3">
					<input
						type="file"
						ref={fileInputRef}
						onChange={handleFileSelect}
						className="hidden"
						disabled={isLoading}
					/>
					<Textarea
						placeholder="Leave a comment..."
						className="border-none shadow-none p-0"
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
						disabled={isLoading}
					/>
					{pendingAttachments.length > 0 && (
						<div className="space-y-2 pt-1">
							<Label className="text-xs text-muted-foreground">
								Attachments
							</Label>
							<div className="flex flex-wrap gap-2">
								{pendingAttachments.map((pendingAtt) => {
									const partialAttachment = {
										id: pendingAtt.id,
										name: pendingAtt.name,
										type: mapFileTypeToAttachmentType(
											pendingAtt.fileType,
										),
										url: "#pending",
										entityId: taskId,
										entityType:
											AttachmentEntityType.comment,
										createdAt: new Date(),
										updatedAt: new Date(),
										organizationId: "pending",
									};
									return (
										<AttachmentItem
											key={partialAttachment.id}
											attachment={
												partialAttachment as any
											}
											isEditing={true}
											onRemove={
												handleRemovePendingAttachment
											}
											previewDataUrl={pendingAtt.dataUrl}
											getUrlAction={
												getCommentAttachmentUrl
											}
										/>
									);
								})}
								{pendingAttachments.length > 0 && (
									<button
										type="button"
										onClick={triggerFileInput}
										disabled={isLoading}
										className="w-24 h-24 bg-muted/50 border-2 border-dashed border-muted-foreground/30 rounded-sm flex items-center justify-center text-muted-foreground hover:bg-muted hover:border-muted-foreground/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
										aria-label="Add attachment"
									>
										{isUploading ? (
											<Loader2 className="h-5 w-5 animate-spin" />
										) : (
											<Plus className="h-6 w-6" />
										)}
									</button>
								)}
							</div>
						</div>
					)}

					<div
						className={clsx(
							"flex items-center pt-1",
							pendingAttachments.length === 0
								? "justify-between"
								: "justify-end",
						)}
					>
						{pendingAttachments.length === 0 && (
							<Button
								variant="ghost"
								size="icon"
								className="text-muted-foreground h-8 w-8 rounded-full"
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
						)}

						<Button
							size="sm"
							variant="outline"
							className="cursor-pointer rounded-full px-2 border-muted-foreground/50"
							onClick={handleCommentSubmit}
							disabled={
								isLoading ||
								(!newComment.trim() &&
									pendingAttachments.length === 0)
							}
						>
							{!isLoading && <ArrowUp className="h-4 w-4" />}
							{commentStatus === "executing" ||
								(isLoading && (
									<Loader2 className="h-4 w-4 animate-spin" />
								))}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
