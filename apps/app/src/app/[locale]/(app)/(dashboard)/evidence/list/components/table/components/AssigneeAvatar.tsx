"use client";

interface AssigneeAvatarProps {
	assignee: {
		name: string | null;
		image: string | null;
	};
}

export function AssigneeAvatar({ assignee }: AssigneeAvatarProps) {
	if (assignee.image) {
		return (
			<img
				src={assignee.image}
				alt={assignee.name || "Unknown"}
				className="h-5 w-5 rounded-full"
			/>
		);
	}

	return (
		<div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">
			{(assignee.name || "?").charAt(0)}
		</div>
	);
}
