"use client";

import { useSidebar } from "@/context/sidebar-context";
import { cn } from "@bubba/ui/cn";

interface MainContentProps {
	children: React.ReactNode;
}

export function MainContent({ children }: MainContentProps) {
	const { isCollapsed } = useSidebar();

	return (
		<div
			className={cn(
				"mx-4 pb-8 transition-all duration-300",
				isCollapsed ? "md:ml-[95px]" : "md:ml-[255px]",
				"md:mr-10",
			)}
		>
			{children}
		</div>
	);
}
