"use client";

import { cn } from "@comp/ui/cn";
import { useQueryState } from "nuqs";

const tabs = [
	{
		name: "All",
		value: "all",
	},
	{
		name: "Installed",
		value: "installed",
	},
];

export function AppsTabs() {
	const [currentTab, setTab] = useQueryState("tab", {
		shallow: false,
		defaultValue: "all",
	});

	return (
		<div className="flex gap-0 border-b">
			{tabs.map((tab) => (
				<button
					onClick={() => setTab(tab.value)}
					key={tab.value}
					type="button"
					className={cn(
						"hover:bg-secondary p-2 border-b-2 font-medium min-w-16 px-4 text-center text-sm",
						currentTab === tab.value ? "border-primary" : "border-transparent",
					)}
				>
					{tab.name}
				</button>
			))}
		</div>
	);
}
