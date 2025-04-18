"use client";

import type { Attachment } from "@comp/db/types";
import { AttachmentType } from "@comp/db/types";
import { Button } from "@comp/ui/button";
import { getCommentAttachmentUrl } from "../../actions/getCommentAttachmentUrl";
import { useAction } from "next-safe-action/hooks";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { File as FileIcon, Trash2, Loader2, ImageOff } from "lucide-react";
import { getIconForAttachmentType } from "./commentUtils"; // Import helper
import type { ActionResponse } from "@/actions/types";

interface AttachmentItemProps {
	attachment: Attachment;
	isEditing: boolean;
	onRemove: (attachmentId: string) => void;
}

export function AttachmentItem({
	attachment,
	isEditing,
	onRemove,
}: AttachmentItemProps) {
	// State variables
	const [isBusyPreview, setIsBusyPreview] = useState(false);
	const [isBusyDownload, setIsBusyDownload] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [previewError, setPreviewError] = useState(false);

	// Action hooks
	const { execute: executeGetPreviewUrl } = useAction(
		getCommentAttachmentUrl,
		{
			onExecute: () => {
				setIsBusyPreview(true);
				setPreviewError(false);
			},
			onSuccess: ({ data }) => {
				if (data?.success && data.data?.signedUrl)
					setPreviewUrl(data.data.signedUrl);
				else {
					toast.error(
						String(data?.error || "Could not load preview."),
					);
					setPreviewError(true);
				}
			},
			onError: (error) => {
				console.error("Get preview URL error:", error);
				toast.error("Could not load preview.");
				setPreviewError(true);
			},
			onSettled: () => {
				setIsBusyPreview(false);
			},
		},
	);

	const { execute: executeGetDownloadUrl, status: downloadStatus } =
		useAction(getCommentAttachmentUrl, {
			onExecute: () => setIsBusyDownload(true),
			onSuccess: ({ data }) => {
				if (data?.success && data.data?.signedUrl)
					window.open(data.data.signedUrl, "_blank");
				else
					toast.error(
						String(data?.error || "Could not get download URL."),
					);
			},
			onError: (error) => {
				console.error("Get download URL error:", error);
				toast.error("Could not get download URL. Please try again.");
			},
			onSettled: () => setIsBusyDownload(false),
		});

	// Effect for preview
	useEffect(() => {
		if (
			attachment.type === AttachmentType.image &&
			!previewUrl &&
			!previewError
		) {
			executeGetPreviewUrl({ attachmentId: attachment.id });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [attachment.id, attachment.type]); // Simplified dependencies

	// Handlers
	const handleDownloadClick = () => {
		executeGetDownloadUrl({ attachmentId: attachment.id });
	};
	const handleDeleteClick = () => {
		onRemove(attachment.id);
	};

	// Combined busy state
	const busy = isBusyPreview || isBusyDownload;
	const isDownloading = downloadStatus === "executing";

	// --- Render Image Variant (<a> wrapper) ---
	if (attachment.type === AttachmentType.image) {
		const isDisabled = busy || previewError;
		return (
			// biome-ignore lint/a11y/useValidAnchor: <Using anchor for onClick due to button nesting issues>
			<a
				href="#"
				onClick={(e) => {
					e.preventDefault();
					if (!isDisabled) handleDownloadClick();
				}}
				aria-disabled={isDisabled}
				tabIndex={isDisabled ? -1 : 0}
				className={`inline-block p-0 m-0 border-none bg-transparent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
				aria-label={
					isDisabled
						? `Preview for ${attachment.name}`
						: `Click to download ${attachment.name}`
				}
			>
				<div className="relative group w-24 h-24 bg-muted rounded-sm flex items-center justify-center overflow-hidden border">
					{isBusyPreview && (
						<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
					)}
					{previewError && !isBusyPreview && (
						<ImageOff className="h-6 w-6 text-destructive/70" />
					)}
					{previewUrl && !isBusyPreview && !previewError && (
						<img
							src={previewUrl}
							alt={`Preview of ${attachment.name}`}
							className="w-full h-full object-contain"
							onError={(e) => {
								console.error(
									`Image load error for ${previewUrl}:`,
									e,
								);
								setPreviewError(true);
								setPreviewUrl(null);
							}}
						/>
					)}
					{/* Hover Overlay */}
					<div className="absolute inset-0 bg-black/60 flex flex-col justify-between p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
						<span
							className="text-xs text-white font-medium truncate"
							title={attachment.name}
						>
							{attachment.name}
						</span>
						{isEditing && (
							<div className="flex items-center justify-end gap-1">
								<Button
									variant="ghost"
									size="icon"
									onClick={(e) => {
										e.stopPropagation();
										handleDeleteClick();
									}}
									disabled={busy}
									className="h-5 w-5 text-destructive/70 hover:text-destructive disabled:opacity-50"
									aria-label="Mark image for removal"
								>
									<Trash2 className="h-2.5 w-2.5" />
								</Button>
							</div>
						)}
					</div>
				</div>
			</a>
		);
	}

	// --- Render Non-Image Variant (<button> wrapper) ---
	return (
		<button
			key={attachment.id}
			type="button"
			onClick={handleDownloadClick}
			disabled={busy}
			className="flex items-center justify-between gap-2 text-xs border rounded px-2.5 py-1 w-full max-w-[200px] hover:bg-muted/50 disabled:opacity-50 disabled:pointer-events-none transition-colors text-left"
			title={`Download ${attachment.name}`}
		>
			<div className="flex items-center gap-1.5 truncate flex-1 min-w-0">
				{isDownloading ? (
					<Loader2 className="h-3 w-3 flex-shrink-0 animate-spin" />
				) : (
					// Use imported helper
					getIconForAttachmentType(attachment.type)
				)}
				<span className="truncate font-medium">{attachment.name}</span>
			</div>
			{isEditing && (
				<Button
					variant="ghost"
					size="icon"
					onClick={(e) => {
						e.stopPropagation();
						handleDeleteClick();
					}}
					disabled={busy}
					className="h-5 w-5 text-destructive/70 hover:text-destructive disabled:opacity-50 flex-shrink-0"
					aria-label="Mark attachment for removal"
				>
					<Trash2 className="h-2.5 w-2.5" />
				</Button>
			)}
		</button>
	);
}
