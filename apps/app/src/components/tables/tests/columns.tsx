"use client";

import { formatDate } from "@/utils/format";
import { Button } from "@bubba/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@bubba/ui/badge";
import Image from "next/image";
import { integrations } from "@bubba/integrations";
import { AssignedUser } from "@/components/assigned-user";

export interface TestType {
	id: string;
	severity: string | null;
	result: string;
	title: string;
	provider: string;
	createdAt: string;
	assignedUser: {
		id: string;
		name: string | null;
		image: string | null;
	} | null;
}

const getSeverityBadge = (severity: string | null) => {
	if (!severity) return <Badge>Unknown</Badge>;
	
	switch(severity.toUpperCase()) {
		case "LOW":
			return <Badge className="bg-muted-foreground">{severity}</Badge>;
		case "MEDIUM":
			return <Badge className="bg-white">{severity}</Badge>;
		case "HIGH":
			return <Badge className="bg-blue-500">{severity}</Badge>;
		case "CRITICAL":
			return <Badge className="bg-red-500">{severity}</Badge>;
		default:
			return <Badge>{severity}</Badge>;
	}
}

const getResultsBadge = (status: string) => {
	switch(status.toUpperCase()) {
		case "PASSED":
			return <Badge className="bg-green-500">{status}</Badge>;
		case "IN_PROGRESS":
			return <Badge className="bg-yellow-500">{status}</Badge>;
		case "FAILED":
			return <Badge className="bg-red-500">{status}</Badge>;
		default:
			return <Badge>{status}</Badge>;
	}
};

const getProviderLogo = (provider: string): string => {
	const integration = integrations.find((i) => i.id === provider);
	return typeof integration?.logo === 'string' ? integration.logo : '';
};

export function columns(): ColumnDef<TestType>[] {
	const { orgId } = useParams<{ orgId: string }>();

	return [
		{
			id: "severity",
			accessorKey: "severity",
			cell: ({ row }) => {
				return getSeverityBadge(row.original.severity);
			},
		},
		{
			id: "result",
			accessorKey: "result",
			cell: ({ row }) => {
				return getResultsBadge(row.original.result);
			},
		},
		{
			id: "title",
			accessorKey: "title",
			cell: ({ row }) => {
				const title = row.original.title;
				const id = row.original.id;

				return (
					<div className="flex flex-col gap-1">
						<Button variant="link" className="p-0 justify-start" asChild>
							<Link href={`/${orgId}/tests/all/${id}`}>
								<span className="truncate">{title}</span>
							</Link>
						</Button>
					</div>
				);
			},
		},
		{
			id: "provider",
			accessorKey: "provider",
			cell: ({ row }) => {
				const provider = row.original.provider;
				const logo = getProviderLogo(provider);
				
				return (
					<div className="flex items-center gap-2">
						{logo && (
							<Image 
								src={logo} 
								alt={provider} 
								width={20} 
								height={20} 
								className="rounded-sm"
							/>
						)}
						<span>{provider}</span>
					</div>
				);
			},
		},
		{
			id: "createdAt",
			accessorKey: "createdAt",
			cell: ({ row }) => {
				const date = row.original.createdAt;

				return (
					<div className="text-muted-foreground">
						{formatDate(date, "MMM d, yyyy")}
					</div>
				);
			},
		},
		{
			id: "assignedUser",
			accessorKey: "assignedUser",
			cell: ({ row }) => {
				const assignedUser = row.original.assignedUser;
				if (!assignedUser) {
					return (
						<span className="text-muted-foreground text-sm">
							Not assigned
						</span>
					);
				}
				return (
					<AssignedUser
						avatarUrl={assignedUser.image}
						fullName={assignedUser.name}
					/>
				);
			},
		},
	];
}
