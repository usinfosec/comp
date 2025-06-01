"use client";

import { authClient, useSession } from "@/utils/auth-client";
import { cn } from "@comp/ui/cn";
import { Icons } from "@comp/ui/icons";
import Link from "next/link";

interface SidebarLogoProps {
	isCollapsed: boolean;
}

export function SidebarLogo({ isCollapsed }: SidebarLogoProps) {
	const { data: session } = useSession();

	return (
		<div className={cn("transition-all duration-300 flex items-center")}>
			<Link href={`/${session?.session?.activeOrganizationId ?? "/"}`} suppressHydrationWarning>
				<Icons.Logo
					width={45}
					height={45}
					className={cn("transition-transform duration-300")}
				/>
			</Link>
		</div>
	);
}
