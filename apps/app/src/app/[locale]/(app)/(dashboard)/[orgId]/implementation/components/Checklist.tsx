"use client";

import { Accordion } from "@comp/ui/accordion";
import { ChecklistProps } from "../types/ChecklistProps.types";
import { ChecklistItem } from "./ChecklistItem";

export function Checklist({ items }: ChecklistProps) {
    return (
        <div className="flex flex-col gap-4">
            {items.map((item) => (
                <ChecklistItem key={item.dbColumn} {...item} />
            ))}
        </div>
    );
}