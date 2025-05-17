import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";
import type { Comment } from "@comp/db/types";
import type { Member } from "@comp/db/types";
import type { User } from "@comp/db/types";
import type { Attachment } from "@comp/db/types";
import { CommentEntityType } from "@comp/db/types";

export type CommentWithAuthor = Comment & {
	author: Member & {
		user: User;
	};
	attachments: Attachment[];
};

export const Comments = ({
	entityId,
	entityType,
	comments,
}: {
	entityId: string;
	entityType: CommentEntityType;
	comments: CommentWithAuthor[];
}) => {
	return (
		<div className="space-y-4">
			<h3 className="text-lg font-medium">Comments</h3>
			<CommentForm entityId={entityId} entityType={entityType} />
			<CommentList comments={comments} />
		</div>
	);
};
