import type { User as NextAuthUser } from "next-auth";
import { createContext } from "react";
import { createStore } from "zustand";

type User = {
  id: string;
  organizationId?: string;
  full_name?: string;
  avatar_url?: string;
} & NextAuthUser;

export interface UserProps {
  data: User | null;
}

export interface UserState extends UserProps {
  setUser: (user: User) => void;
}

export const createUserStore = (initProps: UserProps) => {
  return createStore<UserState>()((set) => ({
    data: initProps?.data,
    setUser: (user: User) => set({ data: user }),
  }));
};

export type UserStore = ReturnType<typeof createUserStore>;
export const UserContext = createContext<UserStore | null>(null);
