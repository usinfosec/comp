"use client";

import { updateMenuAction } from "@/actions/update-menu-action";
import { useI18n } from "@/locales/client";
import { useMenuStore } from "@/store/menu";
import { Button } from "@bubba/ui/button";
import { cn } from "@bubba/ui/cn";
import { Icons } from "@bubba/ui/icons";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@bubba/ui/tooltip";
import { useClickAway } from "@uidotdev/usehooks";
import { Reorder, motion, useMotionValue } from "framer-motion";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLongPress } from "use-long-press";

// Define menu item types with icon component
type MenuItem = {
	id: string;
	path: string;
	name: string;
	disabled: boolean;
	icon: React.FC<{ size?: number }>;
	protected: boolean;
};

// Map of menu item IDs to their icon components
const menuIcons = {
	overview: Icons.Overview,
	settings: Icons.Settings,
	policies: Icons.Policies,
	risk: Icons.Risk,
	vendors: Icons.Vendors,
	integrations: Icons.Apps,
	people: Icons.Peolple,
	evidence: Icons.Evidence,
	tests: Icons.CloudSync,
};

interface ItemProps {
	item: MenuItem;
	isActive: boolean;
	isCustomizing: boolean;
	onRemove: (id: string) => void;
	disableRemove: boolean;
	onDragEnd: () => void;
	onSelect?: () => void;
	disabled: boolean;
	organizationId: string;
}

const Item = ({
	item,
	isActive,
	isCustomizing,
	onRemove,
	disableRemove,
	onDragEnd,
	onSelect,
	disabled,
	organizationId,
}: ItemProps) => {
	const y = useMotionValue(0);
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
				<Link
					prefetch
					href={itemPath}
					onClick={(evt) => {
						if (isCustomizing) {
							evt.preventDefault();
						}
						onSelect?.();
					}}
					onMouseDown={(evt) => {
						if (isCustomizing) {
							evt.preventDefault();
						}
					}}
				>
					<Tooltip>
						<TooltipTrigger className="w-full">
							<Reorder.Item
								onDragEnd={onDragEnd}
								key={item.id}
								value={item}
								id={item.id}
								style={{ y }}
								layoutRoot
								className={cn(
									"relative border border-transparent md:w-[45px] h-[45px] flex items-center md:justify-center",
									"hover:bg-accent hover:border-[#DCDAD2] hover:dark:border-[#2C2C2C]",
									isActive &&
										"bg-[#F2F1EF] dark:bg-secondary border-[#DCDAD2] dark:border-[#2C2C2C]",
									isCustomizing &&
										"bg-background border-[#DCDAD2] dark:border-[#2C2C2C]",
								)}
							>
								<motion.div
									className="relative"
									initial={{ opacity: 1 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
								>
									{!disableRemove && isCustomizing && (
										<Button
											onClick={() => onRemove(item.id)}
											variant="ghost"
											size="icon"
											className="absolute -left-4 -top-4 w-4 h-4 p-0 rounded-full bg-border hover:bg-border hover:scale-150 z-10 transition-all"
										>
											<Icons.Remove className="w-3 h-3" />
										</Button>
									)}

									<div
										className={cn(
											"flex space-x-3 p-0 items-center pl-2 md:pl-0",
											isCustomizing &&
												"animate-[jiggle_0.3s_ease-in-out_infinite] transform-gpu pointer-events-none",
										)}
									>
										{Icon && <Icon size={22} />}
										<span className="flex md:hidden">{item.name}</span>
									</div>
								</motion.div>
							</Reorder.Item>
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

const listVariant = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.04,
		},
	},
};

const itemVariant = {
	hidden: { opacity: 0 },
	show: { opacity: 1 },
};

type Props = {
	initialItems?: MenuItem[];
	onSelect?: () => void;
	organizationId: string;
	userIsAdmin: boolean;
};

export function MainMenu({
	initialItems,
	onSelect,
	organizationId,
	userIsAdmin,
}: Props) {
	const t = useI18n();

	const defaultItems: MenuItem[] = [
		{
			id: "overview",
			path: "/:organizationId/overview",
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
			id: "employees",
			path: "/:organizationId/employees/dashboard",
			name: t("sidebar.employees"),
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

	const [items, setItems] = useState(initialItems ?? defaultItems);
	const { isCustomizing, setCustomizing } = useMenuStore();
	const pathname = usePathname();

	const updateMenu = useAction(updateMenuAction);

	const hiddenItems = defaultItems.filter(
		(item) => !items.some((i) => i.id === item.id),
	);

	const onReorder = (items: MenuItem[]) => {
		setItems(items);
	};

	const onDragEnd = () => {
		updateMenu.execute(items);
	};

	const onRemove = (id: string) => {
		const updatedItems = items.filter((item) => item.id !== id);
		setItems(updatedItems);
		updateMenu.execute(updatedItems);
	};

	const onAdd = (item: MenuItem) => {
		const updatedItems = [...items, item];
		setItems(updatedItems);
		updateMenu.execute(updatedItems);
	};

	const bind = useLongPress(
		() => {
			setCustomizing(true);
		},
		{
			cancelOnMovement: 0,
		},
	);

	const ref = useClickAway(() => {
		setCustomizing(false);
	});

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
		<div
			className="mt-6"
			{...bind()}
			ref={ref as React.RefObject<HTMLDivElement>}
		>
			<nav>
				<Reorder.Group
					axis="y"
					onReorder={onReorder}
					values={items}
					className="flex flex-col gap-1.5"
				>
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
									isCustomizing={isCustomizing}
									onRemove={onRemove}
									disableRemove={items.length === 1}
									onDragEnd={onDragEnd}
									onSelect={onSelect}
									disabled={item.disabled}
									organizationId={organizationId}
								/>
							);
						})}
				</Reorder.Group>
			</nav>

			{hiddenItems.length > 0 && isCustomizing && (
				<nav className="border-t-[1px] mt-6 pt-6">
					<motion.ul
						variants={listVariant}
						initial="hidden"
						animate="show"
						className="flex flex-col gap-1.5"
					>
						{hiddenItems
							.filter((item) => !item.disabled)
							.map((item) => {
								const Icon = item.icon;

								return (
									<motion.li
										variants={itemVariant}
										key={item.id}
										className={cn(
											"border border-transparent w-[45px] h-[45px] flex items-center md:justify-center",
											"hover:bg-secondary hover:border-[#DCDAD2] hover:dark:border-[#2C2C2C]",
											"bg-background border-[#DCDAD2] dark:border-[#2C2C2C]",
										)}
									>
										<div className="relative">
											<Button
												onClick={() => onAdd(item)}
												variant="ghost"
												size="icon"
												className="absolute -left-4 -top-4 w-4 h-4 p-0 rounded-full bg-border hover:bg-border hover:scale-150 z-10 transition-all"
											>
												<Icons.Add className="w-3 h-3" />
											</Button>

											<Icon size={22} />
										</div>
									</motion.li>
								);
							})}
					</motion.ul>
				</nav>
			)}
		</div>
	);
}
