"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@bubba/ui/tooltip";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../utils";

interface SecondaryMenuProps {
  items: {
    enabled?: boolean;
    path: string;
    label: string;
    query?: Record<string, string>;
  }[];
  isChild?: boolean;
}

export function SecondaryMenu({ items, isChild }: SecondaryMenuProps) {
  const pathname = usePathname();

  function getPathSegments(path: string) {
    return path.split("/").filter(Boolean);
  }

  function isActiveLink(itemPath: string) {
    const currentSegments = getPathSegments(pathname);
    const itemSegments = getPathSegments(itemPath);

    const segmentsToCompare = currentSegments.slice(0, 3);

    return (
      segmentsToCompare.length === itemSegments.length &&
      itemSegments.every((segment, i) => segment === segmentsToCompare[i])
    );
  }

  return (
    <nav className={cn(isChild ? "py-0" : "py-4")}>
      <ul
        className={cn(
          "scrollbar-hide flex overflow-auto text-sm",
          isChild ? "space-x-3" : "space-x-6",
        )}
      >
        {items.map((item) => {
          const isDisabled = item.enabled === false;

          const itemContent = (
            <span
              className={cn(
                "text-muted-foreground",
                isActiveLink(item.path) &&
                  "font-medium underline underline-offset-8",
                isDisabled && "opacity-50 cursor-pointer",
              )}
            >
              {item.label}
            </span>
          );

          return (
            <li key={item.path}>
              {isDisabled ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>{itemContent}</TooltipTrigger>
                    <TooltipContent>
                      <p>Coming soon</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Link
                  prefetch
                  href={{
                    pathname: item.path,
                  }}
                >
                  {itemContent}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
