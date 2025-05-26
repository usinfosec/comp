import type { Table } from "@tanstack/react-table";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";
import { useQueryState } from "nuqs";
import * as React from "react";

import { Button } from "@comp/ui/button";
import { cn } from "@comp/ui/cn";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@comp/ui/select";

interface DataTablePaginationProps<TData> extends React.ComponentProps<"div"> {
	table: Table<TData>;
	pageSizeOptions?: number[];
	tableId?: string;
}

export function DataTablePagination<TData>({
	table,
	pageSizeOptions = [50, 100, 200],
	tableId,
	className,
	...props
}: DataTablePaginationProps<TData>) {
	const pageParam = tableId ? `${tableId}_page` : "page";
	const perPageParam = tableId ? `${tableId}_perPage` : "perPage";

	const [page, setPage] = useQueryState(pageParam);
	const [perPage, setPerPage] = useQueryState(perPageParam);

	// Parse URL query params
	const pageIndex = React.useMemo(() => {
		if (!page) return table.getState().pagination.pageIndex;
		try {
			const parsed = Number.parseInt(page, 10);
			return Number.isNaN(parsed)
				? table.getState().pagination.pageIndex
				: parsed - 1;
		} catch (e) {
			return table.getState().pagination.pageIndex;
		}
	}, [page, table]);

	const pageSizeValue = React.useMemo(() => {
		if (!perPage) return table.getState().pagination.pageSize;
		try {
			const parsed = Number.parseInt(perPage, 10);
			return Number.isNaN(parsed)
				? table.getState().pagination.pageSize
				: parsed;
		} catch (e) {
			return table.getState().pagination.pageSize;
		}
	}, [perPage, table]);

	// Use effect to update table pagination when query params change
	React.useEffect(() => {
		if (pageIndex !== table.getState().pagination.pageIndex) {
			table.setPageIndex(pageIndex);
		}

		if (pageSizeValue !== table.getState().pagination.pageSize) {
			table.setPageSize(pageSizeValue);
		}
	}, [pageIndex, pageSizeValue, table]);

	// Sync URL with table state on initial render
	React.useEffect(() => {
		const currentPageIndex = table.getState().pagination.pageIndex;
		const currentPageSize = table.getState().pagination.pageSize;

		if (page === undefined && currentPageIndex > 0) {
			setPage((currentPageIndex + 1).toString());
		}

		if (perPage === undefined && currentPageSize !== 10) {
			setPerPage(currentPageSize.toString());
		}
	}, [table, page, perPage, setPage, setPerPage]);

	// Handlers that update both table state and URL query params
	const handlePageChange = React.useCallback(
		(newPage: number) => {
			setPage((newPage + 1).toString());
			table.setPageIndex(newPage);
		},
		[setPage, table],
	);

	const handlePageSizeChange = React.useCallback(
		(value: string) => {
			const newSize = Number(value);
			setPerPage(value);
			table.setPageSize(newSize);
		},
		[setPerPage, table],
	);

	return (
		<div
			className={cn(
				"flex items-center justify-between py-2 px-1",
				className,
			)}
			{...props}
		>
			<div className="flex items-center gap-3 text-sm text-muted-foreground">
				<span className="hidden sm:inline">{table.getCoreRowModel().rows.length} items</span>
				<div className="hidden sm:flex items-center gap-1.5">
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={handlePageSizeChange}
					>
						<SelectTrigger className="h-7 w-24 text-xs border-muted bg-transparent rounded-sm">
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side="bottom">
							{pageSizeOptions.map((pageSize) => (
								<SelectItem
									key={pageSize}
									value={`${pageSize}`}
									className="text-xs"
								>
									{pageSize} rows
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<span className="text-xs">per page</span>
				</div>
			</div>

			<div className="flex items-center space-x-1">
				<span className="text-xs text-muted-foreground mr-1 hidden sm:inline">
					{table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
				</span>
				<Button
					aria-label="Go to first page"
					variant="ghost"
					size="icon"
					className="hidden h-7 w-7 sm:flex"
					onClick={() => handlePageChange(0)}
					disabled={!table.getCanPreviousPage()}
				>
					<ChevronsLeft className="h-3.5 w-3.5" />
				</Button>
				<Button
					aria-label="Go to previous page"
					variant="ghost"
					size="icon"
					className="h-7 w-7"
					onClick={() => handlePageChange(pageIndex - 1)}
					disabled={!table.getCanPreviousPage()}
				>
					<ChevronLeft className="h-3.5 w-3.5" />
				</Button>
				<Button
					aria-label="Go to next page"
					variant="ghost"
					size="icon"
					className="h-7 w-7"
					onClick={() => handlePageChange(pageIndex + 1)}
					disabled={!table.getCanNextPage()}
				>
					<ChevronRight className="h-3.5 w-3.5" />
				</Button>
				<Button
					aria-label="Go to last page"
					variant="ghost"
					size="icon"
					className="hidden h-7 w-7 sm:flex"
					onClick={() => handlePageChange(table.getPageCount() - 1)}
					disabled={!table.getCanNextPage()}
				>
					<ChevronsRight className="h-3.5 w-3.5" />
				</Button>
			</div>
		</div>
	);
}
