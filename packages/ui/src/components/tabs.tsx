"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { useEffect, useRef, useState } from "react";

import { cn } from "@comp/ui/cn";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
	const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" });
	const [activeValue, setActiveValue] = useState<string>("");
	const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
	const listRef = useRef<HTMLDivElement>(null);

	// Update active indicator position when active tab changes
	useEffect(() => {
		if (activeValue) {
			const activeElement = tabRefs.current.get(activeValue);
			if (activeElement && listRef.current) {
				const listRect = listRef.current.getBoundingClientRect();
				const activeRect = activeElement.getBoundingClientRect();
				const relativeLeft = activeRect.left - listRect.left;
				
				setActiveStyle({
					left: `${relativeLeft}px`,
					width: `${activeRect.width}px`,
				});
			}
		}
	}, [activeValue]);

	// Handle window resize to recalculate positions
	useEffect(() => {
		const handleResize = () => {
			if (activeValue) {
				requestAnimationFrame(() => {
					const activeElement = tabRefs.current.get(activeValue);
					if (activeElement && listRef.current) {
						const listRect = listRef.current.getBoundingClientRect();
						const activeRect = activeElement.getBoundingClientRect();
						const relativeLeft = activeRect.left - listRect.left;
						
						setActiveStyle({
							left: `${relativeLeft}px`,
							width: `${activeRect.width}px`,
						});
					}
				});
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [activeValue]);

	return (
		<TabsPrimitive.List
			ref={(node) => {
				listRef.current = node;
				if (typeof ref === 'function') {
					ref(node);
				} else if (ref) {
					ref.current = node;
				}
			}}
			className={cn(
				"relative inline-flex h-9 items-center justify-center rounded-sm bg-muted p-1 text-muted-foreground",
				className,
			)}
			onValueChange={(value) => setActiveValue(value)}
			{...props}
		>
			{/* Active Indicator */}
			<div
				className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-out rounded-t-xs"
				style={activeStyle}
			/>
			
			{React.Children.map(props.children, (child) => {
				if (React.isValidElement(child) && child.type === TabsTrigger) {
					return React.cloneElement(child, {
						...child.props,
						ref: (node: HTMLButtonElement) => {
							if (node && child.props.value) {
								tabRefs.current.set(child.props.value, node);
							}
							// Handle existing ref if present
							if (child.ref) {
								if (typeof child.ref === 'function') {
									child.ref(node);
								} else {
									child.ref.current = node;
								}
							}
						},
						onFocus: (e: React.FocusEvent<HTMLButtonElement>) => {
							setActiveValue(child.props.value);
							child.props.onFocus?.(e);
						},
						onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
							setActiveValue(child.props.value);
							child.props.onClick?.(e);
						},
					});
				}
				return child;
			})}
		</TabsPrimitive.List>
	);
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Trigger
		ref={ref}
		className={cn(
			"inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
			className,
		)}
		{...props}
	/>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Content
		ref={ref}
		className={cn(
			"mt-2 ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
			className,
		)}
		{...props}
	/>
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
