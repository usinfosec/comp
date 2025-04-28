"use client";

import { Button } from "@comp/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@comp/ui/dropdown-menu";
import { TaskEntityType, TaskStatus } from "@comp/db/types";
import { CheckCircle2, Circle, Filter, List, LoaderCircle } from "lucide-react";
import { parseAsArrayOf, parseAsStringLiteral, useQueryState } from "nuqs";

// Configuration for task statuses and their display order.
const statuses = [
	{ id: "in_progress", title: "In Progress" },
	{ id: "todo", title: "Todo" },
	{ id: "done", title: "Done" },
] as const;
type StatusId = (typeof statuses)[number]["id"];

// Allowed entity types for tasks.
const possibleEntityTypes = [
	TaskEntityType.control,
	TaskEntityType.risk,
	TaskEntityType.vendor,
] as const;

// Parser for handling comma-separated entity types in the URL query string.
const entityTypesParser = parseAsArrayOf(
	parseAsStringLiteral(possibleEntityTypes),
	",",
)
	.withDefault([] as TaskEntityType[])
	.withOptions({ shallow: false });

/**
 * Renders the header section for filtering tasks by status and entity type.
 * Uses `nuqs` to manage filter state in the URL search parameters.
 */
export function TaskFilterHeader() {
	// State for the status filter, synced with the 'status' URL query parameter.
	const [statusFilter, setStatusFilter] = useQueryState("status", {
		shallow: false, // Ensures full page reload on change to refetch server data.
	});

	// State for the entity type filter, synced with the 'entityTypes' URL query parameter.
	const [entityTypes, setEntityTypes] = useQueryState(
		"entityTypes",
		entityTypesParser,
	);

	// Mapping of status IDs (and 'all') to their corresponding icons.
	const statusIcons: Record<StatusId | "all", React.ElementType> = {
		all: List,
		in_progress: LoaderCircle,
		todo: Circle,
		done: CheckCircle2,
	};

	// Helper function to determine button styling based on active state.
	const getButtonClasses = (isActive: boolean) => {
		const baseClasses = "flex items-center space-x-1.5";
		const inactiveClasses =
			"text-muted-foreground hover:bg-accent hover:text-accent-foreground";
		return `${baseClasses} ${isActive ? "" : inactiveClasses}`.trim();
	};

	// Handler for updating the entity type filter based on checkbox changes.
	const handleEntityTypeChange = (type: TaskEntityType, checked: boolean) => {
		setEntityTypes((prev) => {
			const currentTypes = prev ?? [];
			if (checked) {
				// Add the type if checked, ensuring uniqueness.
				return Array.from(new Set([...currentTypes, type]));
			}
			// Remove the type if unchecked.
			return currentTypes.filter((t) => t !== type);
		});
	};

	// Check if any status or entity type filters are currently active.
	const filtersActive =
		statusFilter !== null || (entityTypes?.length ?? 0) > 0;

	// Handler to clear all active filters.
	const clearFilters = () => {
		setStatusFilter(null);
		setEntityTypes([]); // Clear entity types using the setter with an empty array.
	};

	return (
		<div className=" border-b-0">
			{/* Status Filter Buttons */}
			<div className="flex items-center space-x-1 py-2 border-b">
				<Button
					variant={statusFilter === null ? "secondary" : "ghost"}
					size="sm"
					className={getButtonClasses(statusFilter === null)}
					onClick={() => setStatusFilter(null)}
				>
					<List className="w-3.5 h-3.5" />
					<span>All</span>
				</Button>
				{statuses.map((status) => {
					const Icon = statusIcons[status.id];
					const isActive = statusFilter === status.id;
					return (
						<Button
							key={status.id}
							variant={isActive ? "secondary" : "ghost"}
							size="sm"
							className={getButtonClasses(isActive)}
							onClick={() => setStatusFilter(status.id)}
						>
							<Icon className="w-3.5 h-3.5" />
							<span>{status.title}</span>
						</Button>
					);
				})}
			</div>

			{/* Action Filters (Entity Type and Clear) */}
			<div className="flex items-center py-2 space-x-2">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="flex items-center space-x-1.5 text-muted-foreground"
						>
							<Filter className="w-3.5 h-3.5" />
							<span>Filter</span>
							{/* Display badge indicating the number of active entity type filters. */}
							{(entityTypes?.length ?? 0) > 0 && (
								<span className="ml-1.5 rounded bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground">
									{entityTypes!.length}
								</span>
							)}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{possibleEntityTypes.map((type) => (
							<DropdownMenuCheckboxItem
								key={type}
								checked={entityTypes?.includes(type) ?? false}
								onCheckedChange={(checked) =>
									handleEntityTypeChange(type, !!checked)
								}
								className="capitalize"
							>
								{type}
							</DropdownMenuCheckboxItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Conditionally render the 'Clear filters' button only when filters are active. */}
				{filtersActive && (
					<Button
						variant="ghost"
						size="sm"
						onClick={clearFilters}
						className="text-muted-foreground"
					>
						Clear filters
					</Button>
				)}
			</div>
		</div>
	);
}
