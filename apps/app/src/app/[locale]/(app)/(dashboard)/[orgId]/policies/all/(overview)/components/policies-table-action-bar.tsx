"use client";

import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { DataTableActionBar } from "@/components/data-table/data-table-action-bar";
import { Button } from "@comp/ui/button";
import { Separator } from "@comp/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@comp/ui/tooltip";
import { Policy } from "@comp/db/types";

interface PoliciesTableActionBarProps {
	table: Table<Policy>;
}

export function PoliciesTableActionBar({ table }: PoliciesTableActionBarProps) {
	const rows = table.getFilteredSelectedRowModel().rows;

	return (
		<DataTableActionBar table={table} visible={rows.length > 0}>
			<div className="flex h-7 items-center rounded-md border pr-1 pl-2.5">
				<span className="whitespace-nowrap text-xs">
					{rows.length} selected
				</span>
				<Separator
					orientation="vertical"
					className="mr-1 ml-2 data-[orientation=vertical]:h-4"
				/>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="size-5 [&>svg]:size-3.5"
							onClick={() => table.toggleAllRowsSelected(false)}
						>
							<X />
						</Button>
					</TooltipTrigger>
					<TooltipContent className="flex items-center gap-2 border bg-accent px-2 py-1 font-semibold text-foreground dark:bg-zinc-900">
						<p>Clear selection</p>
						<kbd className="select-none rounded border bg-background px-1.5 py-px font-mono font-normal text-[0.7rem] text-foreground shadow-xs disabled:opacity-50">
							<abbr title="Escape" className="no-underline">
								Esc
							</abbr>
						</kbd>
					</TooltipContent>
				</Tooltip>
			</div>
		</DataTableActionBar>
	);
}
