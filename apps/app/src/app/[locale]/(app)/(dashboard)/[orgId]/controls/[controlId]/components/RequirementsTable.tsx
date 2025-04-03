"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useI18n } from "@/locales/client";
import { DataTable } from "@/components/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { Input } from "@comp/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import type { FrameworkId, RequirementMap } from "@comp/db/types";
import { getRequirementDetails } from "../../../frameworks/lib/getRequirementDetails";

interface RequirementsTableProps {
	requirements: RequirementMap[];
	orgId: string;
}

export function RequirementsTable({
	requirements,
	orgId,
}: RequirementsTableProps) {
	const t = useI18n();
	const [searchTerm, setSearchTerm] = useState("");

	// Define columns for requirements table
	const columns = useMemo<ColumnDef<RequirementMap>[]>(
		() => [
			{
				accessorKey: "requirementId",
				header: ({ column }) => (
					<DataTableColumnHeader
						column={column}
						title={t("frameworks.requirements.table.id")}
					/>
				),
				cell: ({ row }) => {
					const requirementId = row.original.requirementId.split("_").pop();
					return <span className="font-mono text-xs">{requirementId}</span>;
				},
			},
			{
				accessorKey: "name",
				header: ({ column }) => (
					<DataTableColumnHeader
						column={column}
						title={t("frameworks.requirements.table.name")}
					/>
				),
				cell: ({ row }) => {
					const [frameworkId, requirementId] =
						row.original.requirementId.split("_");
					const details = getRequirementDetails(
						frameworkId as FrameworkId,
						requirementId,
					);
					return <span>{details?.name}</span>;
				},
			},
			{
				accessorKey: "description",
				header: ({ column }) => (
					<DataTableColumnHeader
						column={column}
						title={t("frameworks.requirements.table.description")}
					/>
				),
				cell: ({ row }) => {
					const [frameworkId, requirementId] =
						row.original.requirementId.split("_");
					const details = getRequirementDetails(
						frameworkId as FrameworkId,
						requirementId,
					);
					return (
						<span className="text-muted-foreground">
							{details?.description}
						</span>
					);
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
			const [frameworkId, requirementId] = req.requirementId.split("_");
			const details = getRequirementDetails(
				frameworkId as FrameworkId,
				requirementId,
			);

			// Search in ID, name, and description
			return (
				requirementId.toLowerCase().includes(searchLower) ||
				details?.name?.toLowerCase().includes(searchLower) ||
				false ||
				details?.description?.toLowerCase().includes(searchLower) ||
				false
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
			sorting: [{ id: "requirementId", desc: false }],
		},
	});

	return (
		<>
			<h2 className="text-lg font-semibold mb-4">
				{t("frameworks.requirements.title")} ({filteredRequirements.length})
			</h2>
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
				rowClickBasePath={`/${orgId}/frameworks`}
				getRowId={(row) => {
					const [_, requirementId] = row.requirementId.split("_");
					return `${row.frameworkInstanceId}/requirements/${requirementId}`;
				}}
			/>
		</>
	);
}
