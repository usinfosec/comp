"use client";

import { uploadFile } from "@/actions/files/upload-file";
import type { Attachment } from "@comp/db/types";
import { AttachmentEntityType } from "@comp/db/types";
import { Button } from "@comp/ui/button";
import { Input } from "@comp/ui/input";
import { Label } from "@comp/ui/label";
import { Textarea } from "@comp/ui/textarea";
import { Loader2, Paperclip, File as FileIcon, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import React, { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { getTaskAttachmentUrl } from "@/app/[locale]/(app)/(dashboard)/[orgId]/tasks/actions/getTaskAttachmentUrl";
import type { ActionResponse } from "@/actions/types";
import { deleteTaskAttachment } from "@/app/[locale]/(app)/(dashboard)/[orgId]/tasks/actions/deleteTaskAttachment";

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

	const handleDeleteClick = (attachmentId: string) => {
		executeDeleteAttachment({ attachmentId });
	};

	const isActionLoading = uploadFileStatus === "executing";
	const combinedIsLoading = isUploading || isActionLoading;

	return (
		<div className="flex flex-col gap-4">
			<Input
				value={title}
				onChange={onTitleChange}
				className="text-2xl font-semibold tracking-tight flex-shrink-0 h-auto p-0 border-none focus-visible:ring-0 shadow-none"
				placeholder="Task Title"
				disabled={disabled || combinedIsLoading || !!busyAttachmentId}
			/>
			<Textarea
				value={description}
				onChange={onDescriptionChange}
				placeholder="Add description..."
				className="min-h-[80px] text-muted-foreground p-0 border-none focus-visible:ring-0 shadow-none text-md resize-none"
				disabled={disabled || combinedIsLoading || !!busyAttachmentId}
			/>
			<input
				type="file"
				ref={fileInputRef}
				onChange={handleFileSelect}
				className="hidden"
				disabled={combinedIsLoading || !!busyAttachmentId}
			/>
			<div className="space-y-3">
				<Label className="text-sm font-medium flex items-center justify-between">
					<span>Attachments</span>
					<Button
						variant="ghost"
						size="icon"
						onClick={triggerFileInput}
						disabled={combinedIsLoading || !!busyAttachmentId}
						className="h-7 w-7 text-muted-foreground hover:text-foreground"
						aria-label="Add attachment"
					>
						{isActionLoading ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Paperclip className="h-4 w-4" />
						)}
					</Button>
				</Label>

				{attachments.length > 0 ? (
					<ul className="space-y-2">
						{attachments.map((attachment) => {
							const isBusy = busyAttachmentId === attachment.id;
							const isDeleting =
								isBusy && deleteStatus === "executing";
							const isDownloading = isBusy && !isDeleting;
							return (
								<li
									key={attachment.id}
									className="flex items-center justify-between gap-2 text-sm border rounded px-3 py-1.5"
								>
									<button
										type="button"
										onClick={() =>
											handleDownloadClick(attachment.id)
										}
										disabled={
											combinedIsLoading ||
											!!busyAttachmentId
										}
										className="flex items-center gap-2 hover:underline truncate disabled:opacity-50 disabled:no-underline"
										title={`Download ${attachment.name}`}
									>
										{isDownloading ? (
											<Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />
										) : (
											<FileIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
										)}
										<span className="truncate">
											{attachment.name}
										</span>
									</button>
									<div className="flex items-center gap-1">
										<Button
											variant="ghost"
											size="icon"
											onClick={() =>
												handleDeleteClick(attachment.id)
											}
											disabled={
												combinedIsLoading ||
												!!busyAttachmentId
											}
											className="h-6 w-6 text-destructive/70 hover:text-destructive disabled:opacity-50"
											aria-label="Delete attachment"
										>
											{isDeleting ? (
												<Loader2 className="h-3 w-3 animate-spin" />
											) : (
												<Trash2 className="h-3 w-3" />
											)}
										</Button>
									</div>
								</li>
							);
						})}
					</ul>
				) : (
					!combinedIsLoading && (
						<p className="text-sm text-muted-foreground italic">
							No attachments yet.
						</p>
					)
				)}
			</div>
		</div>
	);
}
