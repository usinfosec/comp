import type { CommentWithAuthor } from "../page";
import { TaskCommentItem } from "./TaskCommentItem";

interface TaskCommentListProps {
	comments: CommentWithAuthor[];
}

export function TaskCommentList({ comments }: TaskCommentListProps) {
	return (
		<div className="space-y-4">
			{comments.map((comment) => (
				<TaskCommentItem key={comment.id} comment={comment} />
			))}
		</div>
	);
}
