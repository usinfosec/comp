"use client";

import { useI18n } from "@/locales/client";
import { cn } from "@bubba/ui/cn";
import { Icons } from "@bubba/ui/icons";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@bubba/ui/tooltip";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Blocks,
	FileText,
	FlaskConical,
	Gauge,
	ListCheck,
	NotebookText,
	ShieldPlus,
	Store,
	Users,
} from "lucide-react";
// Define menu item types with icon component
type MenuItem = {
	id: string;
	path: string;
	name: string;
	disabled: boolean;
	icon: React.FC<{ size?: number }>;
	protected: boolean;
};

interface ItemProps {
	item: MenuItem;
	isActive: boolean;
	disabled: boolean;
	organizationId: string;
	isCollapsed?: boolean;
}

const Item = ({
	item,
	isActive,
	disabled,
	organizationId,
	isCollapsed = false,
}: ItemProps) => {
	const Icon = item.icon;
	const linkDisabled = disabled || item.disabled;

	// Replace the organizationId placeholder in the path
	const itemPath = item.path.replace(":organizationId", organizationId);

	return (
		<TooltipProvider delayDuration={70}>
			{linkDisabled ? (
				<div className="w-full md:w-[45px] h-[45px] flex items-center justify-start md:justify-center px-3 md:px-0">
					Coming
				</div>
			) : (
				<Link prefetch href={itemPath}>
					<Tooltip>
						<TooltipTrigger className="w-full">
							<div
								className={cn(
									"relative border border-transparent flex items-center",
									isCollapsed ? "md:w-[45px] md:justify-center" : "md:px-3",
									"w-full px-3 md:w-auto h-[45px]",
									"hover:bg-accent hover:border-border",
									"transition-all duration-300",
									isActive &&
										"bg-accent dark:bg-secondary border-border border-r-2 border-r-primary",
								)}
							>
								<div
									className={cn(
										"flex items-center gap-3",
										"transition-all duration-300",
									)}
								>
									{Icon && <Icon size={22} />}
									{!isCollapsed && (
										<span className="text-sm truncate max-w-full">
											{item.name}
										</span>
									)}
								</div>
							</div>
						</TooltipTrigger>
						<TooltipContent
							side="left"
							className={cn(
								"px-3 py-1.5 text-xs",
								isCollapsed ? "flex" : "hidden",
							)}
							sideOffset={10}
						>
							{item.name}
						</TooltipContent>
					</Tooltip>
				</Link>
			)}
		</TooltipProvider>
	);
};

type Props = {
	organizationId: string;
	//userIsAdmin: boolean;
	isCollapsed?: boolean;
};

export function MainMenu({
	organizationId,
	//userIsAdmin,
	isCollapsed = false,
}: Props) {
	const t = useI18n();
	const pathname = usePathname();

	const items: MenuItem[] = [
		{
			id: "overview",
			path: "/:organizationId/overview",
			name: t("sidebar.overview"),
			disabled: false,
			icon: Gauge,
			protected: false,
		},
		{
			id: "evidence",
			path: "/:organizationId/evidence",
			name: t("sidebar.evidence"),
			disabled: false,
			icon: ListCheck,
			protected: false,
		},

		{
			id: "policies",
			path: "/:organizationId/policies",
			name: t("sidebar.policies"),
			disabled: false,
			icon: NotebookText,
			protected: false,
		},
		{
			id: "employees",
			path: "/:organizationId/employees",
			name: t("sidebar.employees"),
			disabled: false,
			icon: Users,
			protected: false,
		},
		{
			id: "risk",
			path: "/:organizationId/risk",
			name: t("sidebar.risk"),
			disabled: false,
			icon: Icons.Risk,
			protected: false,
		},
		{
			id: "vendors",
			path: "/:organizationId/vendors",
			name: t("sidebar.vendors"),
			disabled: false,
			icon: Store,
			protected: false,
		},
		{
			id: "integrations",
			path: "/:organizationId/integrations",
			name: t("sidebar.integrations"),
			disabled: false,
			icon: Blocks,
			protected: true,
		},
		{
			id: "tests",
			path: "/:organizationId/tests",
			name: t("sidebar.tests"),
			disabled: false,
			icon: FlaskConical,
			protected: false,
		},
		{
			id: "settings",
			path: "/:organizationId/settings",
			name: t("sidebar.settings"),
			disabled: false,
			icon: Icons.Settings,
			protected: true,
		},
	];

	// Helper function to check if a path is active
	const isPathActive = (itemPath: string) => {
		const normalizedItemPath = itemPath.replace(
			":organizationId",
			organizationId,
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
			normalizedItemPath === `/${organizationId}/overview`
		) {
			return (
				pathname === `/${organizationId}` ||
				pathname?.startsWith(`/${organizationId}/overview`)
			);
		}

		// Compare the base segments (usually the feature section like "evidence", "settings", etc.)
		return itemBaseSegment === currentBaseSegment;
	};

	return (
		<div className="mt-6">
			<nav>
				<div className={cn("flex flex-col gap-1.5", !isCollapsed && "md:w-56")}>
					{items
						.filter((item) => !item.disabled)
						.map((item) => {
							const isActive = isPathActive(item.path);

							//if (item.protected && !userIsAdmin) {
							//  return null;
							//}

							return (
								<Item
									key={item.id}
									item={item}
									isActive={isActive}
									disabled={item.disabled}
									organizationId={organizationId}
									isCollapsed={isCollapsed}
								/>
							);
						})}
				</div>
			</nav>
		</div>
	);
}
