import * as React from "react";

import { cn } from "../utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
	({ className, type, ...props }, ref) => {
		const isUrl = type === "url";

		const adornmentWidth = 74; // px, matches pl-[74px]
		return (
			<div className={cn("relative w-full", className)}>
				{isUrl && (
					<span
						className="absolute left-0 top-0 h-full flex items-center px-3 text-muted-foreground select-none text-base md:text-sm border-r-1 border-input bg-foreground/5 cursor-default font-semibold"
						style={{
							width: adornmentWidth,
							zIndex: 2,
							borderTopLeftRadius: "0.125rem",
							borderBottomLeftRadius: "0.125rem",
						}}
					>
						https://
					</span>
				)}
				<input
					type={type}
					className={cn(
						"flex h-9 w-full rounded-sm border border-input bg-background py-1 text-base transition-colors",
						"placeholder:text-muted-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
						"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0",
						"disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
						isUrl ? "pl-[80px]" : "px-3",
					)}
					ref={ref}
					{...props}
				/>
			</div>
		);
	},
);
Input.displayName = "Input";

export { Input };
