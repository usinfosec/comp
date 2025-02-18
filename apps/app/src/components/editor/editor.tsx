"use client";

import { EditorContent, type JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";

const Tiptap = ({ content }: { content: JSONContent }) => {
  const [editorState, setEditorState] = useState<JSONContent | null>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
  });

  useEffect(() => {
    setEditorState(JSON.parse(editor?.getText() || "{}"));
  }, [editor]);

  return <EditorContent editor={editor} />;
};

export default Tiptap;
