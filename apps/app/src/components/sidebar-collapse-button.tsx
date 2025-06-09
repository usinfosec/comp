"use client";

import { updateSidebarState } from "@/actions/sidebar";
import { useSidebar } from "@/context/sidebar-context";
import { Button } from "@comp/ui/button";
import { Icons } from "@comp/ui/icons";
import { useAction } from "next-safe-action/hooks";

interface SidebarCollapseButtonProps {
	isCollapsed: boolean;
}

export function SidebarCollapseButton({
	isCollapsed,
}: SidebarCollapseButtonProps) {
	const { setIsCollapsed } = useSidebar();

	const { execute } = useAction(updateSidebarState, {
		onError: () => {
			// Revert the optimistic update if the server action fails
			setIsCollapsed(isCollapsed);
		},
	});

	const handleToggle = () => {
		// Update local state immediately for responsive UI
		setIsCollapsed(!isCollapsed);
		// Update server state (cookie) in the background
		execute({ isCollapsed: !isCollapsed });
	};

	if (isCollapsed) {
		return (
			<Button
				variant="ghost"
				size="sm"
				className="h-8 w-8 rounded-xs shadow-md bg-background"
				onClick={handleToggle}
			>
				<Icons.ChevronRight className="h-4 w-4 shrink-0" />
			</Button>
		);
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			className="h-8 w-8"
			onClick={handleToggle}
		>
			<Icons.ChevronLeft className="h-4 w-4" />
		</Button>
	);
}
