"use client";

import { STATUS_FILTERS } from "./filterConfigs";
import type { User } from "next-auth";

interface FilterCategoriesProps {
	status: string | null;
	setStatus: (status: string | null) => void;
	ownerId: string | null;
	setOwnerId: (ownerId: string | null) => void;
	users: User[];
	setPage: (page: string) => void;
}

export function getFilterCategories({
	status,
	setStatus,
	ownerId,
	setOwnerId,
	users,
	setPage,
}: FilterCategoriesProps) {
	return [
		{
			label: "Filter by Status",
			items: STATUS_FILTERS.map((filter) => ({
				...filter,
				checked: status === filter.value,
				onChange: (checked: boolean) => {
					setStatus(checked ? filter.value : null);
					setPage("1");
				},
			})),
		},
		{
			label: "Filter by Owner",
			items: users.map((user) => ({
				label: user.name || "Unknown",
				value: user.id || "",
				checked: ownerId === user.id,
				onChange: (checked: boolean) => {
					setOwnerId(checked ? user.id || null : null);
					setPage("1");
				},
				icon: (
					<div className="h-5 w-5">
						{user.image ? (
							<img
								src={user.image}
								alt={user.name || "Unknown"}
								className="h-5 w-5 rounded-full"
							/>
						) : (
							<div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">
								{(user.name || "?").charAt(0)}
							</div>
						)}
					</div>
				),
			})),
			maxHeight: "150px",
		},
	];
}
