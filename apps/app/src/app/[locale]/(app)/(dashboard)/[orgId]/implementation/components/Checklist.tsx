"use client";

import { ChecklistItemProps } from "../types";
import { ChecklistItem } from "./ChecklistItem";

export function Checklist({ items }: { items: ChecklistItemProps[] }) {
	return (
		<div className="flex flex-col gap-4">
			{items.map((item) => (
				<ChecklistItem key={`checklist-${item.dbColumn}`} {...item} />
			))}
		</div>
	);
}
