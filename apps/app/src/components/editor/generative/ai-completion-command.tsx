import { useI18n } from "@/locales/client";
import { CommandGroup, CommandItem, CommandSeparator } from "@bubba/ui/command";
import { Check, TextQuote, TrashIcon } from "lucide-react";
import { useEditor } from "novel";

const AICompletionCommands = ({
  completion,
  onDiscard,
}: {
  completion: string;
  onDiscard: () => void;
}) => {
  const { editor } = useEditor();
  const t = useI18n();

  return (
    <>
      <CommandGroup>
        <CommandItem
          className="gap-2 px-4"
          value="replace"
          onSelect={() => {
            if (!editor) {
              return;
            }

            const selection = editor.view.state.selection;

            editor
              .chain()
              .focus()
              .insertContentAt(
                {
                  from: selection.from,
                  to: selection.to,
                },
                completion,
              )
              .run();
          }}
        >
          <Check className="h-4 w-4 text-muted-foreground" />
          {t("editor.ai_selector.replace")}
        </CommandItem>
        <CommandItem
          className="gap-2 px-4"
          value="insert"
          onSelect={() => {
            if (!editor) {
              return;
            }

            const selection = editor.view.state.selection;
            editor
              .chain()
              .focus()
              .insertContentAt(selection.to + 1, completion)
              .run();
          }}
        >
          <TextQuote className="h-4 w-4 text-muted-foreground" />
          {t("editor.ai_selector.insert")}
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />

      <CommandGroup>
        <CommandItem onSelect={onDiscard} value="thrash" className="gap-2 px-4">
          <TrashIcon className="h-4 w-4 text-muted-foreground" />
          {t("editor.ai_selector.discard")}
        </CommandItem>
      </CommandGroup>
    </>
  );
};

export default AICompletionCommands;
