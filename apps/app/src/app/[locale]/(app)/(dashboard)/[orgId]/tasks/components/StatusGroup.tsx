"use client";

import { Member, Task, User, TaskEntityType } from "@comp/db/types";
import { useDrop } from "react-dnd";
import { useRef } from "react";
import { TaskCard, DragItem, ItemTypes, StatusId } from "./TaskCard";
import { updateTaskOrder } from "../actions/updateTaskOrder";

// --- StatusGroup Component Props Interface ---
interface StatusGroupProps {
	status: { id: StatusId; title: string };
	tasks: Task[]; // Tasks belonging to this specific status group.
	handleDropTaskInternal: (
		item: DragItem,
		targetStatus: StatusId,
		hoverIndex: number,
	) => void; // Callback for drops *between* different status groups.
	members: (Member & { user: User })[];
	statusFilter: string | null | undefined; // Current status filter applied from the URL.
}

/**
 * Renders a group of tasks for a specific status.
 * Handles dropping tasks from other statuses into this group.
 * Handles reordering tasks *within* this group.
 */
export function StatusGroup({
	status,
	tasks,
	handleDropTaskInternal,
	members,
	statusFilter,
}: StatusGroupProps) {
	// const dropRef = useRef<HTMLDivElement>(null);

	// Determine if the tasks within this group should be rendered based on the status filter.
	const shouldRenderTasks = !statusFilter || status.id === statusFilter;

	// Handles the reordering logic when a task is dropped within this specific group.
	async function handleDropReorder(dragIndex: number, hoverIndex: number) {
		// Create a new array representing the desired order after the drop.
		const reorderedTasks = [...tasks];
		const [draggedItem] = reorderedTasks.splice(dragIndex, 1);
		// Ensure the hover index is valid after removing the dragged item.
		const validHoverIndex = Math.min(hoverIndex, reorderedTasks.length);
		reorderedTasks.splice(validHoverIndex, 0, draggedItem);

		// Prepare the payload for the server action, assigning new sequential order values.
		const updates = reorderedTasks.map((task, idx) => ({
			id: task.id,
			order: idx, // The new order is simply the index in the reordered array.
			status: task.status as StatusId,
			entityType: task.entityType,
		}));

		// Call the server action to persist the new order.
		await updateTaskOrder(updates);
	}

	return (
		<div key={status.id} className="rounded">
			{/* Status Group Header */}
			<div className="flex items-center pr-2 pl-6 py-2 bg-muted/50">
				<h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
					{status.title}
				</h2>
				<span className="ml-2 text-xs text-muted-foreground">
					{tasks.length}
				</span>
			</div>
			{/* Task List Area - Render directly from tasks prop */}{" "}
			{shouldRenderTasks && (
				<div>
					{tasks.map((task, idx) => (
						<TaskCard
							key={task.id}
							task={task}
							members={members}
							isLast={idx === tasks.length - 1}
							index={idx}
							onDropReorder={handleDropReorder}
							handleDropTaskInternal={handleDropTaskInternal}
						/>
					))}
				</div>
			)}
		</div>
	);
}
