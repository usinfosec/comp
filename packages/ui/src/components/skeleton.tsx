import type * as React from "react";
import { cn } from "../utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse bg-muted rounded-sm", className)} {...props} />;
}

export { Skeleton };
