"use client";

import { authClient } from "@/utils/auth-client";
import { Badge } from "@comp/ui/badge";
import { Button } from "@comp/ui/button";
import { cn } from "@comp/ui/cn";
import { Icons } from "@comp/ui/icons";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@comp/ui/tooltip";
import {
	Blocks,
	FlagIcon,
	FlaskConical,
	Gauge,
	ListCheck,
	NotebookText,
	ShieldEllipsis,
	Store,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Define menu item types with icon component
type MenuItem = {
	id: string;
	path: string;
	name: string;
	disabled: boolean;
	icon: React.FC<{ size?: number }>;
	protected: boolean;
	badge?: {
		text: string;
		variant: "default" | "secondary" | "outline" | "destructive";
	};
	hidden?: boolean;
};

interface ItemProps {
	organizationId: string;
	item: MenuItem;
	isActive: boolean;
	disabled: boolean;
	isCollapsed?: boolean;
	onItemClick?: () => void;
}

export function MainMenu({
	organizationId,
	isCollapsed = false,
	onItemClick,
}: Props) {
	const pathname = usePathname();

	const items: MenuItem[] = [
		{
			id: "frameworks",
			path: "/:organizationId/frameworks",
			name: "Frameworks",
			disabled: false,
			icon: Gauge,
			protected: false,
		},
		{
			id: "controls",
			path: "/:organizationId/controls",
			name: "Controls",
			disabled: false,
			icon: ShieldEllipsis,
			protected: false,
		},
		{
			id: "policies",
			path: "/:organizationId/policies",
			name: "Policies",
			disabled: false,
			icon: NotebookText,
			protected: false,
		},
		{
			id: "tasks",
			path: "/:organizationId/tasks",
			name: "Tasks",
			disabled: false,
			icon: ListCheck,
			protected: false,
		},
		{
			id: "people",
			path: "/:organizationId/people/all",
			name: "People",
			disabled: false,
			icon: Users,
			protected: false,
		},
		{
			id: "risk",
			path: "/:organizationId/risk",
			name: "Risks",
			disabled: false,
			icon: Icons.Risk,
			protected: false,
		},
		{
			id: "vendors",
			path: "/:organizationId/vendors",
			name: "Vendors",
			disabled: false,
			icon: Store,
			protected: false,
		},
		{
			id: "tests",
			path: "/:organizationId/tests",
			name: "Cloud Tests",
			disabled: false,
			icon: FlaskConical,
			protected: false,
		},
		{
			id: "integrations",
			path: "/:organizationId/integrations",
			name: "Integrations",
			disabled: false,
			icon: Blocks,
			protected: true,
			badge: {
				text: "Beta",
				variant: "secondary",
			},
		},
		{
			id: "settings",
			path: "/:organizationId/settings",
			name: "Settings",
			disabled: false,
			icon: Icons.Settings,
			protected: true,
		},
	];

	// Helper function to check if a path is active
	const isPathActive = (itemPath: string) => {
		const normalizedItemPath = itemPath.replace(
			":organizationId",
			organizationId ?? "",
		);

		// Extract the base path from the menu item (first two segments after normalization)
		const itemPathParts = normalizedItemPath.split("/").filter(Boolean);
		const itemBaseSegment = itemPathParts.length > 1 ? itemPathParts[1] : "";

		// Extract the current path parts
		const currentPathParts = pathname.split("/").filter(Boolean);
		const currentBaseSegment =
			currentPathParts.length > 1 ? currentPathParts[1] : "";

		// Special case for root organization path
		if (
			normalizedItemPath === `/${organizationId}` ||
			normalizedItemPath === `/${organizationId}/implementation`
		) {
			return (
				pathname === `/${organizationId}` ||
				pathname?.startsWith(`/${organizationId}/implementation`)
			);
		}

		return itemBaseSegment === currentBaseSegment;
	};

	return (
		<nav className="space-y-1 p-2">
			{items
				.filter((item) => !item.disabled && !item.hidden)
				.map((item) => {
					const isActive = isPathActive(item.path);
					return (
						<Item
							key={item.id}
							organizationId={organizationId ?? ""}
							item={item}
							isActive={isActive}
							disabled={item.disabled}
							isCollapsed={isCollapsed}
							onItemClick={onItemClick}
						/>
					);
				})}
		</nav>
	);
}

const Item = ({
	organizationId,
	item,
	isActive,
	disabled,
	isCollapsed = false,
	onItemClick,
}: ItemProps) => {
	const Icon = item.icon;
	const linkDisabled = disabled || item.disabled;
	const itemPath = item.path.replace(":organizationId", organizationId);

	if (linkDisabled) {
		return (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size={isCollapsed ? "icon" : "default"}
							className="w-full justify-start opacity-50 cursor-not-allowed"
							disabled
						>
							<Icon size={16} />
							{!isCollapsed && (
								<span className="ml-2 truncate">Coming Soon</span>
							)}
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right" className={isCollapsed ? "block" : "hidden"}>
						Coming Soon
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant={isActive ? "secondary" : "ghost"}
						size={isCollapsed ? "icon" : "default"}
						className={cn(
							"w-full justify-start",
							isActive && "bg-accent font-medium"
						)}
						asChild
					>
						<Link href={itemPath} onClick={onItemClick}>
							<Icon size={16} />
							{!isCollapsed && (
								<>
									<span className="ml-2 truncate flex-1 text-left">
										{item.name}
									</span>
									{item.badge && (
										<Badge
											variant={item.badge.variant}
											className="ml-auto text-xs"
										>
											{item.badge.text}
										</Badge>
									)}
								</>
							)}
						</Link>
					</Button>
				</TooltipTrigger>
				<TooltipContent 
					side="right" 
					className={isCollapsed ? "block" : "hidden"}
					sideOffset={8}
				>
					<div className="flex items-center gap-2">
						{item.name}
						{item.badge && (
							<Badge variant={item.badge.variant} className="text-xs">
								{item.badge.text}
							</Badge>
						)}
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

type Props = {
	organizationId: string;
	isCollapsed?: boolean;
	onItemClick?: () => void;
};
