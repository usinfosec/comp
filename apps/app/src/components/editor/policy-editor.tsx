"use client";

import { Button } from "@bubba/ui/button";
import { cn } from "@bubba/ui/cn";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import type { JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, ListOrdered, ListTree, Save } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";

interface PolicyEditorProps {
  policyId: string;
  content: JSONContent[];
  readOnly?: boolean;
}

export function PolicyEditor({
  policyId,
  content,
  readOnly = false,
}: PolicyEditorProps) {
  const [editorContent, setEditorContent] = useState<JSONContent[]>(content);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const debouncedContent = useDebounce(editorContent, 1000);

  const documentContent = {
    type: "doc",
    content: Array.isArray(content) ? content : [],
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: documentContent,
    editable: !readOnly,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none p-4 focus:outline-none min-h-[300px]",
      },
    },
    onUpdate: ({ editor }) => {
      try {
        const json = editor.getJSON().content;
        if (json) {
          setEditorContent(json as JSONContent[]);
          setIsDirty(true);
        }
      } catch (error) {
        console.error("Error updating editor content:", error);
      }
    },
  });

  if (!editor) {
    return (
      <div className="p-4 border rounded-md animate-pulse">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[calc(100vh-300px)] border border-border rounded-md bg-background">
      {!readOnly && (
        <div className="flex justify-end p-2 border-b border-border">
          <Button
            variant="outline"
            size="sm"
            disabled={isSaving || !isDirty}
            className={cn("gap-1", isSaving && "opacity-50 cursor-not-allowed")}
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      )}

      {editor && !readOnly && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="flex bg-background border border-border rounded-md shadow-md overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={cn(
                "rounded-none",
                editor.isActive("bold") && "bg-accent",
              )}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={cn(
                "rounded-none",
                editor.isActive("italic") && "bg-accent",
              )}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={cn(
                "rounded-none",
                editor.isActive("bulletList") && "bg-accent",
              )}
            >
              <ListTree className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={cn(
                "rounded-none",
                editor.isActive("orderedList") && "bg-accent",
              )}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>
        </BubbleMenu>
      )}

      <EditorContent editor={editor} className="prose-override" />

      {isDirty && !readOnly && (
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
          {isSaving ? "Saving..." : "Unsaved changes"}
        </div>
      )}
    </div>
  );
}
