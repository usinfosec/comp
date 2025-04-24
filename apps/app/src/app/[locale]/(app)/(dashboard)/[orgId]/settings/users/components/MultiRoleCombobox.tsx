"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
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

// Define the selectable roles explicitly (exclude owner)
const selectableRoles: { value: Role; labelKey: string }[] = [
	{ value: "admin", labelKey: "people.roles.admin" },
	{ value: "employee", labelKey: "people.roles.employee" },
	{ value: "auditor", labelKey: "people.roles.auditor" },
];

interface MultiRoleComboboxProps {
	selectedRoles: Role[];
	onSelectedRolesChange: (roles: Role[]) => void;
	placeholder?: string;
	disabled?: boolean;
}

export function MultiRoleCombobox({
	selectedRoles: inputSelectedRoles,
	onSelectedRolesChange,
	placeholder,
	disabled = false,
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

	const handleSelect = (roleValue: Role) => {
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

	const filteredRoles = selectableRoles.filter((role) => {
		const label = (() => {
			switch (role.value) {
				case "admin":
					return t("people.roles.admin");
				case "auditor":
					return t("people.roles.auditor");
				case "employee":
					return t("people.roles.employee");
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
					className="w-full justify-between min-h-[40px] h-auto"
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
								className="text-xs"
								onClick={(e) => {
									e.stopPropagation(); // Prevent popover trigger
									handleSelect(role);
								}}
							>
								{getRoleLabel(role)}
								<X className="ml-1 h-3 w-3 cursor-pointer" />
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
										// Keep popover open for multi-select
										// setOpen(false)
									}}
									disabled={role.value === "owner"} // Should already be excluded, but double check
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											selectedRoles.includes(role.value)
												? "opacity-100"
												: "opacity-0",
										)}
									/>
									{(() => {
										switch (role.value) {
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
									})()}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
