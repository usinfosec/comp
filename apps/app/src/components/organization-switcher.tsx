"use client";

import { changeOrganizationAction } from "@/actions/change-organization";
import type { Organization } from "@bubba/db/types";
import { Button } from "@bubba/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@bubba/ui/dropdown-menu";
import { Building2, ChevronDown, Plus } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";

interface OrganizationSwitcherProps {
	organizations: Organization[];
	organizationId: string | undefined;
}

export function OrganizationSwitcher({
	organizations,
	organizationId,
}: OrganizationSwitcherProps) {
	const router = useRouter();

	const { execute } = useAction(changeOrganizationAction, {
		onSuccess: (result) => {
			if (result.data?.success) {
				router.push(`/${result.data.data?.id}`);
			}
		},
		onError: (error) => {
			console.error(error);
		},
	});

	const handleOrganizationChange = async (organizationId: string) => {
		execute({ organizationId });
	};

	const currentOrganization = organizations.find(
		(org) => org.id === organizationId,
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="flex items-center gap-2">
					<Building2 className="h-4 w-4" />
					<span className="hidden md:inline-block">
						{currentOrganization?.name}
					</span>
					<ChevronDown className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-52">
				{organizations.map((org) => (
					<DropdownMenuItem
						key={org.id}
						onClick={() => handleOrganizationChange(org.id)}
						className="flex items-center gap-2 cursor-pointer"
					>
						<span>{org.name}</span>
					</DropdownMenuItem>
				))}
				<DropdownMenuItem
					className="flex items-center gap-2 cursor-pointer"
					onClick={() => {
						router.push("/setup");
					}}
				>
					<Plus className="h-4 w-4" />
					<span>Create new org</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
