"use client";

import { useI18n } from "@/locales/client";
import { Alert, AlertDescription, AlertTitle } from "@bubba/ui/alert";
import { Button } from "@bubba/ui/button";
import { Card, CardContent, CardHeader } from "@bubba/ui/card";
import { Skeleton } from "@bubba/ui/skeleton";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Text from "@tiptap/extension-text";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import { AlertCircle, Save } from "lucide-react";
import { redirect } from "next/navigation";
import { EditorRoot } from "novel";
import React, { useEffect, useState } from "react";
import { usePolicyDetails } from "../../hooks/usePolicy";
import "@bubba/ui/editor.css";
import { useDebouncedCallback } from "use-debounce";

interface PolicyDetailsProps {
  policyId: string;
}

export function PolicyDetails({ policyId }: PolicyDetailsProps) {
  const t = useI18n();
  const { policy, isLoading, error, updatePolicy } = usePolicyDetails(policyId);

  const [saveStatus, setSaveStatus] = useState<"Saved" | "Saving" | "Unsaved">(
    "Saved",
  );
  const [wordCount, setWordCount] = useState<number>(0);
  const [currentContent, setCurrentContent] = useState<any>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Function to save content with debounce
  const debouncedSave = useDebouncedCallback(async (content: any) => {
    if (!policy) return;

    setSaveStatus("Saving");
    try {
      const contentToSave =
        content.type === "doc" && Array.isArray(content.content)
          ? content.content
          : content;

      await updatePolicy({
        ...policy,
        content: contentToSave,
      });

      setSaveStatus("Saved");
    } catch (err) {
      console.error("Failed to save policy:", err);
      setSaveStatus("Unsaved");
    }
  }, 1000);

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      BulletList,
      OrderedList,
      ListItem,
      Underline,
      Strike,
      Link.configure({
        openOnClick: false,
      }),
      Table.configure({
        resizable: true,
        allowTableNodeSelection: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert focus:outline-none h-full w-full focus:outline-none text-foreground px-16 py-16 max-w-[900px] mx-auto",
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getJSON();
      setCurrentContent(content);

      const text = editor.getText();
      const words = text.trim().split(/\s+/);
      setWordCount(text ? words.length : 0);

      if (initialLoadComplete) {
        setSaveStatus("Unsaved");
        debouncedSave(content);
      }
    },
  });

  useEffect(() => {
    if (editor && policy?.content && !initialLoadComplete) {
      try {
        const formattedContent = {
          type: "doc",
          content: Array.isArray(policy.content) ? policy.content : [],
        };

        setCurrentContent(formattedContent);
        editor.commands.setContent(formattedContent);

        const text = editor.getText();
        const words = text.trim().split(/\s+/);
        setWordCount(text ? words.length : 0);

        setInitialLoadComplete(true);
      } catch (e) {
        console.error("Error setting editor content:", e);
      }
    }
  }, [editor, policy, initialLoadComplete]);

  // Manual save function
  const handleManualSave = () => {
    if (!editor || !policy) return;
    debouncedSave.flush();
  };

  if (error) {
    if (error.code === "NOT_FOUND") {
      redirect("/policies");
    }

    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message || "An unexpected error occurred"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex flex-col space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!policy) return null;

  return (
    <div className="relative max-h-[calc(100vh-100px)] w-full">
      <div className="absolute right-5 top-5 z-10 mb-5 gap-2 hidden sm:flex">
        <div className="bg-accent/50 px-2 py-1 text-sm text-muted-foreground rounded-md">
          {saveStatus}
        </div>
        <div className="bg-accent/50 px-2 py-1 text-sm text-muted-foreground rounded-md">
          {wordCount} Words
        </div>
      </div>

      <EditorRoot>
        <EditorContent
          className="max-h-[calc(100vh-100px)] prose prose-sm max-w-none overflow-auto"
          editor={editor}
        />
      </EditorRoot>
    </div>
  );
}
