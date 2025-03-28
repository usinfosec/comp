"use client";

import { Icons } from "@bubba/ui/icons";
import { cn } from "@bubba/ui/cn";
import Link from "next/link";

interface SidebarLogoProps {
	isCollapsed: boolean;
	organizationId: string;
}

export function SidebarLogo({ isCollapsed, organizationId }: SidebarLogoProps) {
	return (
		<div
			className={cn(
				"transition-all duration-300 flex items-center",
				isCollapsed ? "w-full justify-center scale-110 transform-gpu" : "ml-2",
			)}
		>
			<Link href={`/${organizationId}`}>
				<Icons.Logo
					className={cn(
						"transition-transform duration-300",
						isCollapsed && "scale-110",
					)}
				/>
			</Link>
		</div>
	);
}
