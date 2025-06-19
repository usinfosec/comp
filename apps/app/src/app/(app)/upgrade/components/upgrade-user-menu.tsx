'use client';

import { authClient } from '@/utils/auth-client';
import { Avatar, AvatarFallback, AvatarImage } from '@comp/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@comp/ui/dropdown-menu';
import type { User } from 'better-auth';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface UpgradeUserMenuProps {
  user: User;
}

export function UpgradeUserMenu({ user }: UpgradeUserMenuProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/auth');
        },
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-md p-1 hover:bg-muted transition-colors">
          <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image ?? ''} />
            <AvatarFallback className="text-xs">{user.name?.[0] || user.email?.[0]}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isSigningOut ? 'Signing out...' : 'Sign out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
