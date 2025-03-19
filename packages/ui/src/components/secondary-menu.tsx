"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@bubba/ui/tooltip";
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
    <nav className={cn(isChild ? "py-0 select-none" : "pt-4 select-none")}>
      <ul
        className={cn(
          "scrollbar-hide flex overflow-auto py-2 text-sm",
          isChild ? "space-x-3" : "space-x-6",
        )}
      >
        {showBackButton && (
          <li>
            <Link
              href={backButtonHref}
              className="flex items-center gap-1 hover:text-foreground/80 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{backButtonLabel}</span>
            </Link>
          </li>
        )}
        {items.map((item) => {
          const isDisabled = item.enabled === false;

          const itemContent = (
            <span
              className={cn(
                "hover:bg-secondary p-2",
                isActiveLink(item.path) &&
                "font-medium border-b border-white",
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
