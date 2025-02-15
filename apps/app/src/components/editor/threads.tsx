import { FloatingComposer, FloatingThreads } from "@liveblocks/react-tiptap";
import { useThreads } from "@liveblocks/react/suspense";
import { useEditor } from "novel";
import { useSyncExternalStore } from "react";

export function Threads() {
  const { editor } = useEditor();
  const { threads } = useThreads({ query: { resolved: false } });

  if (!editor) {
    return null;
  }

  return (
    <>
      <FloatingComposer editor={editor} color="light" />
      <FloatingThreads editor={editor} threads={threads} color="light" />
    </>
  );
}

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

function subscribe(callback: () => void) {
  const query = window.matchMedia("(max-width: 1279px)");

  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getSnapshot() {
  const query = window.matchMedia("(max-width: 1279px)");
  return query.matches;
}
