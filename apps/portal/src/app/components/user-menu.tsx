import { getI18n } from "@/app/locales/server";
import { Avatar, AvatarFallback, AvatarImageNext } from "@bubba/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@bubba/ui/dropdown-menu";
import type { auth } from "../lib/auth";
import { Logout } from "./logout";

export async function UserMenu({
  session,
}: { session: Awaited<ReturnType<typeof auth.api.getSession>> }) {
  const t = await getI18n();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="rounded-full w-8 h-8 cursor-pointer">
          {session?.user?.image && (
            <AvatarImageNext
              src={session?.user?.image}
              alt={session?.user?.name ?? ""}
              width={32}
              height={32}
              quality={100}
            />
          )}
          <AvatarFallback>
            <span className="text-xs">
              {session?.user?.name?.charAt(0)?.toUpperCase()}
            </span>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px]" sideOffset={10} align="end">
        <DropdownMenuItem>
          <Logout />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
