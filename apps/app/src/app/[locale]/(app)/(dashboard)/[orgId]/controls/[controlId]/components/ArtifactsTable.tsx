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
import type { RelatedArtifact } from "../data/getRelatedArtifacts";

interface ArtifactsTableProps {
	artifacts: RelatedArtifact[];
	orgId: string;
	controlId: string;
}

export function ArtifactsTable({
	artifacts,
	orgId,
	controlId,
}: ArtifactsTableProps) {
	const t = useI18n();
	const [searchTerm, setSearchTerm] = useState("");

	// Define columns for artifacts table
	const columns = useMemo<ColumnDef<RelatedArtifact>[]>(
		() => [
			{
				accessorKey: "name",
				header: ({ column }) => (
					<DataTableColumnHeader
						column={column}
						title={t("frameworks.artifacts.table.name")}
					/>
				),
				cell: ({ row }) => <span>{row.original.name}</span>,
			},
			{
				accessorKey: "type",
				header: ({ column }) => (
					<DataTableColumnHeader
						column={column}
						title={t("frameworks.artifacts.table.type")}
					/>
				),
				cell: ({ row }) => (
					<span className="capitalize">{row.original.type}</span>
				),
			},
			{
				accessorKey: "createdAt",
				header: ({ column }) => (
					<DataTableColumnHeader
						column={column}
						title={t("frameworks.artifacts.table.created_at")}
					/>
				),
				cell: ({ row }) => (
					<span>{new Date(row.original.createdAt).toLocaleDateString()}</span>
				),
			},
		],
		[t],
	);

	// Filter artifacts data based on search term
	const filteredArtifacts = useMemo(() => {
		if (!searchTerm.trim()) return artifacts;

		const searchLower = searchTerm.toLowerCase();
		return artifacts.filter(
			(artifact) =>
				artifact.id.toLowerCase().includes(searchLower) ||
				artifact.name.toLowerCase().includes(searchLower) ||
				artifact.type.toLowerCase().includes(searchLower),
		);
	}, [artifacts, searchTerm]);

	// Set up the artifacts table
	const table = useDataTable({
		data: filteredArtifacts,
		columns,
		pageCount: 1,
		shallow: false,
		getRowId: (row) => row.id,
		initialState: {
			sorting: [{ id: "createdAt", desc: true }],
		},
	});

	return (
		<>
			<h2 className="text-lg font-semibold mb-4">
				{t("frameworks.artifacts.title")} ({filteredArtifacts.length})
			</h2>
			<div className="flex items-center mb-4">
				<Input
					placeholder={t("frameworks.artifacts.search.universal_placeholder")}
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
				rowClickBasePath={`/${orgId}/controls/${controlId}/artifacts`}
				getRowId={(row) => row.id}
			/>
		</>
	);
}
