import { useAssistantStore } from "@/store/assistant";
import { Button } from "@bubba/ui/button";
import { Icons } from "@bubba/ui/icons";
import { Beta } from "../beta";

type Props = {
  isExpanded: boolean;
  toggleSidebar: () => void;
};

export function Header({ toggleSidebar, isExpanded }: Props) {
  const { setClose } = useAssistantStore();

  return (
    <div className="px-4 py-3 flex justify-between items-center border-border border-b-[1px]">
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="icon"
          className="size-8 z-50 p-0"
          onClick={toggleSidebar}
        >
          {isExpanded ? (
            <Icons.SidebarFilled width={18} />
          ) : (
            <Icons.Sidebar width={18} />
          )}
        </Button>

        <h2>Assistant</h2>
      </div>

      <Button
        className="flex md:hidden"
        size="icon"
        variant="ghost"
        onClick={setClose}
      >
        <Icons.Close />
      </Button>

      <div className="space-x-2 items-center hidden md:flex todesktop:flex">
        <Beta className="border-border text-muted-foreground" />
      </div>
    </div>
  );
}
