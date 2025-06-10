"use client";

import { updateSidebarState } from "@/actions/sidebar";
import { useSidebar } from "@/context/sidebar-context";
import { Button } from "@comp/ui/button";
import { cn } from "@comp/ui/cn";
import { ArrowLeftFromLine, ChevronLeft } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";

interface SidebarCollapseButtonProps {
	isCollapsed: boolean;
}

export function SidebarCollapseButton({
	isCollapsed,
}: SidebarCollapseButtonProps) {
	const router = useRouter();
	const { setIsCollapsed } = useSidebar();

	const { execute } = useAction(updateSidebarState, {
		onSuccess: () => {
			router.refresh();
		},
	});

	const handleToggle = () => {
		// Update local state immediately for responsive UI
		setIsCollapsed(!isCollapsed);
		// Update server state (cookie)
		execute({ isCollapsed: !isCollapsed });
	};

	return (
		<Button
			variant="ghost"
			size="icon"
			className={cn(
				"h-8 w-8 rounded-xs",
				isCollapsed && "shadow-md bg-background ",
				!isCollapsed && "ml-auto mr-4"
			)}
			onClick={handleToggle}
		>
			<ArrowLeftFromLine 
				className={cn(
					"h-4 w-4 shrink-0 transition-transform duration-400 ease-in-out",
					isCollapsed && "rotate-180"
				)} 
			/>
		</Button>
	);
}
