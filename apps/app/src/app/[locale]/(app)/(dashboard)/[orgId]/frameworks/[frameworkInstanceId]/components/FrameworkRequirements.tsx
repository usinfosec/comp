"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { useDataTable } from "@/hooks/use-data-table";
import { useI18n } from "@/locales/client";
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { Input } from "@comp/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { FrameworkInstanceWithControls } from "../../types";
import type { FrameworkEditorRequirement } from "@comp/db/types";

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
	const [searchTerm, setSearchTerm] = useState("");

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

	const filteredRequirements = useMemo(() => {
		if (!items?.length) return [];
		if (!searchTerm.trim()) return items;

		const searchLower = searchTerm.toLowerCase();
		return items.filter(
			(requirement) =>
				(requirement.id?.toLowerCase() || "").includes(searchLower) ||
				(requirement.name?.toLowerCase() || "").includes(searchLower) ||
				(requirement.description?.toLowerCase() || "").includes(searchLower) ||
				(requirement.identifier?.toLowerCase() || "").includes(searchLower)
		);
	}, [items, searchTerm]);

	const table = useDataTable({
		data: filteredRequirements,
		columns,
		pageCount: 1,
		shallow: false,
		getRowId: (row) => row.id,
		initialState: {
			sorting: [{ id: "name", desc: false }],
		},
	});

	if (!items?.length) {
		return null;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					{t("frameworks.requirements.requirements")} (
					{filteredRequirements.length})
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex items-center mb-4">
					<Input
						placeholder={t(
							"frameworks.requirements.search.universal_placeholder",
						)}
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="max-w-sm"
					/>
					<div className="ml-auto">
						<DataTableSortList table={table.table} align="end" />
					</div>
				</div>
				<DataTable
					table={table.table}
					rowClickBasePath={`/${orgId}/frameworks/${frameworkInstanceId}/requirements/`}
					getRowId={(row) => row.id}
				/>
			</CardContent>
		</Card>
	);
}
