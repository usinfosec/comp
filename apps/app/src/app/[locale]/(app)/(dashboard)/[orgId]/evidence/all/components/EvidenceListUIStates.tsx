import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@comp/ui/alert";
import { AlertCircle, FileQuestion, SearchX } from "lucide-react";
import { useI18n } from "@/locales/client";
import { Button } from "@comp/ui/button";

interface ErrorStateProps {
	error: Error;
	onRetry?: () => void;
}

interface EmptyStateProps {
	message?: string;
	hasFilters?: boolean;
	onClearFilters?: () => void;
}

/**
 * Error state component for the evidence list
 */
export function EvidenceListError({ error, onRetry }: ErrorStateProps) {
	const t = useI18n();

	return (
		<Alert variant="destructive" className="my-8">
			<AlertCircle className="h-4 w-4" />
			<AlertTitle>Error</AlertTitle>
			<AlertDescription className="flex flex-col gap-4">
				<p>{error.message || "Failed to load evidence tasks"}</p>
				{onRetry && (
					<Button
						variant="outline"
						size="sm"
						onClick={onRetry}
						className="w-fit"
					>
						Retry
					</Button>
				)}
			</AlertDescription>
		</Alert>
	);
}

/**
 * Empty state component for the evidence list
 */
export function EvidenceListEmpty({
	message,
	hasFilters = false,
	onClearFilters,
}: EmptyStateProps) {
	const t = useI18n();
	const defaultMessage = hasFilters
		? "No evidence tasks match your current filters"
		: "No evidence tasks found";

	return (
		<div className="flex flex-col items-center justify-center py-12 px-4 border rounded-md bg-card/50">
			{hasFilters ? (
				<SearchX className="h-12 w-12 text-muted-foreground mb-4" />
			) : (
				<FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
			)}

			<h3 className="text-lg font-semibold mb-2">
				{hasFilters ? "No Matches Found" : "No Evidence Tasks"}
			</h3>

			<p className="text-muted-foreground text-center mb-4">
				{message || defaultMessage}
			</p>

			{hasFilters && onClearFilters && (
				<Button variant="outline" onClick={onClearFilters}>
					Clear All Filters
				</Button>
			)}
		</div>
	);
}
