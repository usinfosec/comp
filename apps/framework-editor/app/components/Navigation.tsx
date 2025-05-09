"use client"

import { useSelectedLayoutSegment, useSelectedLayoutSegments } from "next/navigation";
import Link from "next/link";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@comp/ui/tabs";

export function Navigation() {
    const segments = useSelectedLayoutSegments();

    const navItems = [
        { name: "Frameworks", href: "/frameworks", segment: "frameworks" },
        { name: "Controls", href: "/controls", segment: "controls" },
        { name: "Policies", href: "/policies", segment: "policies" },
        { name: "Tasks", href: "/tasks", segment: "tasks" },
    ];

    const currentSegment = segments[1]  

    return (
        <Tabs defaultValue={currentSegment} className="w-full" value={currentSegment}>
            <TabsList className="grid w-full grid-cols-4">
                {navItems.map((item) => (
                    <TabsTrigger key={item.name} value={item.segment} asChild>
                        <Link href={item.href}>{item.name}</Link>
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
}

// Ensure named export
export default Navigation;