"use client";

import { Button } from "@bubba/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@bubba/ui/dropdown-menu";
import { Building2, ChevronDown, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface Organization {
	id: string;
	name: string;
}

interface OrganizationSwitcherProps {
	organizations: Organization[];
	currentOrganization: Organization;
}

export function OrganizationSwitcher({
	organizations,
	currentOrganization,
}: OrganizationSwitcherProps) {
	const router = useRouter();

	const handleOrganizationChange = (organizationId: string) => {
		router.push(`/organization/${organizationId}`);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="flex items-center gap-2">
					<Building2 className="h-4 w-4" />
					<span className="hidden md:inline-block">
						{currentOrganization.name}
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
