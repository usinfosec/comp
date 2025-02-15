import { useI18n } from "@/locales/client";
import { CommandGroup, CommandItem, CommandSeparator } from "@bubba/ui/command";
import {
  ArrowDownWideNarrow,
  CheckCheck,
  RefreshCcwDot,
  StepForward,
  WrapText,
} from "lucide-react";
import { useEditor } from "novel";
import { getPrevText } from "novel";

interface AISelectorCommandsProps {
  onSelect: (value: string, option: string) => void;
}

const AISelectorCommands = ({ onSelect }: AISelectorCommandsProps) => {
  const { editor } = useEditor();
  const t = useI18n();

  const options = [
    {
      value: "improve",
      label: t("editor.ai_selector.improve"),
      icon: RefreshCcwDot,
    },

    {
      value: "fix",
      label: t("editor.ai_selector.fix"),
      icon: CheckCheck,
    },
    {
      value: "shorter",
      label: t("editor.ai_selector.shorter"),
      icon: ArrowDownWideNarrow,
    },
    {
      value: "longer",
      label: t("editor.ai_selector.longer"),
      icon: WrapText,
    },
  ];

  return (
    <>
      <CommandGroup heading="Edit or review selection">
        {options.map((option) => (
          <CommandItem
            onSelect={(value) => {
              if (!editor) {
                return;
              }

              const slice = editor.state.selection.content();
              const text = editor.storage.markdown?.serializer?.serialize(
                slice.content,
              );
              onSelect(text, value);
            }}
            className="flex gap-2 px-4"
            key={option.value}
            value={option.value}
          >
            <option.icon className="h-4 w-4 text-purple-500" />
            {option.label}
          </CommandItem>
        ))}
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Use AI to do more">
        <CommandItem
          onSelect={() => {
            if (!editor) {
              return;
            }

            const pos = editor.state.selection.from;

            const text = getPrevText(editor, pos);
            onSelect(text, "continue");
          }}
          value="continue"
          className="gap-2 px-4"
        >
          <StepForward className="h-4 w-4 text-purple-500" />
          {t("editor.ai_selector.continue")}
        </CommandItem>
      </CommandGroup>
    </>
  );
};

export default AISelectorCommands;
