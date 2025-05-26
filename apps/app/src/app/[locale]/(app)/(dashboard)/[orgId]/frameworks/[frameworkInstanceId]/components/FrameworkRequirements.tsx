"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { useI18n } from "@/locales/client";
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { ColumnDef } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { useMemo, useEffect } from "react";
import type { FrameworkInstanceWithControls } from "../../types";
import type { FrameworkEditorRequirement } from "@comp/db/types";
import { useQueryState } from "nuqs";

interface RequirementItem extends FrameworkEditorRequirement {
	mappedControlsCount: number;
}

export function FrameworkRequirements({
	requirementDefinitions,
	frameworkInstanceWithControls,
}: {
	requirementDefinitions: FrameworkEditorRequirement[];
	frameworkInstanceWithControls: FrameworkInstanceWithControls;
}) {
	const t = useI18n();
	const { orgId, frameworkInstanceId } = useParams<{
		orgId: string;
		frameworkInstanceId: string;
	}>();
	
	// Use query state for search instead of local state
	const [globalFilter, setGlobalFilter] = useQueryState("q", {
		defaultValue: "",
	});

	const items = useMemo(() => {
		return requirementDefinitions.map((def) => {
			const mappedControlsCount =
				frameworkInstanceWithControls.controls.filter(
					(control) =>
						control.requirementsMapped?.some(
							(reqMap) => reqMap.requirementId === def.id,
						) ?? false,
				).length;

			return {
				...def,
				mappedControlsCount,
			};
		});
	}, [requirementDefinitions, frameworkInstanceWithControls.controls]);

	const columns = useMemo<ColumnDef<RequirementItem>[]>(
		() => [
			{
				accessorKey: "name",
				header: ({ column }) => (
					<DataTableColumnHeader column={column} title={t("frameworks.requirements.table.name")} />
				),
				cell: ({ row }) => <span>{row.original.name}</span>,
				enableSorting: true,
				size: 200,
				minSize: 150,
				maxSize: 250,
				enableResizing: true,
			},
			{
				accessorKey: "description",
				header: ({ column }) => (
					<DataTableColumnHeader
						column={column}
						title={t("frameworks.requirements.table.description")}
					/>
				),
				cell: ({ row }) => (
					<span className="block max-w-[500px]">
						{row.original.description}
					</span>
				),
				enableSorting: true,
				size: 500,
				minSize: 300,
				maxSize: 700,
				enableResizing: true,
			},
			{
				accessorKey: "mappedControlsCount",
				header: ({ column }) => (
					<DataTableColumnHeader
						column={column}
						title={t("frameworks.controls.title")}
					/>
				),
				cell: ({ row }) => (
					<span className="text-sm text-muted-foreground">
						{row.original.mappedControlsCount}
					</span>
				),
				enableSorting: true,
				size: 150,
				minSize: 100,
				maxSize: 200,
				enableResizing: true,
			},
		],
		[t],
	);

	const table = useDataTable({
		data: items,
		columns,
		pageCount: 1,
		shallow: false,
		getRowId: (row) => row.id,
		initialState: {
			sorting: [{ id: "name", desc: false }],
		},
	});

	// Set up global filter through the table instance directly
	useEffect(() => {
		table.table.setGlobalFilter(globalFilter);
	}, [globalFilter, table.table]);

	if (!items?.length) {
		return null;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					{t("frameworks.requirements.requirements")} (
					{table.table.getFilteredRowModel().rows.length})
				</CardTitle>
			</CardHeader>
			<CardContent>
				<DataTable
					table={table.table}
					rowClickBasePath={`/${orgId}/frameworks/${frameworkInstanceId}/requirements/`}
					getRowId={(row) => row.id}
				>
					<DataTableToolbar table={table.table}>
						<DataTableSortList table={table.table} align="end" />
					</DataTableToolbar>
				</DataTable>
			</CardContent>
		</Card>
	);
}
