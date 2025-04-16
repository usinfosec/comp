"use client";

import { Button } from "@comp/ui/button";
import { Input } from "@comp/ui/input";
import { Label } from "@comp/ui/label";
import { Textarea } from "@comp/ui/textarea";
import { Loader2, Paperclip, File as FileIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import React, { useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import { uploadFile } from "@/actions/files/upload-file";
import type { ActionResponse } from "@/actions/types";
import type { Attachment } from "@comp/db/types";
import { AttachmentEntityType } from "@comp/db/types";

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
	onUploadSuccess?: () => void;
}

export function TaskBody({
	taskId,
	title,
	description,
	attachments = [],
	onTitleChange,
	onDescriptionChange,
	disabled,
	onUploadSuccess,
}: TaskBodyProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isLoading, setIsLoading] = useState(false);

	const { execute: executeUploadFile, status: uploadFileStatus } = useAction(
		uploadFile,
		{
			onSuccess: () => {
				toast.success("File uploaded successfully!");
				resetState();
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
				resetState();
			},
		},
	);

	const resetState = () => {
		setIsLoading(false);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleFileSelect = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (!file) {
				return;
			}

			setIsLoading(true);

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
		[taskId, executeUploadFile, onUploadSuccess],
	);

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	const isActionLoading = uploadFileStatus === "executing";
	const combinedIsLoading = isLoading || isActionLoading;

	return (
		<div className="flex flex-col gap-4">
			<Input
				value={title}
				onChange={onTitleChange}
				className="text-2xl font-semibold tracking-tight flex-shrink-0 h-auto p-0 border-none focus-visible:ring-0 shadow-none"
				placeholder="Task Title"
				disabled={disabled || combinedIsLoading}
			/>
			<Textarea
				value={description}
				onChange={onDescriptionChange}
				placeholder="Add description..."
				className="min-h-[80px] text-muted-foreground p-0 border-none focus-visible:ring-0 shadow-none text-md resize-none"
				disabled={disabled || combinedIsLoading}
			/>
			<input
				type="file"
				ref={fileInputRef}
				onChange={handleFileSelect}
				className="hidden"
				disabled={combinedIsLoading}
			/>
			<div className="space-y-3">
				<Label className="text-sm font-medium flex items-center justify-between">
					<span>Attachments</span>
					<Button
						variant="ghost"
						size="icon"
						onClick={triggerFileInput}
						disabled={combinedIsLoading}
						className="h-7 w-7 text-muted-foreground hover:text-foreground"
						aria-label="Add attachment"
					>
						{combinedIsLoading ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Paperclip className="h-4 w-4" />
						)}
					</Button>
				</Label>

				{attachments.length > 0 ? (
					<ul className="space-y-2">
						{attachments.map((attachment) => (
							<li
								key={attachment.id}
								className="flex items-center justify-between gap-2 text-sm border rounded px-3 py-1.5"
							>
								<a
									href={attachment.url}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2 hover:underline truncate"
								>
									<FileIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
									<span className="truncate">
										{attachment.name}
									</span>
								</a>
							</li>
						))}
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
