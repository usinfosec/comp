"use client";

import { changeOrganizationAction } from "@/actions/change-organization";
import { useI18n } from "@/locales/client";
import type { Organization } from "@comp/db/types";
import { Button } from "@comp/ui/button";
import { cn } from "@comp/ui/cn";
import { Dialog } from "@comp/ui/dialog";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@comp/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@comp/ui/popover";
import { Check, ChevronsUpDown, Plus, Search } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreateOrgModal } from "./modals/create-org-modal";

interface OrganizationSwitcherProps {
	organizations: Organization[];
	organization: Organization | null;
	isCollapsed?: boolean;
}

// New component for organization initials avatar
interface OrganizationInitialsAvatarProps {
	name: string | null | undefined;
	isCollapsed?: boolean;
	className?: string;
}

// Define gradients with significantly more hue variation
const BRAND_GRADIENTS = [
	"from-[hsl(155,80%,45%)] to-[hsl(185,90%,55%)]", // Original Green/Cyan to Sky Blue
	"from-[hsl(210,80%,50%)] to-[hsl(240,70%,60%)]", // Medium Blue to Indigo
	"from-[hsl(280,60%,55%)] to-[hsl(310,75%,60%)]", // Purple to Magenta
	"from-[hsl(340,85%,60%)] to-[hsl(10,80%,55%)]",  // Pink/Red to Orange
	"from-[hsl(40,90%,50%)] to-[hsl(60,85%,45%)]",   // Gold to Yellow
];

// Define possible gradient directions
const GRADIENT_DIRECTIONS = [
	"bg-gradient-to-t",
	"bg-gradient-to-tr",
	"bg-gradient-to-r",
	"bg-gradient-to-br",
	"bg-gradient-to-b",
	"bg-gradient-to-bl",
	"bg-gradient-to-l",
	"bg-gradient-to-tl",
];

function OrganizationInitialsAvatar({ name, isCollapsed, className }: OrganizationInitialsAvatarProps) {
	const initials = name?.slice(0, 2).toUpperCase() || '';
	const sizeClasses = isCollapsed ? "h-8 w-8" : "h-8 w-8";
	const textSizeClass = isCollapsed ? "text-sm font-medium" : "text-xs";

	// Calculate color index based on initials
	let colorIndex = 0;
	if (initials.length > 0) {
		const charCodeSum = Array.from(initials)
			.reduce((sum, char) => sum + char.charCodeAt(0), 0);
		colorIndex = charCodeSum % BRAND_GRADIENTS.length;
	}

	// Calculate direction index
	let directionIndex = 0;
	if (initials.length > 0) {
		// Use a slightly different calculation for direction to avoid direct correlation with color
		const charCodeProduct = Array.from(initials)
			.reduce((prod, char) => prod * (char.charCodeAt(0) || 1), 1); // Use product, handle potential 0 char code
		directionIndex = Math.abs(charCodeProduct) % GRADIENT_DIRECTIONS.length;
	}

	// Get the selected colors and direction
	const gradientColors = BRAND_GRADIENTS[colorIndex] || BRAND_GRADIENTS[0];
	const gradientDirection = GRADIENT_DIRECTIONS[directionIndex] || GRADIENT_DIRECTIONS[3]; // Fallback to 'to-br'

	return (
		<div
			className={cn(
				"shrink-0 flex items-center justify-center rounded-sm",
				sizeClasses,
				gradientDirection, // Apply the dynamic direction
				gradientColors, // Apply the dynamic colors
				className, // Allow additional classes to be passed
			)}
		>
			{/* Apply contrasting text color */}
			<span className={cn(textSizeClass, "text-primary-foreground")}>{initials}</span>
		</div>
	);
}

export function OrganizationSwitcher({
	organizations,
	organization,
	isCollapsed = false,
}: OrganizationSwitcherProps) {
	const t = useI18n();
	const router = useRouter();
	const [isComboboxOpen, setIsComboboxOpen] = useState(false);
	const [showCreateOrg, setShowCreateOrg] = useState(false);

	const { execute, status } = useAction(changeOrganizationAction, {
		onSuccess: (result) => {
			const orgId = result.data?.data?.id;
			if (orgId) {
				router.push(`/${orgId}/`);
				setIsComboboxOpen(false);
			}
		},
	});

	const currentOrganization = organization;

	const handleOrgChange = async (org: Organization) => {
		execute({ organizationId: org.id });
	};

	return (
		<div className="w-full">
			<Popover open={isComboboxOpen} onOpenChange={setIsComboboxOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={isComboboxOpen}
						aria-label={t("common.actions.selectOrg")}
						className={cn(
							"flex justify-between mx-auto sha",
							isCollapsed ? "h-min w-min p-0" : "h-10 w-full p-0",
							status === "executing" ? "opacity-50 cursor-not-allowed" : "",
						)}
						disabled={status === "executing"}
					>
						<OrganizationInitialsAvatar
							name={currentOrganization?.name}
							isCollapsed={isCollapsed}
							className={isCollapsed ? "" : "ml-1"} // Apply margin only when not collapsed
						/>
						{!isCollapsed && (
							<span className="text-sm truncate mr-auto ml-2"> {/* Added ml-2 for spacing */}
								{currentOrganization?.name}
							</span>
						)}
						{!isCollapsed && (
							<ChevronsUpDown className="ml-auto mr-2 h-4 w-4 shrink-0 opacity-50" />
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0" align="start">
					<Command>
						<div className="flex items-center border-b px-3">
							<Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
							<CommandInput
								placeholder={t("common.placeholders.searchOrg")}
								className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
							/>
						</div>
						<CommandList>
							<CommandEmpty>{t("common.table.no_results")}</CommandEmpty>
							<CommandGroup className="max-h-[200px] overflow-y-auto">
								{organizations.map((org) => (
									<CommandItem
										key={org.id}
										value={org.name ?? org.id}
										onSelect={() => {
											if (org.id !== currentOrganization?.id) {
												handleOrgChange(org);
											} else {
												setIsComboboxOpen(false);
											}
										}}
										disabled={status === "executing"}
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												currentOrganization?.id === org.id
													? "opacity-100"
													: "opacity-0",
											)}
										/>
										<OrganizationInitialsAvatar
											name={org.name}
											isCollapsed={false} // Always small size in the list
											className="mr-2 h-6 w-6" // Override size for the list item
										/>
										<span className="truncate">{org.name}</span>
									</CommandItem>
								))}
							</CommandGroup>
							<CommandSeparator />
							<CommandGroup>
								<CommandItem
									onSelect={() => {
										setShowCreateOrg(true);
										setIsComboboxOpen(false);
									}}
									className="cursor-pointer"
									disabled={status === "executing"}
								>
									<Plus className="mr-2 h-4 w-4" />
									{t("common.actions.createOrg")}
								</CommandItem>
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>

			<Dialog
				open={showCreateOrg}
				onOpenChange={(open) => setShowCreateOrg(open)}
			>
				<CreateOrgModal
					onOpenChange={(open) => setShowCreateOrg(open)}
				/>
			</Dialog>
		</div>
	);
}
