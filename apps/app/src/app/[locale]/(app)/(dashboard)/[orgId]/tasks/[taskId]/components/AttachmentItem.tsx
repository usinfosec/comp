"use client";

import type { Attachment } from "@comp/db/types";
import { AttachmentType } from "@comp/db/types";
import { Button } from "@comp/ui/button";
import { useAction } from "next-safe-action/hooks";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { File as FileIcon, Trash2, Loader2, ImageOff } from "lucide-react";
import { getIconForAttachmentType } from "./commentUtils"; // Import helper
import type { ActionResponse } from "@/actions/types";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@comp/ui/alert-dialog";

// Define a generic type for the expected action signature
// (Using any for now for simplicity, can be refined)
// TODO: Refine this type if possible based on next-safe-action types
type GetUrlAction = (...args: any[]) => Promise<any>;

interface AttachmentItemProps {
	attachment: Attachment;
	isEditing: boolean;
	onRemove: (attachmentId: string) => void;
	previewDataUrl?: string | null;
	getUrlAction: GetUrlAction; // Add prop for the get URL action
}

export function AttachmentItem({
	attachment,
	isEditing,
	onRemove,
	previewDataUrl,
	getUrlAction, // Destructure the action prop
}: AttachmentItemProps) {
	// State variables
	const [isBusyPreview, setIsBusyPreview] = useState(false);
	const [isBusyDownload, setIsBusyDownload] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [previewError, setPreviewError] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	// Action hooks - use the passed getUrlAction prop
	const { execute: executeGetPreviewUrl } = useAction(
		getUrlAction, // Use the prop here
		{
			onExecute: () => {
				setIsBusyPreview(true);
				setPreviewError(false);
			},
			onSuccess: (args) => {
				// Assuming args structure is consistent
				const { data } = args as {
					data?: ActionResponse<{ signedUrl: string }>;
				};
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
		useAction(getUrlAction, {
			// Use the prop here
			onExecute: () => setIsBusyDownload(true),
			onSuccess: (args) => {
				// Assuming args structure is consistent
				const { data } = args as {
					data?: ActionResponse<{ signedUrl: string }>;
				};
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
			!previewDataUrl &&
			attachment.type === AttachmentType.image &&
			!previewUrl &&
			!previewError
		) {
			// Pass input compatible with both actions
			executeGetPreviewUrl({ attachmentId: attachment.id });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		attachment.id,
		attachment.type,
		previewDataUrl,
		previewUrl,
		previewError,
		// Add executeGetPreviewUrl as dependency
		executeGetPreviewUrl,
	]);

	// Handlers
	const handleDownloadClick = () => {
		// Pass input compatible with both actions
		executeGetDownloadUrl({ attachmentId: attachment.id });
	};
	const handleDeleteClick = () => {
		setIsDeleteDialogOpen(true);
	};
	const confirmDeleteHandler = () => {
		onRemove(attachment.id);
	};

	// Combined busy state
	const busy = isBusyPreview || isBusyDownload;
	const isDownloading = downloadStatus === "executing";

	// Determine which URL to use for the image source
	const imageSrc = previewDataUrl ?? previewUrl;

	// --- Render Image Variant (<a> wrapper) ---
	if (attachment.type === AttachmentType.image) {
		const isDisabled = busy || (!imageSrc && previewError);
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
					{isBusyPreview && !previewDataUrl && (
						<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
					)}
					{previewError && !isBusyPreview && (
						<ImageOff className="h-6 w-6 text-destructive/70" />
					)}
					{imageSrc && !isBusyPreview && !previewError && (
						<img
							src={imageSrc}
							alt={`Preview of ${attachment.name}`}
							className="w-full h-full object-contain"
							onError={(e) => {
								console.error(
									`Image load error for ${imageSrc}:`,
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
								aria-label="Delete attachment"
							>
								<Trash2 className="h-2.5 w-2.5" />
							</Button>
						</div>
					</div>
				</div>
			</a>
		);
	}

	// --- Render Non-Image Variant (Modified to resemble image variant) ---
	return (
		// biome-ignore lint/a11y/useValidAnchor: <Using anchor for onClick>
		<a
			href="#"
			onClick={(e) => {
				e.preventDefault();
				if (!busy) handleDownloadClick();
			}}
			aria-disabled={busy}
			tabIndex={busy ? -1 : 0}
			className={`inline-block p-0 m-0 border-none bg-transparent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm ${busy ? "opacity-50 cursor-not-allowed" : ""}`}
			aria-label={`Download ${attachment.name}`}
			title={`Download ${attachment.name}`}
		>
			{/* Container mimicking the image variant, using flex-col */}
			<div className="relative group w-24 h-24 bg-muted rounded-sm flex flex-col items-center justify-center p-2 overflow-hidden border text-muted-foreground">
				{isDownloading ? (
					<Loader2 className="h-6 w-6 animate-spin" />
				) : (
					<>
						{/* Render the icon */}
						<div className="h-8 w-8 mb-1">
							{" "}
							{/* Added margin-bottom */}
							{getIconForAttachmentType(attachment.type)}
						</div>
						{/* Display the file extension */}
						<span className="text-xs font-medium truncate max-w-full">
							{getFileExtension(attachment.name)}
						</span>
					</>
				)}
				{/* Hover Overlay (remains the same) */}
				<div className="absolute inset-0 bg-black/60 flex flex-col justify-between p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
					<span
						className="text-xs text-white font-medium truncate"
						title={attachment.name}
					>
						{attachment.name}
					</span>
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
							aria-label="Delete attachment"
						>
							<Trash2 className="h-2.5 w-2.5" />
						</Button>
					</div>
				</div>
			</div>

			{/* Delete Confirmation Dialog for this specific item */}
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							Delete attachment "{attachment.name}"? This action
							cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={confirmDeleteHandler}>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</a>
	);
}

// Helper function definition (can be outside the component)
function getFileExtension(filename: string): string | null {
	const parts = filename.split(".");
	if (parts.length > 1) {
		return `.${parts[parts.length - 1].toLowerCase()}`;
	}
	return null;
}
