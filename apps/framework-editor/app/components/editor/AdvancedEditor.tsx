"use client";

import {
	EditorContent,
	EditorRoot,
	type JSONContent,
	// Import Novel command components
	EditorCommand,
	EditorCommandEmpty,
	EditorCommandItem,
	EditorCommandList,
	// handleCommandNavigation is needed for keyboard nav in command list
	handleCommandNavigation,
} from "novel";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { defaultExtensions } from "./extensions"; // Correct path (same directory)
import type { Extensions } from "@tiptap/core";
import type { Editor } from "@tiptap/core";
import { Separator } from "@comp/ui/separator"; // Assuming Separator exists

// Import the new selector components
import { NodeSelector } from "./selectors/NodeSelector";
import { LinkSelector } from "./selectors/LinkSelector";
import { TextButtons } from "./selectors/TextButtons";
// Import the suggestion items to render them
import { suggestionItems } from "./slash-command";

const extensionsList: Extensions = [...defaultExtensions]; // Renamed to avoid conflict

interface AdvancedEditorProps {
	initialContent?: JSONContent | JSONContent[];
	onSave?: (content: JSONContent) => Promise<void>;
	readOnly?: boolean;
	saveDebounceMs?: number;
}

const AdvancedEditor = ({
	initialContent,
	onSave,
	readOnly = false,
	saveDebounceMs = 1000,
}: AdvancedEditorProps) => {
	const [saveStatus, setSaveStatus] = useState<"Saved" | "Saving" | "Unsaved">(
		"Saved",
	);
	const [charsCount, setCharsCount] = useState<number>(0);
	const [editor, setEditor] = useState<Editor | null>(null); // Store editor instance

	// State for popovers
	const [isNodeSelectorOpen, setIsNodeSelectorOpen] = useState(false);
	const [isLinkSelectorOpen, setIsLinkSelectorOpen] = useState(false);

	const debouncedSave = useDebouncedCallback(async (content: JSONContent) => {
		if (!onSave) return;
		setSaveStatus("Saving");
		try {
			await onSave(content);
			setSaveStatus("Saved");
		} catch (err) {
			console.error("Failed to save content:", err);
			setSaveStatus("Unsaved"); // Keep as Unsaved on error
		}
	}, saveDebounceMs);

	useEffect(() => {
		// Update word count when editor instance is available
		if (editor) {
			// Remove @ts-expect-error - Try relying on type inference or check Novel types
			const wordCount = editor.storage.characterCount?.words() ?? 0;
			setCharsCount(wordCount);
		}
	}, [editor, editor?.storage.characterCount]); // Depend on storage for updates

	if (!initialContent) {
		console.warn("AdvancedEditor: initialContent is missing.");
		return null; // Or return a loading state
	}

	return (
		<div className="relative w-full bg-background border rounded-xs flex flex-col gap-2">
			{/* Toolbar Area */}
			{!readOnly && (
				<div className="flex items-center gap-1 p-2 border-b sticky top-0 bg-background z-10 flex-wrap">
					<NodeSelector
						editor={editor}
						isOpen={isNodeSelectorOpen}
						onOpenChange={setIsNodeSelectorOpen}
					/>
					<Separator orientation="vertical" className="h-6" />
					<LinkSelector
						editor={editor}
						isOpen={isLinkSelectorOpen}
						onOpenChange={setIsLinkSelectorOpen}
					/>
					<Separator orientation="vertical" className="h-6" />
					<TextButtons editor={editor} />
					{/* Add other selectors/buttons here */}
					<div className="ml-auto flex items-center gap-2">
						<div className="bg-accent px-2 py-1 text-sm text-muted-foreground rounded-xs">
							{saveStatus}
						</div>
						<div className="bg-accent px-2 py-1 text-sm text-muted-foreground rounded-xs">
							{charsCount} Words
						</div>
					</div>
				</div>
			)}
			<EditorRoot>
				<EditorContent
					immediatelyRender={false}
					initialContent={initialContent}
					extensions={extensionsList}
					className="relative min-h-[300px] p-4 w-full bg-background p-2 overflow-y-auto prose prose-sm sm:prose-base dark:prose-invert focus:outline-hidden max-w-full"
					editorProps={{
						editable: () => !readOnly,
						// attributes class is now on className prop of EditorContent directly
						// Add keydown handler for command navigation
						handleKeyDown: (view, event) => handleCommandNavigation(event),
					}}
					onUpdate={({ editor: currentEditor }) => {
						setEditor(currentEditor);
						const content = currentEditor.getJSON();
						const wordCount =
							currentEditor.storage.characterCount?.words() ?? 0;
						setCharsCount(wordCount);

						if (onSave) {
							setSaveStatus("Unsaved");
							debouncedSave(content);
						}
					}}
					onSelectionUpdate={({ editor: currentEditor }) => {
						setEditor(currentEditor);
						const wordCount =
							currentEditor.storage.characterCount?.words() ?? 0;
						setCharsCount(wordCount);
					}}
				>
					{/* Add EditorCommand structure here */}
					<EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
						<EditorCommandEmpty className="px-2 text-muted-foreground">
							No results
						</EditorCommandEmpty>
						<EditorCommandList>
							{suggestionItems.map((item) => (
								<EditorCommandItem
									value={item.title}
									onCommand={(value) => {
										if (item.command) {
											item.command(value as any);
										}
									}}
									className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
									key={item.title}
								>
									<div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
										{item.icon}
									</div>
									<div>
										<p className="font-medium">{item.title}</p>
										<p className="text-xs text-muted-foreground">
											{item.description}
										</p>
									</div>
								</EditorCommandItem>
							))}
						</EditorCommandList>
					</EditorCommand>
				</EditorContent>
			</EditorRoot>
		</div>
	);
};

export default AdvancedEditor;
