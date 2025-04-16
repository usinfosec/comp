import { Avatar, AvatarFallback, AvatarImage } from "@comp/ui/avatar";
import { Card, CardContent } from "@comp/ui/card";
import type { CommentWithAuthor } from "../page";

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
				<div className="flex-1 text-sm">
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
			</CardContent>
		</Card>
	);
}
