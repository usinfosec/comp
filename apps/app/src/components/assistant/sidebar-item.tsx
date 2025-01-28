import type { Chat } from "@/actions/ai/types";
import { cn } from "@bubba/ui/cn";

interface SidebarItemProps {
  chat: Chat;
  chatId?: string;
  onSelect: (id: string) => void;
}

export function SidebarItem({ chat, chatId, onSelect }: SidebarItemProps) {
  return (
    <button
      type="button"
      className={cn(
        "text-left transition-colors px-0 py-1 rounded-lg w-full text-muted-foreground hover:text-primary",
        chatId === chat.id && "text-primary",
      )}
      onClick={() => onSelect(chat.id as any)}
    >
      <span className="text-xs line-clamp-1">{chat.title}</span>
    </button>
  );
}
