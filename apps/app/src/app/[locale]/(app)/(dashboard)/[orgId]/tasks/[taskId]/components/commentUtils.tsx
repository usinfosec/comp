import { AttachmentType } from "@comp/db/types";
import { FileText, FileVideo, FileAudio, FileQuestion } from "lucide-react";

// Formats a date object into relative time string (e.g., "5m ago")
export function formatRelativeTime(date: Date): string {
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

// Returns a Lucide icon component based on AttachmentType
export function getIconForAttachmentType(type: AttachmentType) {
	switch (type) {
		case AttachmentType.document:
			return (
				<FileText className="h-8 w-8 flex-shrink-0 text-muted-foreground" />
			);
		case AttachmentType.video:
			return (
				<FileVideo className="h-8 w-8 flex-shrink-0 text-muted-foreground" />
			);
		case AttachmentType.audio:
			return (
				<FileAudio className="h-8 w-8 flex-shrink-0 text-muted-foreground" />
			);
		case AttachmentType.image:
			return null;
		default:
			return (
				<FileQuestion className="h-8 w-8 flex-shrink-0 text-muted-foreground" />
			);
	}
}
