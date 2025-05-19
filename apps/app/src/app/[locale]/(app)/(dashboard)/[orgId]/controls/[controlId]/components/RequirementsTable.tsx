"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { useDataTable } from "@/hooks/use-data-table";
import { useI18n } from "@/locales/client";
import type {
	FrameworkEditorFramework,
	FrameworkEditorRequirement,
	FrameworkInstance,
	RequirementMap,
} from "@comp/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { Input } from "@comp/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

interface RequirementsTableProps {
	requirements: (RequirementMap & { frameworkInstance: FrameworkInstance & { framework: FrameworkEditorFramework },
	requirement: FrameworkEditorRequirement })[];
	orgId: string;
}

	export function RequirementsTable({
		requirements,
	orgId,
}: RequirementsTableProps) {
	const t = useI18n();
	const [searchTerm, setSearchTerm] = useState("");

	// Define columns for requirements table
	const columns = useMemo<
		ColumnDef<RequirementMap & { frameworkInstance: FrameworkInstance & { framework: FrameworkEditorFramework }, requirement: FrameworkEditorRequirement }>[]
	>(
		() => [
			{
				id: "reqName",
				accessorKey: "requirement.name",
				header: ({ column }) => (
					<DataTableColumnHeader
						column={column}
						title={t("frameworks.requirements.table.name")}
					/>
				),
				cell: ({ row }) => {
					return (
						<span>
							{row.original.requirement.name}
						</span>
					);
				},
				enableSorting: true,
				sortingFn: (rowA, rowB, columnId) => {
					const nameA = rowA.original.requirement.name || "";
					const nameB = rowB.original.requirement.name || "";

					return nameA.localeCompare(nameB);
				},
			},
			{
				id: "reqDescription",
				accessorKey: "requirement.description",
				header: ({ column }) => (
					<DataTableColumnHeader
						column={column}
						title={t("frameworks.requirements.table.description")}
					/>
				),
				cell: ({ row }) => {
					return (
						<span className="text-muted-foreground">
							{row.original.requirement.description}
						</span>
					);
				},
				enableSorting: true,
				sortingFn: (rowA, rowB, columnId) => {
					const descA = rowA.original.requirement.description || "";
					const descB = rowB.original.requirement.description || "";

					return descA.localeCompare(descB);
				},
			},
		],
		[t],
	);

	// Filter requirements data based on search term
	const filteredRequirements = useMemo(() => {
		if (!searchTerm.trim()) return requirements;

		const searchLower = searchTerm.toLowerCase();
		return requirements.filter((req) => {
			// Search in ID, name, and description from the nested requirement object
			return (
				(req.requirement.id?.toLowerCase() || "").includes(searchLower) ||
				(req.requirement.name?.toLowerCase() || "").includes(searchLower) ||
				(req.requirement.description?.toLowerCase() || "").includes(searchLower) ||
				(req.requirement.identifier?.toLowerCase() || "").includes(searchLower) // Also search identifier
			);
		});
	}, [requirements, searchTerm]);

	// Set up the requirements table
	const table = useDataTable({
		data: filteredRequirements,
		columns,
		pageCount: 1,
		shallow: false,
		getRowId: (row) => row.id,
		initialState: {
			// No default sorting to avoid type issues
		},
		tableId: "r",
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					{t("frameworks.requirements.title")} (
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
						<DataTableSortList
							table={table.table}
							align="end"
							tableId="r"
						/>
					</div>
				</div>
				<DataTable
					table={table.table}
					rowClickBasePath={`/${orgId}/frameworks`}
					getRowId={(row) => {
						// This constructs the path to the specific requirement page
						// row.requirementId is the FrameworkEditorRequirement.id (e.g. frk_rq_...)
						// row.frameworkInstanceId is the ID of the FrameworkInstance
						return `${row.frameworkInstanceId}/requirements/${row.requirementId}`;
					}}
					tableId={"r"}
				/>
			</CardContent>
		</Card>
	);
}
