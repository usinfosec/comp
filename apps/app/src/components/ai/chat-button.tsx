"use client";

import { Button } from "@comp/ui/button";
import { useMediaQuery } from "@comp/ui/hooks";
import { cn } from "@comp/ui/cn";
import { useQueryState } from "nuqs";

export function AssistantButton() {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const [, setAssistantOpen] = useQueryState("assistant", {
		history: "push",
		parse: (value) => value === "true",
		serialize: (value) => value.toString(),
	});

	if (!isDesktop) {
		return null;
	}

	return (
		<Button
			variant="ghost"
			size="default"
			className={cn(
				"relative w-full max-w-sm justify-start text-muted-foreground",
				"hover:bg-accent hover:text-accent-foreground"
			)}
			onClick={() => setAssistantOpen(true)}
		>
			<span className="truncate">Ask Comp AI a question...</span>
			<kbd className="ml-auto flex h-5 items-center gap-1 rounded-xs border bg-muted px-1.5 font-mono text-[10px] font-medium">
				<span className="text-xs">⌘</span>K
			</kbd>
		</Button>
	);
}
