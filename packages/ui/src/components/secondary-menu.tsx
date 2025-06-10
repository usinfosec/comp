"use client";

import { Button } from "@comp/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@comp/ui/tooltip";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "../utils";

interface SecondaryMenuProps {
	items: {
		enabled?: boolean;
		path: string;
		label: string;
		query?: Record<string, string>;
		// We use this to override the active state for a specific item based on the prefix of the id
		activeOverrideIdPrefix?: string;
	}[];
	isChild?: boolean;
	showBackButton?: boolean;
	backButtonHref?: string;
	backButtonLabel?: string;
}

export function SecondaryMenu({
	items,
	isChild,
	showBackButton,
	backButtonHref = "/",
	backButtonLabel = "Back",
}: SecondaryMenuProps) {
	const pathname = usePathname();

	function getPathSegments(path: string) {
		return path.split("/").filter(Boolean);
	}

	function isActiveLink(
		itemPath: string,
		activeOverrideIdPrefix?: string,
	): boolean {
		const currentSegments = getPathSegments(pathname);
		const itemSegments = getPathSegments(itemPath);

		const segmentsToCompare = currentSegments.slice(0, 3);

		if (
			activeOverrideIdPrefix &&
			currentSegments.toString().includes(activeOverrideIdPrefix)
		) {
			return true;
		}

		return (
			segmentsToCompare.length === itemSegments.length &&
			itemSegments.every((segment, i) => segment === segmentsToCompare[i])
		);
	}

	return (
		<nav className={cn(isChild ? "py-0" : "pt-0")} key={pathname}>
			<div className="flex items-center gap-2 overflow-auto py-2 border-b border-border">
				{showBackButton && (
					<Button variant="ghost" size="sm" asChild>
						<Link href={backButtonHref}>
							<ArrowLeft className="h-4 w-4" />
							<span className="ml-1">{backButtonLabel}</span>
						</Link>
					</Button>
				)}
				{items.map((item) => {
					const isDisabled = item.enabled === false;
					const isActive = isActiveLink(item.path, item.activeOverrideIdPrefix);

					if (isDisabled) {
						return (
							<TooltipProvider key={item.path}>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="sm"
											className="opacity-50 cursor-not-allowed"
											disabled
										>
											{item.label}
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										Coming soon
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						);
					}

					return (
						<Button
							key={item.path}
							variant={isActive ? "secondary" : "ghost"}
							size="sm"
							className={cn(
								isActive && "bg-accent font-medium"
							)}
							asChild
						>
							<Link href={{ pathname: item.path }}>
								{item.label}
							</Link>
						</Button>
					);
				})}
			</div>
		</nav>
	);
}
