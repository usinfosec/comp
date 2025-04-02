"use client";

import { DisplayFrameworkStatus } from "@/components/frameworks/framework-status";
import { useI18n } from "@/locales/client";
import type { Control } from "@bubba/db/types";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getControlStatus } from "../../lib/utils";

export type ControlTableType = Control & {
	artifacts: {
		policy: { status: string } | null;
		evidence: { published: boolean } | null;
	}[];
	requirementsMapped: any[];
};

export function ControlsTableColumns(): ColumnDef<ControlTableType>[] {
	const t = useI18n();
	const params = useParams();

	return [
		{
			accessorKey: "name",
			header: t("controls.table.name"),
			cell: ({ row }) => {
				const control = row.original;
				return (
					<div className="min-w-[200px]">
						<Link
							href={`/${params.locale}/${params.orgId}/controls/${control.id}`}
							className="hover:underline"
						>
							{control.name}
						</Link>
					</div>
				);
			},
		},
		{
			accessorKey: "description",
			header: t("controls.table.description"),
			cell: ({ row }) => (
				<div className="min-w-[300px] max-w-[500px] truncate">
					{row.original.description}
				</div>
			),
		},
		{
			accessorKey: "status",
			header: t("controls.table.status"),
			cell: ({ row }) => {
				const control = row.original;
				const status = getControlStatus(control);
				return (
					<div className="min-w-[120px]">
						<DisplayFrameworkStatus status={status} />
					</div>
				);
			},
		},
		{
			accessorKey: "requirementsMapped",
			header: t("frameworks.controls.table.requirements"),
			cell: ({ row }) => {
				const control = row.original;
				return (
					<div className="min-w-[100px] text-sm text-muted-foreground">
						{control.requirementsMapped.length}
					</div>
				);
			},
		},
	];
}
