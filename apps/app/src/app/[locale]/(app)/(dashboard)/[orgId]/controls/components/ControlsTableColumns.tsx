"use client";

import { DisplayFrameworkStatus } from "@/components/frameworks/framework-status";
import { useI18n } from "@/locales/client";
import type { Control } from "@bubba/db/types";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getControlStatus } from "../lib/utils";

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
					<Link
						href={`/${params.orgId}/controls/${control.id}`}
						className="hover:underline"
					>
						{control.name}
					</Link>
				);
			},
		},
		{
			accessorKey: "description",
			header: t("controls.table.description"),
			cell: ({ row }) => row.original.description,
		},
		{
			accessorKey: "status",
			header: t("controls.table.status"),
			cell: ({ row }) => {
				const control = row.original;
				const status = getControlStatus(control);
				return <DisplayFrameworkStatus status={status} />;
			},
		},
	];
}
