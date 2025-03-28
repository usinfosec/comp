"use client";

import { Sheet, SheetContent } from "@bubba/ui/sheet";
import { useQueryState } from "nuqs";
import Chat from "../ai/chat";

export function AssistantSheet() {
  const [isOpen, setIsOpen] = useQueryState("assistant", {
    history: "push",
    parse: (value) => value === "true",
    serialize: (value) => value.toString(),
  });

  return (
    <Sheet open={isOpen ?? false} onOpenChange={(open) => setIsOpen(open)}>
      <SheetContent>
        <Chat />
      </SheetContent>
    </Sheet>
  );
}