"use client";
import { Button } from "@comp/ui/button";
import { Drawer, DrawerContent, DrawerTitle } from "@comp/ui/drawer";
import { useMediaQuery } from "@comp/ui/hooks";
import { ScrollArea } from "@comp/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@comp/ui/sheet";
import { X } from "lucide-react";
import { useQueryState } from "nuqs";
import { ContextForm } from "./context-form";

export function CreateContextSheet() {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [open, setOpen] = useQueryState("create-context-sheet");
    const isOpen = Boolean(open);

    const handleOpenChange = (open: boolean) => {
        setOpen(open ? "true" : null);
    };

    if (isDesktop) {
        return (
            <Sheet open={isOpen} onOpenChange={handleOpenChange}>
                <SheetContent stack className="rounded-sm">
                    <SheetHeader className="mb-8 flex justify-between items-center flex-row">
                        <SheetTitle>Add Context Entry</SheetTitle>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="p-0 m-0 size-auto hover:bg-transparent rounded-sm"
                            onClick={() => setOpen(null)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </SheetHeader>
                    <ScrollArea className="h-full p-0 pb-[100px]" hideScrollbar>
                        <ContextForm onSuccess={() => setOpen(null)} />
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        );
    }
    return (
        <Drawer open={isOpen} onOpenChange={handleOpenChange}>
            <DrawerTitle hidden>Add Context Entry</DrawerTitle>
            <DrawerContent className="p-6 rounded-sm">
                <ContextForm onSuccess={() => setOpen(null)} />
            </DrawerContent>
        </Drawer>
    );
}