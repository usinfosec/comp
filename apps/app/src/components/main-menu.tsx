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
				<div className="w-[45px] h-[45px] flex items-center md:justify-center">
					Coming
				</div>
			) : (
				<Link prefetch href={itemPath}>
					<Tooltip>
						<TooltipTrigger className="w-full">
							<div
								className={cn(
									"relative border border-transparent md:w-[45px] h-[45px] flex items-center md:justify-center",
									"hover:bg-accent hover:border-[#DCDAD2] hover:dark:border-[#2C2C2C]",
									isActive &&
										"bg-[#F2F1EF] dark:bg-secondary border-[#DCDAD2] dark:border-[#2C2C2C]",
								)}
							>
								<div className="flex space-x-3 p-0 items-center pl-2 md:pl-0">
									{Icon && <Icon size={22} />}
									{!isCollapsed && (
										<span className="flex md:hidden">{item.name}</span>
									)}
								</div>
							</div>
						</TooltipTrigger>
						<TooltipContent
							side="left"
							className="px-3 py-1.5 text-xs hidden md:flex"
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
	userIsAdmin: boolean;
	isCollapsed?: boolean;
};

export function MainMenu({
	organizationId,
	userIsAdmin,
	isCollapsed = false,
}: Props) {
	const t = useI18n();
	const pathname = usePathname();

	const items: MenuItem[] = [
		{
			id: "overview",
			path: "/:organizationId",
			name: t("sidebar.overview"),
			disabled: false,
			icon: Icons.Overview,
			protected: false,
		},
		{
			id: "evidence",
			path: "/:organizationId/evidence/overview",
			name: t("sidebar.evidence"),
			disabled: false,
			icon: Icons.Evidence,
			protected: false,
		},
		{
			id: "tests",
			path: "/:organizationId/tests",
			name: t("sidebar.tests"),
			disabled: false,
			icon: Icons.CloudSync,
			protected: false,
		},
		{
			id: "policies",
			path: "/:organizationId/policies",
			name: t("sidebar.policies"),
			disabled: false,
			icon: Icons.Policies,
			protected: false,
		},
		{
			id: "people",
			path: "/:organizationId/people",
			name: t("sidebar.people"),
			disabled: false,
			icon: Icons.Peolple,
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
			icon: Icons.Vendors,
			protected: false,
		},
		{
			id: "integrations",
			path: "/:organizationId/integrations",
			name: t("sidebar.integrations"),
			disabled: false,
			icon: Icons.Apps,
			protected: true,
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
				<div className="flex flex-col gap-1.5">
					{items
						.filter((item) => !item.disabled)
						.map((item) => {
							const isActive = isPathActive(item.path);

							if (item.protected && !userIsAdmin) {
								return null;
							}

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
