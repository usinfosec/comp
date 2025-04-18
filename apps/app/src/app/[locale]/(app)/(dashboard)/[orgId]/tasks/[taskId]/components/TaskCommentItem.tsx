import { Avatar, AvatarFallback, AvatarImage } from "@comp/ui/avatar";
import { Card, CardContent } from "@comp/ui/card";
import type { CommentWithAuthor } from "../page";
import { Button } from "@comp/ui/button";
import { File as FileIcon, Trash2, Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { getCommentAttachmentUrl } from "../../actions/getCommentAttachmentUrl";
import { deleteCommentAttachment } from "../../actions/deleteCommentAttachment";
import type { ActionResponse } from "@/actions/types";
import { useRouter } from "next/navigation";

// Copied from TaskMainContent - consider moving to a shared utils/formatters file
function formatRelativeTime(date: Date): string {
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
	const diffInMinutes = Math.floor(diffInSeconds / 60);
	const diffInHours = Math.floor(diffInMinutes / 60);
	const diffInDays = Math.floor(diffInHours / 24);

	if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
	if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
	if (diffInHours < 24) return `${diffInHours}h ago`;
	return `${diffInDays}d ago`;
}

interface TaskCommentItemProps {
	comment: CommentWithAuthor;
}

export function TaskCommentItem({ comment }: TaskCommentItemProps) {
	const [busyAttachmentId, setBusyAttachmentId] = useState<string | null>(
		null,
	);
	const router = useRouter();

	const { execute: executeGetDownloadUrl, status: downloadStatus } =
		useAction(getCommentAttachmentUrl, {
			onExecute: (args: { input: { attachmentId: string } }) => {
				setBusyAttachmentId(args.input.attachmentId);
			},
			onSuccess: (args: {
				data?: ActionResponse<{ signedUrl: string }>;
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
			onError: () => {
				console.error("Get comment download URL error occurred.");
				toast.error("Could not get download URL. Please try again.");
			},
			onSettled: () => {
				setBusyAttachmentId(null);
			},
		});

	const { execute: executeDeleteAttachment, status: deleteStatus } =
		useAction(deleteCommentAttachment, {
			onExecute: (args: { input: { attachmentId: string } }) => {
				setBusyAttachmentId(args.input.attachmentId);
			},
			onSuccess: (args: {
				data?: ActionResponse<{ deletedAttachmentId: string }>;
			}) => {
				if (args.data?.success) {
					toast.success("Attachment deleted successfully.");
					router.refresh();
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
			onError: () => {
				console.error("Delete comment attachment error occurred.");
				toast.error("Failed to delete attachment. Please try again.");
			},
			onSettled: () => {
				setBusyAttachmentId(null);
			},
		});

	const handleDownloadClick = (attachmentId: string) => {
		executeGetDownloadUrl({ attachmentId });
	};

	const handleDeleteClick = (attachmentId: string) => {
		executeDeleteAttachment({ attachmentId });
	};

	return (
		<Card>
			<CardContent className="p-4 flex gap-3 items-start text-foreground">
				<Avatar className="h-8 w-8">
					<AvatarImage
						src={comment.author.user?.image ?? undefined}
						alt={comment.author.user?.name ?? "User"}
					/>
					<AvatarFallback>
						{comment.author.user?.name?.charAt(0).toUpperCase() ??
							"?"}
					</AvatarFallback>
				</Avatar>
				<div className="flex-1 text-sm space-y-4">
					<div>
						<div className="flex items-center gap-2 mb-1">
							<span className="font-medium">
								{comment.author.user?.name ?? "Unknown User"}
							</span>
							<span className="text-xs text-muted-foreground">
								{formatRelativeTime(comment.createdAt)}
							</span>
						</div>
						<p className="whitespace-pre-wrap">{comment.content}</p>
					</div>

					{comment.attachments && comment.attachments.length > 0 && (
						<div className="border-t pt-2">
							<ul className="space-y-1.5">
								{comment.attachments.map((attachment) => {
									const isBusy =
										busyAttachmentId === attachment.id;
									const isDeleting =
										isBusy && deleteStatus === "executing";
									const isDownloading =
										isBusy &&
										!isDeleting &&
										downloadStatus === "executing";
									return (
										<li
											key={attachment.id}
											className="flex items-center justify-between gap-2 text-xs border rounded px-2.5 py-1"
										>
											<button
												type="button"
												onClick={() =>
													handleDownloadClick(
														attachment.id,
													)
												}
												disabled={!!busyAttachmentId}
												className="flex items-center gap-1.5 hover:underline truncate disabled:opacity-50 disabled:no-underline"
												title={`Download ${attachment.name}`}
											>
												{isDownloading ? (
													<Loader2 className="h-3 w-3 flex-shrink-0 animate-spin" />
												) : (
													<FileIcon className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
												)}
												<span className="truncate">
													{attachment.name}
												</span>
											</button>
											<Button
												variant="ghost"
												size="icon"
												onClick={() =>
													handleDeleteClick(
														attachment.id,
													)
												}
												disabled={!!busyAttachmentId}
												className="h-5 w-5 text-destructive/70 hover:text-destructive disabled:opacity-50"
												aria-label="Delete attachment"
											>
												{isDeleting ? (
													<Loader2 className="h-2.5 w-2.5 animate-spin" />
												) : (
													<Trash2 className="h-2.5 w-2.5" />
												)}
											</Button>
										</li>
									);
								})}
							</ul>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
