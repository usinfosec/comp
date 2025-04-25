"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Lock, X } from "lucide-react";
import type { Role } from "@prisma/client";

import { cn } from "@comp/ui/cn";
import { useI18n } from "@/locales/client";
import { Badge } from "@comp/ui/badge";
import { Button } from "@comp/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@comp/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@comp/ui/popover";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@comp/ui/tooltip";

// Define the selectable roles explicitly (exclude owner)
const selectableRoles: {
	value: Role;
	labelKey: string;
	descriptionKey: string;
}[] = [
	{
		value: "owner",
		labelKey: "people.roles.owner",
		descriptionKey: "people.roles.owner_description",
	},
	{
		value: "admin",
		labelKey: "people.roles.admin",
		descriptionKey: "people.roles.admin_description",
	},
	{
		value: "employee",
		labelKey: "people.roles.employee",
		descriptionKey: "people.roles.employee_description",
	},
	{
		value: "auditor",
		labelKey: "people.roles.auditor",
		descriptionKey: "people.roles.auditor_description",
	},
];

interface MultiRoleComboboxProps {
	selectedRoles: Role[];
	onSelectedRolesChange: (roles: Role[]) => void;
	placeholder?: string;
	disabled?: boolean;
	lockedRoles?: Role[]; // Roles that cannot be deselected
}

export function MultiRoleCombobox({
	selectedRoles: inputSelectedRoles,
	onSelectedRolesChange,
	placeholder,
	disabled = false,
	lockedRoles = [],
}: MultiRoleComboboxProps) {
	const t = useI18n();
	const [open, setOpen] = React.useState(false);
	const [searchTerm, setSearchTerm] = React.useState("");

	// Process selected roles to handle comma-separated values
	const selectedRoles = React.useMemo(() => {
		return inputSelectedRoles.flatMap((role) =>
			typeof role === "string" && role.includes(",")
				? (role.split(",") as Role[])
				: [role],
		);
	}, [inputSelectedRoles]);

	const isOwner = selectedRoles.includes("owner");

	// Filter out owner role for non-owners
	const availableRoles = React.useMemo(() => {
		return selectableRoles.filter(
			(role) => role.value !== "owner" || isOwner,
		);
	}, [isOwner]);

	const handleSelect = (roleValue: Role) => {
		// Never allow owner role to be changed
		if (roleValue === "owner") {
			return;
		}

		// If the role is locked, don't allow deselection
		if (
			lockedRoles.includes(roleValue) &&
			selectedRoles.includes(roleValue)
		) {
			return; // Don't allow deselection of locked roles
		}

		// Allow removal of any non-locked role, even if it's the last one
		const newSelectedRoles = selectedRoles.includes(roleValue)
			? selectedRoles.filter((r) => r !== roleValue)
			: [...selectedRoles, roleValue];
		onSelectedRolesChange(newSelectedRoles);
	};

	const getRoleLabel = (roleValue: Role) => {
		switch (roleValue) {
			case "owner":
				return t("people.roles.owner");
			case "admin":
				return t("people.roles.admin");
			case "auditor":
				return t("people.roles.auditor");
			case "employee":
				return t("people.roles.employee");
			default:
				return roleValue;
		}
	};

	const triggerText =
		selectedRoles.length > 0
			? `${selectedRoles.length} selected`
			: placeholder || t("people.invite.role.placeholder");

	const filteredRoles = availableRoles.filter((role) => {
		const label = (() => {
			switch (role.value) {
				case "admin":
					return t("people.roles.admin");
				case "auditor":
					return t("people.roles.auditor");
				case "employee":
					return t("people.roles.employee");
				case "owner":
					return t("people.roles.owner");
				default:
					return role.value;
			}
		})();
		return label.toLowerCase().includes(searchTerm.toLowerCase());
	});

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between min-h-[40px] h-auto shadow-none"
					disabled={disabled}
				>
					<div className="flex flex-wrap gap-1 items-center">
						{selectedRoles.length === 0 && (
							<span className="text-muted-foreground text-sm">
								{triggerText}
							</span>
						)}
						{selectedRoles.map((role) => (
							<Badge
								key={role}
								variant="secondary"
								className={cn(
									"text-xs",
									lockedRoles.includes(role) &&
										"border border-primary",
								)}
								onClick={(e) => {
									e.stopPropagation(); // Prevent popover trigger
									handleSelect(role);
								}}
							>
								{getRoleLabel(role)}
								{!lockedRoles.includes(role) ? (
									<X className="ml-1 h-3 w-3 cursor-pointer" />
								) : (
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Lock className="ml-1 h-3 w-3 text-primary" />
											</TooltipTrigger>
											<TooltipContent>
												<p>
													{t(
														"people.member_actions.role_dialog.owner_note",
													)}
												</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								)}
							</Badge>
						))}
					</div>
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[--radix-popover-trigger-width] p-0">
				<Command>
					<CommandInput
						placeholder={t("people.filters.search")}
						value={searchTerm}
						onValueChange={setSearchTerm}
					/>
					<CommandList>
						<CommandEmpty>
							{t("people.empty.no_results.title")}
						</CommandEmpty>
						<CommandGroup>
							{filteredRoles.map((role) => (
								<CommandItem
									key={role.value}
									value={(() => {
										switch (role.value) {
											case "owner":
												return t("people.roles.owner");
											case "admin":
												return t("people.roles.admin");
											case "auditor":
												return t(
													"people.roles.auditor",
												);
											case "employee":
												return t(
													"people.roles.employee",
												);
											default:
												return role.value;
										}
									})()} // Use label for search
									onSelect={() => {
										handleSelect(role.value);
									}}
									disabled={
										role.value === "owner" || // Always disable the owner role
										(lockedRoles.includes(role.value) &&
											selectedRoles.includes(role.value)) // Disable any locked roles
									}
									className={cn(
										"flex flex-col items-start py-2", // Adjust padding and alignment
										lockedRoles.includes(role.value) &&
											selectedRoles.includes(
												role.value,
											) &&
											"bg-muted/50 text-muted-foreground",
									)}
								>
									<div className="flex w-full items-center">
										{" "}
										{/* Wrap label and check */}
										<Check
											className={cn(
												"mr-2 h-4 w-4 flex-shrink-0", // Ensure check doesn't shrink
												selectedRoles.includes(
													role.value,
												)
													? "opacity-100"
													: "opacity-0",
											)}
										/>
										<span className="flex-grow">
											{" "}
											{/* Allow label to take space */}
											{(() => {
												switch (role.value) {
													case "owner":
														return t(
															"people.roles.owner",
														);
													case "admin":
														return t(
															"people.roles.admin",
														);
													case "auditor":
														return t(
															"people.roles.auditor",
														);
													case "employee":
														return t(
															"people.roles.employee",
														);
													default:
														return role.value;
												}
											})()}
										</span>
										{lockedRoles.includes(role.value) &&
											selectedRoles.includes(
												role.value,
											) && (
												<span className="ml-auto text-xs text-muted-foreground pl-2 flex-shrink-0">
													(Locked)
												</span>
											)}
									</div>
									{/* Add description below */}
									<div className="ml-6 text-xs text-muted-foreground mt-1">
										{(() => {
											switch (role.value) {
												case "owner":
													return t(
														"people.roles.owner_description",
													);
												case "admin":
													return t(
														"people.roles.admin_description",
													);
												case "auditor":
													return t(
														"people.roles.auditor_description",
													);
												case "employee":
													return t(
														"people.roles.employee_description",
													);
												default:
													return "";
											}
										})()}
									</div>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
