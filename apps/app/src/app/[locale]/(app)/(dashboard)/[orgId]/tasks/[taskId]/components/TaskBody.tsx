"use client";

import { uploadFile } from "@/actions/files/upload-file";
import type { Attachment } from "@comp/db/types";
import { AttachmentEntityType } from "@comp/db/types";
import { Button } from "@comp/ui/button";
import { Input } from "@comp/ui/input";
import { Label } from "@comp/ui/label";
import { Textarea } from "@comp/ui/textarea";
import {
	Loader2,
	Paperclip,
	File as FileIcon,
	Trash2,
	Plus,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import React, { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { getTaskAttachmentUrl } from "@/app/[locale]/(app)/(dashboard)/[orgId]/tasks/actions/getTaskAttachmentUrl";
import type { ActionResponse } from "@/actions/types";
import { deleteTaskAttachment } from "@/app/[locale]/(app)/(dashboard)/[orgId]/tasks/actions/deleteTaskAttachment";
import { AttachmentItem } from "./AttachmentItem";
import clsx from "clsx";

interface TaskBodyProps {
	taskId: string;
	title: string;
	description: string;
	attachments: Attachment[];
	onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onDescriptionChange: (
		event: React.ChangeEvent<HTMLTextAreaElement>,
	) => void;
	disabled?: boolean;
	onAttachmentsChange?: () => void;
}

export function TaskBody({
	taskId,
	title,
	description,
	attachments = [],
	onTitleChange,
	onDescriptionChange,
	disabled,
	onAttachmentsChange,
}: TaskBodyProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [busyAttachmentId, setBusyAttachmentId] = useState<string | null>(
		null,
	);

	const { execute: executeUploadFile, status: uploadFileStatus } = useAction(
		uploadFile,
		{
			onSuccess: (args: {
				data?: ActionResponse<{ attachment: Attachment }>;
			}) => {
				if (args.data?.success && args.data.data?.attachment) {
					toast.success(
						`File "${args.data.data.attachment.name}" attached successfully!`,
					);
					onAttachmentsChange?.();
				} else {
					const errorMessage =
						typeof args.data?.error === "object"
							? args.data.error.message
							: args.data?.error;
					toast.error(
						String(
							errorMessage ||
								"Failed to process attachment after upload.",
						),
					);
				}
			},
			onError: (error) => {
				console.error("Upload file action error:", error);
				const message =
					error.error?.serverError ||
					Object.values(error.error?.validationErrors || {})
						.flat()
						.join(", ") ||
					"Failed to upload file.";
				toast.error(message);
			},
			onSettled: () => {
				resetState();
			},
		},
	);

	const { execute: executeGetDownloadUrl } = useAction(getTaskAttachmentUrl, {
		onExecute: (args: { input: { attachmentId: string } }) => {
			setBusyAttachmentId(args.input.attachmentId);
		},
		onSuccess: (args: {
			data?: ActionResponse<{ signedUrl: string }>;
			input: { attachmentId: string };
		}) => {
			const { data: result } = args;
			if (result?.success && result.data?.signedUrl) {
				window.open(result.data.signedUrl, "_blank");
			} else {
				const errorMessage =
					result && typeof result.error === "object"
						? result.error.message
						: result?.error;
				toast.error(
					String(errorMessage || "Could not get download URL."),
				);
			}
		},
		onError: (error) => {
			console.error("Get download URL error:", error);
			const message =
				error.error?.serverError ||
				Object.values(error.error?.validationErrors || {})
					.flat()
					.join(", ") ||
				"Failed to get download URL.";
			toast.error(message);
		},
		onSettled: () => {
			setBusyAttachmentId(null);
		},
	});

	const { execute: executeDeleteAttachment, status: deleteStatus } =
		useAction(deleteTaskAttachment, {
			onExecute: (args: { input: { attachmentId: string } }) => {
				setBusyAttachmentId(args.input.attachmentId);
			},
			onSuccess: (args: {
				data?: ActionResponse<{ deletedAttachmentId: string }>;
			}) => {
				if (args.data?.success) {
					toast.success("Attachment deleted successfully.");
					onAttachmentsChange?.();
				} else {
					const errorMessage =
						typeof args.data?.error === "object"
							? args.data.error.message
							: args.data?.error;
					toast.error(
						String(errorMessage || "Failed to delete attachment."),
					);
				}
			},
			onError: (error) => {
				console.error("Delete attachment error:", error);
				const message =
					error.error?.serverError ||
					Object.values(error.error?.validationErrors || {})
						.flat()
						.join(", ") ||
					"Failed to delete attachment.";
				toast.error(message);
			},
			onSettled: () => {
				setBusyAttachmentId(null);
			},
		});

	const resetState = () => {
		setIsUploading(false);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
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
					resetState();
					return;
				}
				executeUploadFile({
					fileName: file.name,
					fileType: file.type,
					fileData: base64Data,
					entityId: taskId,
					entityType: AttachmentEntityType.task,
				});
			};
			reader.onerror = () => {
				toast.error("Error reading file.");
				resetState();
			};
			reader.readAsDataURL(file);
		},
		[taskId, executeUploadFile, onAttachmentsChange],
	);

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	const handleDownloadClick = (attachmentId: string) => {
		executeGetDownloadUrl({ attachmentId });
	};

	const handleConfirmedDelete = (attachmentId: string) => {
		executeDeleteAttachment({ attachmentId });
	};

	const isActionLoading = uploadFileStatus === "executing";
	const isUploadingFile = isUploading || isActionLoading;

	return (
		<div className="flex flex-col gap-4">
			<Input
				value={title}
				onChange={onTitleChange}
				className="text-2xl font-semibold tracking-tight flex-shrink-0 h-auto p-0 border-none focus-visible:ring-0 shadow-none"
				placeholder="Task Title"
				disabled={disabled || isUploadingFile || !!busyAttachmentId}
			/>
			<Textarea
				value={description}
				onChange={onDescriptionChange}
				placeholder="Add description..."
				className="min-h-[80px] text-muted-foreground p-0 border-none focus-visible:ring-0 shadow-none text-md resize-none"
				disabled={disabled || isUploadingFile || !!busyAttachmentId}
			/>
			<input
				type="file"
				ref={fileInputRef}
				onChange={handleFileSelect}
				className="hidden"
				disabled={isUploadingFile || !!busyAttachmentId}
			/>
			<div className="space-y-3">
				<Label className="text-sm font-medium flex items-center justify-between">
					<span>Attachments</span>
					{attachments.length === 0 && (
						<Button
							variant="ghost"
							size="icon"
							onClick={triggerFileInput}
							disabled={isUploadingFile || !!busyAttachmentId}
							className="h-7 w-7 text-muted-foreground hover:text-foreground"
							aria-label="Add attachment"
						>
							{isUploadingFile ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Paperclip className="h-4 w-4" />
							)}
						</Button>
					)}
				</Label>

				{attachments.length > 0 ? (
					<div className="flex flex-wrap gap-2 pt-1">
						{attachments.map((attachment) => (
							<AttachmentItem
								key={attachment.id}
								attachment={attachment}
								isEditing={false}
								onRemove={handleConfirmedDelete}
								getUrlAction={getTaskAttachmentUrl}
							/>
						))}
						<button
							type="button"
							onClick={triggerFileInput}
							disabled={isUploadingFile || !!busyAttachmentId}
							className="w-24 h-24 bg-muted/50 border-2 border-dashed border-muted-foreground/30 rounded-sm flex items-center justify-center text-muted-foreground hover:bg-muted hover:border-muted-foreground/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							aria-label="Add attachment"
						>
							{isUploadingFile ? (
								<Loader2 className="h-5 w-5 animate-spin" />
							) : (
								<Plus className="h-6 w-6" />
							)}
						</button>
					</div>
				) : (
					!isUploadingFile && (
						<p className="text-sm text-muted-foreground italic pt-1">
							No attachments yet.
						</p>
					)
				)}
			</div>
		</div>
	);
}
