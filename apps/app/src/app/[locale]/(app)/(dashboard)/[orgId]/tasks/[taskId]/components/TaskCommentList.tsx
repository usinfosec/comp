import type { CommentWithAuthor } from "../page";
import { TaskCommentItem } from "./TaskCommentItem";

interface TaskCommentListProps {
	comments: CommentWithAuthor[];
}

export function TaskCommentList({ comments }: TaskCommentListProps) {
	return (
		<div className="space-y-4">
			{comments.length === 0 && (
				<p className="text-sm text-muted-foreground">
					No comments yet.
				</p>
			)}
			{comments.map((comment) => (
				<TaskCommentItem key={comment.id} comment={comment} />
			))}
		</div>
	);
}
