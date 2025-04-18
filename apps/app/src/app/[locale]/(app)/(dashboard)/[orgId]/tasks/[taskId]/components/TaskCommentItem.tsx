import { uploadFile } from "@/actions/files/upload-file";
import type { Attachment } from "@comp/db/types";
import { Avatar, AvatarFallback, AvatarImage } from "@comp/ui/avatar";
import { Button } from "@comp/ui/button";
import { Card, CardContent } from "@comp/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@comp/ui/dropdown-menu";
import { Label } from "@comp/ui/label";
import { Textarea } from "@comp/ui/textarea";
import { Loader2, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { deleteComment } from "../../actions/deleteComment";
import { updateComment } from "../../actions/updateComment";
import type { CommentWithAuthor } from "../page";
import { AttachmentItem } from "./AttachmentItem";
import { formatRelativeTime } from "./commentUtils";

interface TaskCommentItemProps {
	comment: CommentWithAuthor;
}

export function TaskCommentItem({ comment }: TaskCommentItemProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editedContent, setEditedContent] = useState(comment.content);
	const [currentAttachments, setCurrentAttachments] = useState(
		comment.attachments,
	);
	const [attachmentsToRemove, setAttachmentsToRemove] = useState<string[]>(
		[],
	);
	const [pendingAttachmentsToAdd, setPendingAttachmentsToAdd] = useState<
		Attachment[]
	>([]);
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	// --- Action Hooks ---

	// Upload File (for adding during edit)
	const { execute: executeUploadFile, status: uploadFileStatus } = useAction(
		uploadFile,
		{
			onExecute: () => setIsUploading(true),
			onSuccess: ({ data }) => {
				if (data?.success && data.data?.attachment) {
					setPendingAttachmentsToAdd((prev) => [
						...prev,
						data.data.attachment,
					]);
					toast.success(
						`File "${data.data.attachment.name}" staged for adding.`,
					);
				} else {
					toast.error(
						String(data?.error || "Failed to stage attachment."),
					);
				}
			},
			onError: () => {
				toast.error("Failed to upload file. Please try again.");
			},
			onSettled: () => {
				setIsUploading(false);
				if (fileInputRef.current) fileInputRef.current.value = "";
			},
		},
	);

	// Update Comment
	const { execute: executeUpdateComment, status: updateStatus } = useAction(
		updateComment,
		{
			onSuccess: ({ data }) => {
				if (data?.success) {
					toast.success("Comment updated successfully.");
					setIsEditing(false);
					// Refresh might not be strictly needed if optimistic update is done
					// but it ensures consistency
					router.refresh();
				} else {
					toast.error(
						String(data?.error || "Failed to update comment."),
					);
				}
			},
			onError: (error) => {
				console.error("Update comment error:", error);
				toast.error("Failed to update comment.");
			},
		},
	);

	// Delete Comment
	const { execute: executeDeleteComment, status: deleteCommentStatus } =
		useAction(deleteComment, {
			onSuccess: ({ data }) => {
				if (data?.success) {
					toast.success("Comment deleted successfully.");
					// Component will unmount after refresh
					router.refresh();
				} else {
					toast.error(
						String(data?.error || "Failed to delete comment."),
					);
				}
			},
			onError: (error) => {
				console.error("Delete comment error:", error);
				toast.error("Failed to delete comment.");
			},
		});

	// --- Handlers ---
	const handleEditToggle = () => {
		if (!isEditing) {
			setEditedContent(comment.content);
			setCurrentAttachments(comment.attachments); // Reset from original comment
			setAttachmentsToRemove([]);
			setPendingAttachmentsToAdd([]);
		}
		setIsEditing(!isEditing);
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		// State reset happens automatically when toggling back via handleEditToggle
	};

	const handleSaveEdit = () => {
		const contentChanged = editedContent !== comment.content;
		const attachmentsAdded = pendingAttachmentsToAdd.length > 0;
		const attachmentsRemoved = attachmentsToRemove.length > 0;

		if (!contentChanged && !attachmentsAdded && !attachmentsRemoved) {
			toast.info("No changes detected.");
			setIsEditing(false); // Exit edit mode if no changes
			return;
		}

		// Call the update action
		executeUpdateComment({
			commentId: comment.id,
			// Only send content if it actually changed
			content: contentChanged ? editedContent : undefined,
			attachmentIdsToAdd: attachmentsAdded
				? pendingAttachmentsToAdd.map((a) => a.id)
				: undefined,
			attachmentIdsToRemove: attachmentsRemoved
				? attachmentsToRemove
				: undefined,
		});
	};

	const handleDeleteComment = () => {
		if (window.confirm("Are you sure you want to delete this comment?")) {
			console.log("Deleting comment:", comment.id);
			// TODO: Call executeDeleteComment action
			// On success: router.refresh(); (Component will disappear)
		}
	};

	// Handler for AttachmentItem to mark for removal
	const handleMarkForRemoval = (attachmentId: string) => {
		setAttachmentsToRemove((prev) => [...prev, attachmentId]);
		// Visually remove from current list
		setCurrentAttachments((prev) =>
			prev.filter((att) => att.id !== attachmentId),
		);
	};

	// Handler to remove *staged* attachments before saving
	const handleRemovePending = (attachmentId: string) => {
		setPendingAttachmentsToAdd((prev) =>
			prev.filter((att) => att.id !== attachmentId),
		);
	};

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	const handleFileSelect = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (!file) return;

			const reader = new FileReader();
			reader.onloadend = () => {
				const base64Data = (reader.result as string)?.split(",")[1];
				if (!base64Data) {
					toast.error("Failed to read file data.");
					return;
				}

				executeUploadFile({
					fileName: file.name,
					fileType: file.type,
					fileData: base64Data,
					entityId: comment.entityId,
					entityType: "comment",
				});
			};
			reader.onerror = () => {
				toast.error("Error reading file.");
			};
			reader.readAsDataURL(file);
		},
		[executeUploadFile, comment.entityId],
	);

	const isProcessing =
		updateStatus === "executing" ||
		deleteCommentStatus === "executing" ||
		isUploading;

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
				<div className="flex-1 text-sm space-y-2">
					<div>
						<div className="flex items-center justify-between gap-2 mb-1">
							<div className="flex items-center gap-2">
								<span className="font-medium">
									{comment.author.user?.name ??
										"Unknown User"}
								</span>
								<span className="text-xs text-muted-foreground">
									{!isEditing
										? formatRelativeTime(comment.createdAt)
										: "Editing..."}
								</span>
							</div>
							{!isEditing && (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="h-6 w-6 flex-shrink-0"
											aria-label="Comment options"
										>
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem
											onSelect={handleEditToggle}
										>
											<Pencil className="mr-2 h-3.5 w-3.5" />
											Edit
										</DropdownMenuItem>
										<DropdownMenuItem
											className="text-destructive focus:text-destructive focus:bg-destructive/10"
											onSelect={handleDeleteComment}
										>
											<Trash2 className="mr-2 h-3.5 w-3.5" />
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							)}
						</div>

						{!isEditing ? (
							<p className="whitespace-pre-wrap">
								{comment.content}
							</p>
						) : (
							<Textarea
								value={editedContent}
								onChange={(e) =>
									setEditedContent(e.target.value)
								}
								className="min-h-[60px] text-sm"
								placeholder="Edit comment..."
							/>
						)}
					</div>

					{(currentAttachments.length > 0 ||
						pendingAttachmentsToAdd.length > 0 ||
						isEditing) && (
						<div className="pt-6">
							{isEditing && (
								<Label className="text-xs font-medium mb-2 block">
									Attachments
								</Label>
							)}
							<input
								type="file"
								ref={fileInputRef}
								onChange={handleFileSelect}
								className="hidden"
								disabled={isProcessing}
							/>
							<div className="flex flex-wrap gap-2">
								{currentAttachments.map((attachment) => (
									<AttachmentItem
										key={attachment.id}
										attachment={attachment}
										isEditing={isEditing}
										onRemove={handleMarkForRemoval}
									/>
								))}
								{isEditing &&
									pendingAttachmentsToAdd.map(
										(attachment) => (
											<AttachmentItem
												key={attachment.id}
												attachment={attachment}
												isEditing={isEditing}
												onRemove={handleRemovePending}
											/>
										),
									)}
								{isEditing && (
									<button
										type="button"
										onClick={triggerFileInput}
										disabled={isProcessing}
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

					{isEditing && (
						<div className="flex justify-end gap-2 border-t pt-3">
							<Button
								variant="ghost"
								size="sm"
								onClick={handleCancelEdit}
							>
								Cancel
							</Button>
							<Button
								size="sm"
								onClick={handleSaveEdit}
								disabled={isProcessing}
							>
								{isProcessing ? "Saving..." : "Save Changes"}
							</Button>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
